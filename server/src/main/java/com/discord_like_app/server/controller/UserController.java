package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.User;
import com.discord_like_app.server.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/login")
    public User loginUser(@RequestBody User user){
        return userService.login(user.getEmail(), user.getHashedPass());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}