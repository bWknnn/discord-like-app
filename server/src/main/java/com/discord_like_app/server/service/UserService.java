package com.discord_like_app.server.service;

import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passEncoder) {
        this.userRepo = userRepo;
        this.passEncoder = passEncoder;
    }

    public User createUser(User user) {
        String hashed = passEncoder.encode(user.getHashedPass());
        user.setHashedPass(hashed);
        return userRepo.save(user);
    }
}