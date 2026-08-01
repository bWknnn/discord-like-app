package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.model.dto.MemberInDto;
import com.discord_like_app.server.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addMember(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody MemberInDto memberInDto
    ) {
        service.addMember(userDetails.getId(), memberInDto.getServerId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}