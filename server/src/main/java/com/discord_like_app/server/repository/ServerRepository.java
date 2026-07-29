package com.discord_like_app.server.repository;

import com.discord_like_app.server.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ServerRepository extends JpaRepository<Server, UUID> {

    @Query("SELECT s FROM Server s WHERE s.serverUid IN (SELECT m.server.serverUid FROM Member m WHERE m.user.userUid = :userId)")
    List<Server> findServersByUserId(@Param("userId") UUID userId);

    @Query("SELECT s FROM Server s WHERE s.serverUid NOT IN (SELECT m.server.serverUid FROM Member m WHERE m.user.userUid = :userId)")
    List<Server> findAvailableServersForUser(@Param("userId") UUID userId);
}