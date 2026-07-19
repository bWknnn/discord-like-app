package com.discord_like_app.server.controller;

import com.discord_like_app.server.dto.UserIn;
import com.discord_like_app.server.dto.UserOut;
import com.discord_like_app.server.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserOut> register(@RequestBody UserIn userIn) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userIn));
    }

    @PostMapping("/login")
    public ResponseEntity<UserOut> login(@RequestBody UserIn loginRequest) {
        UserOut userOut = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(userOut);
    }
}