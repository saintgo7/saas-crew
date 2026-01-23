import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

describe('AuthService', () => {
  let service: AuthService
  let usersService: UsersService
  let jwtService: JwtService

  const mockUsersService = {
    findByGithubId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  }

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    rank: 'A',
    level: 5,
    xp: 1000,
    githubId: 'github123',
  }

  const mockGithubProfile = {
    id: 'github123',
    login: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    avatar_url: 'https://example.com/avatar.jpg',
  }

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
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)

    jest.clearAllMocks()
  })

  describe('handleGithubLogin', () => {
    it('should create new user if not exists and return access token', async () => {
      const newUser = { ...mockUser, id: 'new-user-id' }
      mockUsersService.findByGithubId.mockResolvedValue(null)
      mockUsersService.create.mockResolvedValue(newUser)
      mockUsersService.findById.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue('mock-jwt-token')

      const result = await service.handleGithubLogin(mockGithubProfile)

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          avatar: mockUser.avatar,
          rank: mockUser.rank,
          level: mockUser.level,
        },
      })
      expect(mockUsersService.findByGithubId).toHaveBeenCalledWith('github123')
      expect(mockUsersService.create).toHaveBeenCalledWith({
        githubId: 'github123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      })
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        rank: mockUser.rank,
      })
    })

    it('should return existing user and access token if user exists', async () => {
      mockUsersService.findByGithubId.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue('mock-jwt-token')

      const result = await service.handleGithubLogin(mockGithubProfile)

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          avatar: mockUser.avatar,
          rank: mockUser.rank,
          level: mockUser.level,
        },
      })
      expect(mockUsersService.create).not.toHaveBeenCalled()
      expect(mockUsersService.findById).not.toHaveBeenCalled()
    })

    it('should use login as name if name is not provided', async () => {
      const profileWithoutName = { ...mockGithubProfile, name: '' }
      const newUser = { ...mockUser, id: 'new-user-id' }

      mockUsersService.findByGithubId.mockResolvedValue(null)
      mockUsersService.create.mockResolvedValue(newUser)
      mockUsersService.findById.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue('mock-jwt-token')

      await service.handleGithubLogin(profileWithoutName)

      expect(mockUsersService.create).toHaveBeenCalledWith({
        githubId: 'github123',
        email: 'test@example.com',
        name: 'testuser',
        avatar: 'https://example.com/avatar.jpg',
      })
    })

    it('should use github.local email if email is not provided', async () => {
      const profileWithoutEmail = { ...mockGithubProfile, email: '' }
      const newUser = { ...mockUser, id: 'new-user-id' }

      mockUsersService.findByGithubId.mockResolvedValue(null)
      mockUsersService.create.mockResolvedValue(newUser)
      mockUsersService.findById.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue('mock-jwt-token')

      await service.handleGithubLogin(profileWithoutEmail)

      expect(mockUsersService.create).toHaveBeenCalledWith({
        githubId: 'github123',
        email: 'testuser@github.local',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      })
    })

    it('should handle undefined avatar_url', async () => {
      const profileWithoutAvatar = { ...mockGithubProfile, avatar_url: '' }
      const newUser = { ...mockUser, id: 'new-user-id' }

      mockUsersService.findByGithubId.mockResolvedValue(null)
      mockUsersService.create.mockResolvedValue(newUser)
      mockUsersService.findById.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue('mock-jwt-token')

      await service.handleGithubLogin(profileWithoutAvatar)

      expect(mockUsersService.create).toHaveBeenCalledWith({
        githubId: 'github123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: undefined,
      })
    })
  })

  describe('validateUser', () => {
    const mockPayload = {
      sub: 'user-1',
      email: 'test@example.com',
      rank: 'A',
    }

    it('should return user when user exists', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser)

      const result = await service.validateUser(mockPayload)

      expect(result).toEqual(mockUser)
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-1')
    })

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findById.mockResolvedValue(null)

      await expect(service.validateUser(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      )
      await expect(service.validateUser(mockPayload)).rejects.toThrow(
        'Invalid token',
      )
    })
  })

  describe('generateToken', () => {
    it('should generate JWT token with correct payload', () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        rank: 'A',
      }
      mockJwtService.sign.mockReturnValue('generated-token')

      const result = service.generateToken(user)

      expect(result).toBe('generated-token')
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'test@example.com',
        rank: 'A',
      })
    })
  })

  describe('verifyToken', () => {
    it('should verify and return payload for valid token', () => {
      const mockPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        rank: 'A',
      }
      mockJwtService.verify.mockReturnValue(mockPayload)

      const result = service.verifyToken('valid-token')

      expect(result).toEqual(mockPayload)
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token')
    })

    it('should throw UnauthorizedException for invalid token', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      expect(() => service.verifyToken('invalid-token')).toThrow(
        UnauthorizedException,
      )
      expect(() => service.verifyToken('invalid-token')).toThrow(
        'Invalid or expired token',
      )
    })

    it('should throw UnauthorizedException for expired token', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired')
      })

      expect(() => service.verifyToken('expired-token')).toThrow(
        UnauthorizedException,
      )
    })
  })
})
