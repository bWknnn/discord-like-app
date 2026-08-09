package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Channel;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.model.enums.ChannelType;
import com.discord_like_app.server.repository.ChannelRepository;
import com.discord_like_app.server.repository.ServerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ServerRepository serverRepository;

    public ChannelService(ChannelRepository channelRepository, ServerRepository serverRepository) {
        this.channelRepository = channelRepository;
        this.serverRepository = serverRepository;
    }

    public Channel createChannel(String name, ChannelType type, UUID serverId) {
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new RuntimeException("Server not found!"));

        Channel channel = Channel.builder()
                .name(name)
                .type(type)
                .server(server)
                .build();

        return channelRepository.save(channel);
    }

    public List<Channel> getChannelsByServerId(UUID serverId) {
        return channelRepository.findByServerServerUid(serverId);
    }
}