package com.discord_like_app.server.controller;

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
    public ResponseEntity<ChannelDto> create(@RequestBody ChannelDto channelDTO){
        ChannelDto createdChannel = service.createChannel(channelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdChannel);
    }

    @GetMapping("/get/{serverId}")
    public List<ChannelDto> getAllChannels(@PathVariable UUID serverId){
        return service.getChannelsByServerId(serverId);
    }
}