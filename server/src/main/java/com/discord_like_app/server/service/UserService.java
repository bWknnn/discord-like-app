package com.discord_like_app.server.service;

import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passEncoder) {
        this.userRepo = userRepo;
        this.passEncoder = passEncoder;
    }

    public User login(String email, String rawPassword) {
        Optional<User> find = userRepo.findByEmail(email);
        if (find.isEmpty()) {
            throw new IllegalArgumentException("User or password is wrong!");
        }
        User user = find.get();

        if (!passEncoder.matches(rawPassword, user.getHashedPass())) {
            throw new IllegalArgumentException("User or password is wrong!");
        }

        return user;
    }

    public User createUser(String username, String email, String password) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists!");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .hashedPass(passEncoder.encode(password))
                .build();

        return userRepo.save(user);
    }
}