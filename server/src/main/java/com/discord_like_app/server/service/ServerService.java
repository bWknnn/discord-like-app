package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.repository.ServerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServerService {
    private ServerRepository repo;

    public ServerService(ServerRepository repo) {
        this.repo = repo;
    }

    public List<Server> returnAllServers(){
        return repo.findAll();
    }

    public Server createServer(Server server){
        return repo.save(server);
    }

}
