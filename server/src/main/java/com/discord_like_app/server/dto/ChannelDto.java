package com.discord_like_app.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChannelDto {
    private UUID uid;
    private String name;
    private String type;
    private UUID serverId;
}