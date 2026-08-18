package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Channel;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.model.dto.ChannelDto;
import com.discord_like_app.server.model.enums.ChannelType;
import com.discord_like_app.server.repository.ChannelRepository;
import com.discord_like_app.server.repository.ServerRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ServerRepository serverRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChannelService(ChannelRepository channelRepository,
            ServerRepository serverRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.channelRepository = channelRepository;
        this.serverRepository = serverRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public ChannelDto createChannel(String name, ChannelType type, UUID serverId) {
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new RuntimeException("Server not found!"));

        Channel channel = Channel.builder()
                .name(name)
                .type(type)
                .server(server)
                .build();

        Channel saved = channelRepository.save(channel);

        ChannelDto savedDto = ChannelDto.builder()
                .uid(saved.getChannelUid())
                .name(saved.getName())
                .type(saved.getType())
                .serverId(saved.getServer().getServerUid())
                .build();

        messagingTemplate.convertAndSend(
                "/servers/" + saved.getServer().getServerUid() + "/channels",
                savedDto);

        return savedDto;
    }

    public List<Channel> getChannelsByServerId(UUID serverId) {
        return channelRepository.findByServerServerUid(serverId);
    }
}