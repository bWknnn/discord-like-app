package com.discord_like_app.server.repository;

import com.discord_like_app.server.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}