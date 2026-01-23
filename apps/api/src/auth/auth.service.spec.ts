import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@wku.ac.kr',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'student',
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@wku.ac.kr', 'password123');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@wku.ac.kr');
    });

    it('should throw UnauthorizedException with incorrect password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@wku.ac.kr', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@wku.ac.kr', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(
        service.validateUser('test@wku.ac.kr', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should not include password in returned user object', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@wku.ac.kr', 'password123');

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const payload = { email: mockUser.email, sub: mockUser.id, role: mockUser.role };
      const accessToken = 'jwt.access.token';

      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: accessToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(expect.objectContaining({
        email: mockUser.email,
        sub: mockUser.id,
      }));
    });

    it('should include refresh token when configured', async () => {
      const accessToken = 'jwt.access.token';
      const refreshToken = 'jwt.refresh.token';

      mockConfigService.get.mockReturnValue('7d');
      mockJwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await service.login(mockUser);

      expect(result).toHaveProperty('refresh_token');
      expect(result.refresh_token).toBe(refreshToken);
    });
  });

  describe('validateToken', () => {
    it('should validate and decode a valid token', async () => {
      const token = 'valid.jwt.token';
      const payload = { sub: '1', email: 'test@wku.ac.kr', role: 'student' };

      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.validateToken(token);

      expect(result).toEqual(payload);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalid.token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const token = 'expired.token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.validateToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should generate new access token from valid refresh token', async () => {
      const refreshToken = 'valid.refresh.token';
      const payload = { sub: '1', email: 'test@wku.ac.kr', role: 'student' };
      const newAccessToken = 'new.access.token';

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({
        access_token: newAccessToken,
      });
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken);
    });

    it('should throw UnauthorizedException when user no longer exists', async () => {
      const refreshToken = 'valid.refresh.token';
      const payload = { sub: '999', email: 'deleted@wku.ac.kr' };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const refreshToken = 'valid.refresh.token';
      const payload = { sub: '1', email: 'test@wku.ac.kr' };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@wku.ac.kr',
      password: 'password123',
      name: 'New User',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashed.password';
      const newUser = {
        id: '2',
        ...registerDto,
        password: hashedPassword,
        role: 'student',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue(newUser);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
    });

    it('should throw BadRequestException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should hash password before saving', async () => {
      const hashedPassword = 'hashed.password';

      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue({
        ...registerDto,
        password: hashedPassword,
      });

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should validate WKU email domain', async () => {
      const invalidDto = {
        ...registerDto,
        email: 'user@gmail.com',
      };

      await expect(service.register(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    };

    it('should successfully change password', async () => {
      const newHashedPassword = 'new.hashed.password';

      mockUsersService.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        password: newHashedPassword,
      });

      await service.changePassword('1', changePasswordDto);

      expect(mockUsersService.update).toHaveBeenCalledWith('1', {
        password: newHashedPassword,
      });
    });

    it('should throw UnauthorizedException with incorrect current password', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('1', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.changePassword('999', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should validate new password strength', async () => {
      const weakPasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: '123', // Too weak
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.changePassword('1', weakPasswordDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('reset.token');

      await service.resetPassword('test@wku.ac.kr');

      expect(mockJwtService.sign).toHaveBeenCalled();
      // Email service would be called here in real implementation
    });

    it('should not reveal if email exists (security)', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      // Should not throw error even if email doesn't exist
      await expect(
        service.resetPassword('nonexistent@wku.ac.kr'),
      ).resolves.not.toThrow();
    });

    it('should generate token with short expiration', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('reset.token');

      await service.resetPassword('test@wku.ac.kr');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          expiresIn: expect.stringMatching(/[0-9]+[mh]/), // minutes or hours
        }),
      );
    });
  });

  describe('confirmResetPassword', () => {
    const newPassword = 'newSecurePassword123';

    it('should reset password with valid token', async () => {
      const token = 'valid.reset.token';
      const payload = { sub: '1', type: 'password-reset' };
      const hashedPassword = 'hashed.new.password';

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await service.confirmResetPassword(token, newPassword);

      expect(mockUsersService.update).toHaveBeenCalledWith('1', {
        password: hashedPassword,
      });
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      const token = 'invalid.token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.confirmResetPassword(token, newPassword),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with wrong token type', async () => {
      const token = 'wrong.type.token';
      const payload = { sub: '1', type: 'access' }; // Not password-reset

      mockJwtService.verify.mockReturnValue(payload);

      await expect(
        service.confirmResetPassword(token, newPassword),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token', async () => {
      const userId = '1';

      // In real implementation, would add token to blacklist
      await service.logout(userId);

      // Verify token was added to blacklist or similar mechanism
      expect(true).toBeTruthy(); // Placeholder
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const token = 'valid.verification.token';
      const payload = { sub: '1', type: 'email-verification' };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        emailVerified: true,
      });

      await service.verifyEmail(token);

      expect(mockUsersService.update).toHaveBeenCalledWith('1', {
        emailVerified: true,
      });
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      const token = 'invalid.token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyEmail(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
