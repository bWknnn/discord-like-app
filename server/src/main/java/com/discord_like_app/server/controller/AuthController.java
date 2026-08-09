package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CookieUtil;
import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.config.JwtService;
import com.discord_like_app.server.model.User;
import com.discord_like_app.server.model.dto.UserInDto;
import com.discord_like_app.server.model.dto.UserOutDto;
import com.discord_like_app.server.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final CookieUtil cookieUtil;
    private final JwtService jwtService;

    public AuthController(UserService userService, CookieUtil cookieUtil, JwtService jwtService) {
        this.userService = userService;
        this.cookieUtil = cookieUtil;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserOutDto> register(@RequestBody UserInDto userInDto) {
        User savedUser = userService.createUser(
                userInDto.getUsername(),
                userInDto.getEmail(),
                userInDto.getPassword()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(UserOutDto.fromEntity(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<UserOutDto> login(@RequestBody UserInDto loginRequest, HttpServletResponse response) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        String token = jwtService.generateToken(user);

        response.addCookie(cookieUtil.createJwtCookie(token));

        return ResponseEntity.ok(UserOutDto.fromEntity(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        response.addCookie(cookieUtil.deleteJwtCookie());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserOutDto> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userDetails.getUser();
        return ResponseEntity.ok(UserOutDto.fromEntity(user));
    }
}