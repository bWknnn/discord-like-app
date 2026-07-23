package com.discord_like_app.server.controller;

import com.discord_like_app.server.dto.MemberIn;
import com.discord_like_app.server.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addMember(@RequestBody MemberIn memberIn) {
        service.addMember(memberIn);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}