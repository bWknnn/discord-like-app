package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.model.Server;
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
    public ResponseEntity<ServerOutDto> createServer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ServerInDto serverInDto
    ) {
        Server saved = service.createServer(serverInDto.getServerName(), userDetails.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ServerOutDto.builder()
                        .uid(saved.getServerUid())
                        .serverName(saved.getServerName())
                        .build()
        );
    }

    @GetMapping("/joined")
    public ResponseEntity<List<ServerOutDto>> getJoinedServers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ServerOutDto> result = service.getJoinedServers(userDetails.getId())
                .stream()
                .map(s -> ServerOutDto.builder()
                        .uid(s.getServerUid())
                        .serverName(s.getServerName())
                        .build())
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/joinable")
    public ResponseEntity<List<ServerOutDto>> getJoinableServers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ServerOutDto> result = service.getJoinableServers(userDetails.getId())
                .stream()
                .map(s -> ServerOutDto.builder()
                        .uid(s.getServerUid())
                        .serverName(s.getServerName())
                        .build())
                .toList();
        return ResponseEntity.ok(result);
    }
}