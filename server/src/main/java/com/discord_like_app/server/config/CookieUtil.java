package com.discord_like_app.server.config;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    private static final String JWT_COOKIE_NAME = "access_token";

    public Cookie createJwtCookie(String token) {
        Cookie cookie = new Cookie(JWT_COOKIE_NAME, token);

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setAttribute("SameSite", "Lax");

        return cookie;
    }

    public Cookie deleteJwtCookie() {
        Cookie cookie = new Cookie(JWT_COOKIE_NAME, "");

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Lax");

        return cookie;
    }
}