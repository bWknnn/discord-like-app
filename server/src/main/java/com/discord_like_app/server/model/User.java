package com.discord_like_app.server.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @UuidGenerator
    private UUID uid;
    private String userName;
    @Column(unique = true, nullable = false)
    private String email;
    private String hashedPass;
}