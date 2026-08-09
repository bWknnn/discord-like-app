package com.discord_like_app.server.service;

import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.UserRepository;
import jakarta.annotation.Nullable;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @NullMarked public UserDetails loadUserByUsername(@Nullable String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "An error occurred: " + email
                        )
                );

        return new CustomUserDetails(user);
    }
}