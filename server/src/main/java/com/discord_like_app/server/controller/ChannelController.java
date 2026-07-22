package com.discord_like_app.server.controller;

import com.discord_like_app.server.dto.ChannelDTO;
import com.discord_like_app.server.service.ChannelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/channels")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChannelController {

    private final ChannelService service;

    public ChannelController(ChannelService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<ChannelDTO> create(@RequestBody ChannelDTO channelDTO){
        ChannelDTO createdChannel = service.createChannel(channelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdChannel);
    }

    @GetMapping("/get/{serverId}")
    public List<ChannelDTO> getAllChannels(@PathVariable UUID serverId){
        return service.getChannelsByServerId(serverId);
    }
}