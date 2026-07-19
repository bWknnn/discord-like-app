package com.discord_like_app.server.service;

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

    public UserService(UserRepository userRepo, PasswordEncoder passEncoder) {
        this.userRepo = userRepo;
        this.passEncoder = passEncoder;
    }

    public UserOut login(String email, String rawPassword) {
        Optional<User> find = userRepo.findByEmail(email);
        if (find.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        User user = find.get();
        boolean match = passEncoder.matches(rawPassword, user.getHashedPass());

        if (!match) {
            throw new RuntimeException("Wrong password!");
        }

        return new UserOut(user.getUid(), user.getUserName(), user.getEmail());
    }

    public UserOut createUser(UserIn userIn) {
        User user = new User();
        user.setUserName(userIn.getUserName());
        user.setEmail(userIn.getEmail());

        String hashed = passEncoder.encode(userIn.getPassword());
        user.setHashedPass(hashed);

        User savedUser = userRepo.save(user);

        return new UserOut(savedUser.getUid(), savedUser.getUserName(), savedUser.getEmail());
    }
}