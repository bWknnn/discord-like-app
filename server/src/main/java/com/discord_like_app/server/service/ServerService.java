package com.discord_like_app.server.service;

import com.discord_like_app.server.dto.ServerIn;
import com.discord_like_app.server.dto.ServerOut;
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

    public ServerService(ServerRepository serverRepository, MemberRepository memberRepository, UserRepository userRepository) {
        this.serverRepository = serverRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ServerOut createServer(ServerIn serverIn) {
        Server server = new Server();
        server.setServerName(serverIn.getServerName());
        server.setOwner(serverIn.getOwner());

        Server savedServer = serverRepository.save(server);

        if (serverIn.getOwner() != null && !serverIn.getOwner().isBlank()) {
            userRepository.findByUserName(serverIn.getOwner()).ifPresent(user -> {
                Member member = new Member();
                member.setUser(user);
                member.setServer(savedServer);
                memberRepository.save(member);
            });
        }

        return new ServerOut(savedServer.getUid(), savedServer.getServerName());
    }

    public List<ServerOut> getJoinedServers(UUID userId) {
        List<Server> servers = serverRepository.findServersByUserId(userId);
        return servers.stream()
                .map(s -> new ServerOut(s.getUid(), s.getServerName()))
                .toList();
    }

    public List<ServerOut> getJoinableServers(UUID userId) {
        List<Server> servers = serverRepository.findAvailableServersForUser(userId);
        return servers.stream()
                .map(s -> new ServerOut(s.getUid(), s.getServerName()))
                .toList();
    }
}