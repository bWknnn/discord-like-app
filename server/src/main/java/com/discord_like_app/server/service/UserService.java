package com.discord_like_app.server.service;

import com.discord_like_app.server.config.JwtService;
import com.discord_like_app.server.model.dto.AuthResponseDto;
import com.discord_like_app.server.model.dto.UserInDto;
import com.discord_like_app.server.model.dto.UserOutDto;
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

    public AuthResponseDto login(String email, String rawPassword) {
        Optional<User> find = userRepo.findByEmail(email);
        if (find.isEmpty()) {
            throw new IllegalArgumentException("User or password is wrong!");
        }
        User user = find.get();
        boolean match = passEncoder.matches(rawPassword, user.getHashedPass());

        if (!match) {
            throw new IllegalArgumentException("User or password is wrong!");
        }

        UserOutDto userOutDto = UserOutDto.fromEntity(user);
        String token = jwtService.generateToken(userOutDto);

        return AuthResponseDto.builder()
                .token(token)
                .user(userOutDto)
                .build();
    }

    public User createUser(UserInDto userInDto) {
        if (userRepo.findByEmail(userInDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists!");
        }

        User user = User.builder()
                .username(userInDto.getUsername())
                .email(userInDto.getEmail())
                .hashedPass(passEncoder.encode(userInDto.getPassword()))
                .build();

        return userRepo.save(user);
    }
}