package com.discord_like_app.server.service;

import com.discord_like_app.server.dto.ServerIn;
import com.discord_like_app.server.dto.ServerOut;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.repository.ServerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ServerService {

    private final ServerRepository serverRepository;

    public ServerService(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
    }

    public ServerOut createServer(ServerIn serverIn) {
        Server server = new Server();
        server.setServerName(serverIn.getServerName());
        server.setOwner(serverIn.getOwner());

        Server savedServer = serverRepository.save(server);

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