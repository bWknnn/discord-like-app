package com.discord_like_app.server.service;

import com.discord_like_app.server.dto.ChannelDTO;
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

    public ChannelDTO createChannel(ChannelDTO channelDTO) {
        Server server = serverRepository.findById(channelDTO.getServerId())
                .orElseThrow(() -> new RuntimeException("ERROR!"));

        Channel channel = new Channel();
        channel.setName(channelDTO.getName());
        channel.setType(channelDTO.getType());
        channel.setServer(server);

        Channel savedChannel = channelRepository.save(channel);

        return new ChannelDTO(
                savedChannel.getUid(),
                savedChannel.getName(),
                savedChannel.getType(),
                savedChannel.getServer().getUid()
        );
    }

    public List<ChannelDTO> getChannelsByServerId(UUID serverId){
        List<Channel> channels = channelRepository.findByServerUid(serverId);
        return channels.stream().map(c -> new ChannelDTO(
                c.getUid(),c.getName(),c.getType(),c.getServer().getUid())).toList();
    }
}