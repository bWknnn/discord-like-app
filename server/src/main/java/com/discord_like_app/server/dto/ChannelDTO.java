package com.discord_like_app.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDTO {
    private UUID uid;
    private String name;
    private String type;
    private UUID serverId;
}