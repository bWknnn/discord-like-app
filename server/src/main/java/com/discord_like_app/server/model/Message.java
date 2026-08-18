package com.discord_like_app.server.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @UuidGenerator
    private UUID messageUid;
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_uid", nullable = false)
    @ToString.Exclude
    private User sender;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_uid", nullable = false)
    @ToString.Exclude
    private Channel channel;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

}