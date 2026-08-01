package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.model.dto.ServerInDto;
import com.discord_like_app.server.model.dto.ServerOutDto;
import com.discord_like_app.server.service.ServerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/servers")
public class ServerController {

    private final ServerService service;

    public ServerController(ServerService serverService) {
        this.service = serverService;
    }

    @PostMapping("/add")
    public ResponseEntity<ServerOutDto> createServer(@RequestBody ServerInDto serverInDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createServer(serverInDto));
    }

    @GetMapping("/joined")
    public ResponseEntity<List<ServerOutDto>> getJoinedServers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(service.getJoinedServers(userDetails.getId()));
    }

    @GetMapping("/joinable")
    public ResponseEntity<List<ServerOutDto>> getJoinableServers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(service.getJoinableServers(userDetails.getId()));
    }
}