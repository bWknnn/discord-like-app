package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.service.ServerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servers")
public class ServerController {
    private ServerService service;

    public ServerController(ServerService serverService) {
        this.service = serverService;
    }

    @GetMapping()
    public List<Server> getAllServers(){
        return service.returnAllServers();
    }

    @PostMapping("/add")
    public Server createServer(@RequestBody Server server){
        return service.createServer(server);
    }
}
