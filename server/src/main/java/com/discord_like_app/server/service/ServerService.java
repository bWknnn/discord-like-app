package com.discord_like_app.server.service;

import com.discord_like_app.server.dto.ServerInDto;
import com.discord_like_app.server.dto.ServerOutDto;
import com.discord_like_app.server.model.Member;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.repository.MemberRepository;
import com.discord_like_app.server.repository.ServerRepository;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ServerService {

    private final ServerRepository serverRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    public ServerService(ServerRepository serverRepository, MemberRepository memberRepository,
            UserRepository userRepository) {
        this.serverRepository = serverRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ServerOutDto createServer(ServerInDto serverInDto) {
        Server server = Server.builder()
                .serverName(serverInDto.getServerName())
                .ownerUid(serverInDto.getOwnerUid())
                .build();

        Server savedServer = serverRepository.save(server);

        if (serverInDto.getOwnerUid() != null && !serverInDto.getOwnerUid().isBlank()) {
            userRepository.findById(UUID.fromString(serverInDto.getOwnerUid())).ifPresent(user -> {
                Member member = Member.builder()
                        .user(user)
                        .server(savedServer)
                        .build();
                memberRepository.save(member);
            });
        }

        return ServerOutDto.builder()
                .uid(savedServer.getServerUid())
                .serverName(savedServer.getServerName())
                .build();
    }

    public List<ServerOutDto> getJoinedServers(UUID userId) {
        List<Server> servers = serverRepository.findServersByUserId(userId);
        return servers.stream()
                .map(s -> ServerOutDto.builder()
                        .uid(s.getServerUid())
                        .serverName(s.getServerName())
                        .build())
                .toList();
    }

    public List<ServerOutDto> getJoinableServers(UUID userId) {
        List<Server> servers = serverRepository.findAvailableServersForUser(userId);
        return servers.stream()
                .map(s -> ServerOutDto.builder()
                        .uid(s.getServerUid())
                        .serverName(s.getServerName())
                        .build())
                .toList();
    }
}