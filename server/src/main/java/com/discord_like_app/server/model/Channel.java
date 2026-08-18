package com.discord_like_app.server.model;

import com.discord_like_app.server.model.enums.ChannelType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "channels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Channel {
    @Id
    @UuidGenerator
    private UUID channelUid;

    private String name;
    
    @Enumerated(EnumType.STRING)
    private ChannelType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_uid", nullable = false)
    @ToString.Exclude
    private Server server;
}