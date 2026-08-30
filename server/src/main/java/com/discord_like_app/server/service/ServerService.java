package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Member;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.model.User;
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
    public Server createServer(String serverName, String ownerUid) {
        User owner = null;
        if (ownerUid != null && !ownerUid.isBlank()) {
            owner = userRepository.findById(UUID.fromString(ownerUid)).orElse(null);
        }

        Server server = Server.builder()
                .serverName(serverName)
                .owner(owner)
                .build();

        Server savedServer = serverRepository.save(server);

        if (owner != null) {
            Member member = Member.builder()
                    .user(owner)
                    .server(savedServer)
                    .build();
            memberRepository.save(member);
        }

        return savedServer;
    }

    public List<Server> getJoinedServers(UUID userId) {
        return serverRepository.findServersByUserId(userId);
    }

    public List<Server> getJoinableServers(UUID userId) {
        return serverRepository.findAvailableServersForUser(userId);
    }
}