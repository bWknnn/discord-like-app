package com.discord_like_app.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "servers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Server {
    @Id
    @UuidGenerator
    private UUID serverUid;

    private String serverName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_uid", nullable = false)
    @ToString.Exclude
    private User owner;
}