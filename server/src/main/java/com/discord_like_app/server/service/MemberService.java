package com.discord_like_app.server.service;

import com.discord_like_app.server.dto.MemberIn;
import com.discord_like_app.server.model.Member;
import com.discord_like_app.server.model.Server;
import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.MemberRepository;
import com.discord_like_app.server.repository.ServerRepository;
import com.discord_like_app.server.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    public void addMember(MemberIn memberIn) {
        if (memberRepository.existsByUserUidAndServerUid(memberIn.getUserId(), memberIn.getServerId())) {
            return;
        }

        User user = userRepository.findById(memberIn.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Server server = serverRepository.findById(memberIn.getServerId())
                .orElseThrow(() -> new RuntimeException("Server not found"));

        Member member = new Member();
        member.setUser(user);
        member.setServer(server);

        memberRepository.save(member);
    }
}