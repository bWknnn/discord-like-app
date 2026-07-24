package com.discord_like_app.server.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @UuidGenerator
    private UUID uid;
    private String content;
    private String author;
    private String channelId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}