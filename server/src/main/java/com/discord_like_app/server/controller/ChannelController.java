package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.Channel;
import com.discord_like_app.server.model.dto.ChannelDto;
import com.discord_like_app.server.service.ChannelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService service;

    public ChannelController(ChannelService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<ChannelDto> create(@RequestBody ChannelDto channelDTO) {
        Channel saved = service.createChannel(
                channelDTO.getName(),
                channelDTO.getType(),
                channelDTO.getServerId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ChannelDto.builder()
                        .uid(saved.getChannelUid())
                        .name(saved.getName())
                        .type(saved.getType())
                        .serverId(saved.getServer().getServerUid())
                        .build()
        );
    }

    @GetMapping("/get/{serverId}")
    public List<ChannelDto> getAllChannels(@PathVariable UUID serverId) {
        return service.getChannelsByServerId(serverId)
                .stream()
                .map(c -> ChannelDto.builder()
                        .uid(c.getChannelUid())
                        .name(c.getName())
                        .type(c.getType())
                        .serverId(c.getServer().getServerUid())
                        .build())
                .toList();
    }
}