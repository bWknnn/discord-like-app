package com.discord_like_app.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.UUID;

@Entity
@Table(name = "channels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Channel {
    public enum ChannelType {
        TEXT("text"),
        VOICE("voice");

        private final String value;

        ChannelType(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static ChannelType fromValue(String value) {
            for (ChannelType type : ChannelType.values()) {
                if (type.value.equalsIgnoreCase(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown enum type " + value);
        }
    }

    @Id
    @UuidGenerator
    private UUID channelUid;

    private String name;
    
    @Enumerated(EnumType.STRING)
    private ChannelType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id", nullable = false)
    @ToString.Exclude
    private Server server;
}