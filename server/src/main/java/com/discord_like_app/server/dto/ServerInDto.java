package com.discord_like_app.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServerInDto {
    private String serverName;
    @JsonProperty("owner_uid")
    private String ownerUid;
}