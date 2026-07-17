package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.repository.ServerRepository;
import org.springframework.stereotype.Service;

@Service
public class ServerService {
    private ServerRepository repo;

    public ServerService(ServerRepository repo) {
        this.repo = repo;
    }

    public Server createServer(Server server){
        return repo.save(server);
    }

}
