package com.discord_like_app.server.repository;

import com.discord_like_app.server.model.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChannelRepository extends JpaRepository<Channel, UUID> {
    List<Channel> findByServerUid(UUID serverId);
}
