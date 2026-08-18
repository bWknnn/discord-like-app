package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.dto.ChannelDto;
import com.discord_like_app.server.service.ChannelService;
import org.springframework.messaging.handler.annotation.MessageMapping;
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

        @MessageMapping("/channel")
        public void create(ChannelDto channelDTO) {
                service.createChannel(
                                channelDTO.getName(),
                                channelDTO.getType(),
                                channelDTO.getServerId());
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