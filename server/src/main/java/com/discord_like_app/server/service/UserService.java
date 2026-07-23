package com.discord_like_app.server.service;

import com.discord_like_app.server.config.JwtService;
import com.discord_like_app.server.dto.AuthResponse;
import com.discord_like_app.server.dto.UserIn;
import com.discord_like_app.server.dto.UserOut;
import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepo, PasswordEncoder passEncoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.passEncoder = passEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(String email, String rawPassword) {
        Optional<User> find = userRepo.findByEmail(email);
        if (find.isEmpty()) {
            throw new IllegalArgumentException("User or password is wrong!");
        }
        User user = find.get();
        boolean match = passEncoder.matches(rawPassword, user.getHashedPass());

        if (!match) {
            throw new IllegalArgumentException("User or password is wrong!");
        }

        UserOut userOut = new UserOut(user.getUid(), user.getUserName(), user.getEmail());
        String token = jwtService.generateToken(userOut);

        return new AuthResponse(token, userOut);
    }

    public UserOut createUser(UserIn userIn) {
        if (userRepo.findByEmail(userIn.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email address is already in use!");
        }

        User user = new User();
        user.setUserName(userIn.getUserName());
        user.setEmail(userIn.getEmail());

        String hashed = passEncoder.encode(userIn.getPassword());
        user.setHashedPass(hashed);

        User savedUser = userRepo.save(user);

        return new UserOut(savedUser.getUid(), savedUser.getUserName(), savedUser.getEmail());
    }
}