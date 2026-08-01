package com.discord_like_app.server.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.discord_like_app.server.model.Channel.ChannelType;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChannelDto {
    private UUID uid;
    private String name;
    private ChannelType type;
    private UUID serverId;
}