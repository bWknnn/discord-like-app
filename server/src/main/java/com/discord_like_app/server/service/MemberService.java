package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Member;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.MemberRepository;
import com.discord_like_app.server.repository.ServerRepository;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final ServerRepository serverRepository;

    public MemberService(MemberRepository memberRepository, UserRepository userRepository, ServerRepository serverRepository) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.serverRepository = serverRepository;
    }

    public void addMember(UUID userId, UUID serverId) {
        if (memberRepository.existsByUserUidAndServerUid(userId, serverId)) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new RuntimeException("Server not found"));

        Member member = Member.builder()
                .user(user)
                .server(server)
                .build();

        memberRepository.save(member);
    }
}