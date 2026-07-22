package com.discord_like_app.server.controller;

import com.discord_like_app.server.dto.ServerIn;
import com.discord_like_app.server.dto.ServerOut;
import com.discord_like_app.server.service.ServerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/servers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ServerController {

    private final ServerService service;

    public ServerController(ServerService serverService) {
        this.service = serverService;
    }

    @PostMapping("/add")
    public ResponseEntity<ServerOut> createServer(@RequestBody ServerIn serverIn) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createServer(serverIn));
    }

    @GetMapping("/joined/{userId}")
    public ResponseEntity<List<ServerOut>> getJoinedServers(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getJoinedServers(userId));
    }

    @GetMapping("/joinable/{userId}")
    public ResponseEntity<List<ServerOut>> getJoinableServers(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getJoinableServers(userId));
    }
}