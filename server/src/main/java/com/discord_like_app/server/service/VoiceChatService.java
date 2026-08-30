package com.discord_like_app.server.service;

import com.discord_like_app.server.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class VoiceChatService {

    private final Map<UUID, CopyOnWriteArrayList<User>> voiceChannels = new ConcurrentHashMap<>();

    public void addUserToChannel(UUID channelUid, User user) {
        voiceChannels.compute(channelUid, (id, users) -> {
            if (users == null) {
                users = new CopyOnWriteArrayList<>();
            }
            users.removeIf(u -> u.getUserUid().equals(user.getUserUid()));
            users.add(user);
            return users;
        });
    }

    public void removeUserFromChannel(UUID channelUid, UUID userUid) {
        voiceChannels.computeIfPresent(channelUid, (id, users) -> {
            users.removeIf(u -> u.getUserUid().equals(userUid));
            return users.isEmpty() ? null : users;
        });
    }

    public UUID removeUserFromActiveChannel(UUID userUid) {
        for (UUID channelUid : voiceChannels.keySet()) {
            CopyOnWriteArrayList<User> users = voiceChannels.get(channelUid);
            if (users != null && users.removeIf(u -> u.getUserUid().equals(userUid))) {
                if (users.isEmpty()) {
                    voiceChannels.remove(channelUid);
                }
                return channelUid;
            }
        }
        return null;
    }

    public List<User> getUsersInChannel(UUID channelUid) {
        return voiceChannels.getOrDefault(channelUid, new CopyOnWriteArrayList<>());
    }
}
