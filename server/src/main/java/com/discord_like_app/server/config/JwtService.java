package com.discord_like_app.server.config;

import com.discord_like_app.server.dto.UserOutDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey signKey;
    private final long expirationTime;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationTime
    ) {
        this.signKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expirationTime = expirationTime;
    }

    public String generateToken(UserOutDto user) {
        Date now = new Date();

        return Jwts.builder()
                .subject(user.getUid().toString())
                .claim("username", user.getUserName())
                .claim("mail", user.getEmail())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationTime))
                .signWith(signKey, Jwts.SIG.HS256)
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UUID extractUid(String token) {
        String uid = extractAllClaims(token).getSubject();
        return UUID.fromString(uid);
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).get("mail", String.class);
    }

    public String extractUserName(String token) {
        return extractAllClaims(token).get("username", String.class);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String email = extractEmail(token);

            return email.equals(userDetails.getUsername())
                    && !isTokenExpired(token);

        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }
}