# WKU Software Crew - Security Checklist

A comprehensive security checklist for production deployment.

## Authentication & Authorization

### JWT Security
- [ ] JWT secret is at least 64 bytes (512 bits)
- [ ] JWT tokens have appropriate expiration (7 days max recommended)
- [ ] Refresh token rotation implemented
- [ ] Token blacklisting for logout (if needed)

### OAuth Security
- [ ] OAuth state parameter used to prevent CSRF
- [ ] Callback URLs restricted to specific domains
- [ ] OAuth secrets stored securely (environment variables)
- [ ] Scopes limited to minimum required

### Password Security (if applicable)
- [ ] Passwords hashed with bcrypt (cost factor >= 12)
- [ ] Password strength requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Secure password reset flow

## API Security

### Input Validation
- [ ] All input validated using class-validator
- [ ] Query parameters sanitized
- [ ] File uploads validated (type, size, content)
- [ ] SQL injection prevented (Prisma ORM)

### Rate Limiting
- [ ] Global rate limiting configured
- [ ] Stricter limits on authentication endpoints
- [ ] Rate limit headers returned
- [ ] DDoS protection considered

### CORS Configuration
- [ ] CORS origins explicitly listed
- [ ] Credentials properly configured
- [ ] Preflight caching optimized

## Infrastructure Security

### Server Security
- [ ] SSH key authentication only
- [ ] Root login disabled
- [ ] Firewall configured (ufw/iptables)
- [ ] Automatic security updates enabled
- [ ] Non-root user for application

### Docker Security
- [ ] Non-root user in containers
- [ ] Read-only filesystem where possible
- [ ] Resource limits configured
- [ ] No privileged containers
- [ ] Image scanning for vulnerabilities

### Network Security
- [ ] Database not exposed to internet
- [ ] Internal services on private network
- [ ] TLS 1.2+ only
- [ ] Strong cipher suites

## Data Protection

### Database Security
- [ ] Strong passwords
- [ ] Minimal user privileges
- [ ] Connection encryption (SSL)
- [ ] Regular backups encrypted
- [ ] Backup restoration tested

### Sensitive Data
- [ ] No secrets in code or git
- [ ] Environment variables for configuration
- [ ] Secrets management system (optional)
- [ ] PII handling compliant

## HTTP Security Headers

```nginx
# Already configured in nginx/nginx.conf
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: ...
Strict-Transport-Security: max-age=63072000
```

- [ ] All headers verified
- [ ] CSP policy tested
- [ ] HSTS preload considered

## Logging & Monitoring

### Security Logging
- [ ] Authentication attempts logged
- [ ] Authorization failures logged
- [ ] API errors logged
- [ ] Log injection prevented
- [ ] Logs not exposing sensitive data

### Monitoring
- [ ] Uptime monitoring configured
- [ ] Error rate alerts
- [ ] Resource usage alerts
- [ ] Security event alerts

## Dependency Security

### Package Management
- [ ] Dependencies regularly updated
- [ ] `npm audit` / `pnpm audit` clean
- [ ] Lock files committed
- [ ] No known vulnerabilities

### Supply Chain
- [ ] Dependencies from trusted sources
- [ ] Package integrity verified
- [ ] Minimal dependencies used

## Incident Response

### Preparation
- [ ] Incident response plan documented
- [ ] Contact information updated
- [ ] Rollback procedure tested
- [ ] Backup restoration tested

### Detection
- [ ] Security monitoring in place
- [ ] Alerting configured
- [ ] Log aggregation set up

## Compliance Considerations

### Data Privacy
- [ ] Privacy policy updated
- [ ] User consent mechanisms
- [ ] Data retention policy
- [ ] Data deletion capability

### Documentation
- [ ] Security procedures documented
- [ ] Access controls documented
- [ ] Audit trail maintained

---

## Regular Security Tasks

### Weekly
- [ ] Review error logs for anomalies
- [ ] Check for failed login attempts
- [ ] Verify backup completion

### Monthly
- [ ] Update dependencies
- [ ] Run security scans
- [ ] Review access permissions
- [ ] Test backup restoration

### Quarterly
- [ ] Rotate secrets/keys
- [ ] Review security policies
- [ ] Penetration testing (if applicable)
- [ ] Update incident response plan

---

## Quick Commands

```bash
# Check for dependency vulnerabilities
pnpm audit

# Generate secure secrets
openssl rand -base64 64  # For JWT_SECRET
openssl rand -base64 32  # For NEXTAUTH_SECRET

# Check SSL certificate expiry
openssl s_client -connect api.wku-crew.com:443 2>/dev/null | openssl x509 -noout -dates

# Test rate limiting
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" https://api.wku-crew.com/api/health; done

# Check open ports
nmap -sT localhost
```

---

**Reviewed By**: _______________
**Date**: _______________
**Version**: 1.0.0
