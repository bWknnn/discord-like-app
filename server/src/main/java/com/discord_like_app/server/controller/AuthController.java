package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CookieUtil;
import com.discord_like_app.server.dto.AuthResponse;
import com.discord_like_app.server.dto.UserIn;
import com.discord_like_app.server.dto.UserOut;
import com.discord_like_app.server.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/auth", "/api/users"})
public class AuthController {

    private final UserService userService;
    private final CookieUtil cookieUtil;

    public AuthController(UserService userService, CookieUtil cookieUtil) {
        this.userService = userService;
        this.cookieUtil = cookieUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UserOut> register(@RequestBody UserIn userIn) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userIn));
    }

    @PostMapping("/login")
    public ResponseEntity<UserOut> login(@RequestBody UserIn loginRequest, HttpServletResponse response) {
        AuthResponse authResponse = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        response.addCookie(cookieUtil.createJwtCookie(authResponse.getToken()));

        return ResponseEntity.ok(authResponse.getUser());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        response.addCookie(cookieUtil.deleteJwtCookie());
        return ResponseEntity.noContent().build();
    }
}