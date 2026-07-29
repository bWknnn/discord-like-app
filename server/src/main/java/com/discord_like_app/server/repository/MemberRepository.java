package com.discord_like_app.server.repository;

import com.discord_like_app.server.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    boolean existsByUserUserUidAndServerServerUid(UUID userUid, UUID serverUid);
}
