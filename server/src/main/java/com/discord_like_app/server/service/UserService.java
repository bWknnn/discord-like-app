package com.discord_like_app.server.service;

import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passEncoder) {
        this.userRepo = userRepo;
        this.passEncoder = passEncoder;
    }

    public User login(String email, String rawPassword){
        Optional<User> find = userRepo.findByEmail(email);
        if(find.isEmpty()){
            throw new RuntimeException("User not found!");
        }
        User user = find.get();
        boolean match = passEncoder.matches(rawPassword, user.getHashedPass());

        if (!match) {
            throw new RuntimeException("Wrong password!");
        }

        return user;
    }

    public User createUser(User user) {
        String hashed = passEncoder.encode(user.getHashedPass());
        user.setHashedPass(hashed);
        return userRepo.save(user);
    }
}