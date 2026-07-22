package com.discord_like_app.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "servers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Server {
    @Id
    @UuidGenerator
    private UUID uid;

    private String serverName;
    private String owner;

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Channel> channels = new ArrayList<>();

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Member> members = new ArrayList<>();
}