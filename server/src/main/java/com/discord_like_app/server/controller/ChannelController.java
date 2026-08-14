package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.Channel;
import com.discord_like_app.server.model.dto.ChannelDto;
import com.discord_like_app.server.service.ChannelService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

        private final ChannelService service;
        private final SimpMessagingTemplate messagingTemplate;

        public ChannelController(ChannelService service, SimpMessagingTemplate messagingTemplate) {
                this.service = service;
                this.messagingTemplate = messagingTemplate;
        }

        @MessageMapping("/channel")
        public void create(ChannelDto channelDTO) {
                Channel saved = service.createChannel(
                                channelDTO.getName(),
                                channelDTO.getType(),
                                channelDTO.getServerId());
                ChannelDto savedDto = ChannelDto.builder()
                                .uid(saved.getChannelUid())
                                .name(saved.getName())
                                .type(saved.getType())
                                .serverId(saved.getServer().getServerUid())
                                .build();

                messagingTemplate.convertAndSend(
                                "/servers/" + saved.getServer().getServerUid() + "/channels",
                                savedDto);
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