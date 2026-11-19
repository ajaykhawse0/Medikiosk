package com.medikiosk.security;

import com.medikiosk.config.AppProperties;
import com.medikiosk.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final AppProperties properties;
    public JwtService(AppProperties properties) { this.properties = properties; }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder().subject(user.getEmail()).claim("uid", user.getId().toString())
                .claim("role", user.getUserRoles().stream().findFirst()
                        .map(r -> r.getRole().getName().name()).orElse(""))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(properties.getJwt().getAccessTokenExpiryMinutes() * 60L)))
                .signWith(key()).compact();
    }

    public String extractUsername(String token) {
        return parse(token).getPayload().getSubject();
    }

    public boolean isValid(String token, User user) {
        try {
            Claims claims = parse(token).getPayload();
            return claims.getSubject().equals(user.getEmail()) && !claims.getExpiration().before(new Date())
                    && user.isEnabled() && user.getAccountStatus() == com.medikiosk.enums.AccountStatus.ACTIVE
                    && !user.isAccountLocked();
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
    }

    private SecretKey key() {
        String secret = properties.getJwt().getSecret();
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 bytes");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
