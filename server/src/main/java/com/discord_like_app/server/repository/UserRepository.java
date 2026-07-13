package com.discord_like_app.server.repository;

import com.discord_like_app.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
