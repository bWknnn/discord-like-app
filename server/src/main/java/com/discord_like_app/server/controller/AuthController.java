package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CookieUtil;
import com.discord_like_app.server.dto.AuthResponseDto;
import com.discord_like_app.server.dto.UserInDto;
import com.discord_like_app.server.dto.UserOutDto;
import com.discord_like_app.server.model.User;
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
    public ResponseEntity<UserOutDto> register(@RequestBody UserInDto userInDto) {
        User savedUser = userService.createUser(userInDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserOutDto.fromEntity(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<UserOutDto> login(@RequestBody UserInDto loginRequest, HttpServletResponse response) {
        AuthResponseDto authResponseDto = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        response.addCookie(cookieUtil.createJwtCookie(authResponseDto.getToken()));

        return ResponseEntity.ok(authResponseDto.getUser());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        response.addCookie(cookieUtil.deleteJwtCookie());
        return ResponseEntity.noContent().build();
    }
}