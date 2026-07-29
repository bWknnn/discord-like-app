package com.discord_like_app.server.service;

import com.discord_like_app.server.dto.ChannelDto;
import com.discord_like_app.server.model.Channel;
import com.discord_like_app.server.model.Server;
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

    public ChannelDto createChannel(ChannelDto channelDTO) {
        Server server = serverRepository.findById(channelDTO.getServerId())
                .orElseThrow(() -> new RuntimeException("ERROR!"));

        Channel channel = Channel.builder()
                .name(channelDTO.getName())
                .type(channelDTO.getType())
                .server(server)
                .build();

        Channel savedChannel = channelRepository.save(channel);

        return ChannelDto.builder()
                .uid(savedChannel.getChannelUid())
                .name(savedChannel.getName())
                .type(savedChannel.getType())
                .serverId(savedChannel.getServer().getServerUid())
                .build();
    }

    public List<ChannelDto> getChannelsByServerId(UUID serverId){
        List<Channel> channels = channelRepository.findByServerServerUid(serverId);
        return channels.stream().map(c -> ChannelDto.builder()
                .uid(c.getChannelUid())
                .name(c.getName())
                .type(c.getType())
                .serverId(c.getServer().getServerUid())
                .build()).toList();
    }
}