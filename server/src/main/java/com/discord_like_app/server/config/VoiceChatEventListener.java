package com.discord_like_app.server.config;

import com.discord_like_app.server.model.dto.UserOutDto;
import com.discord_like_app.server.service.VoiceChatService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.UUID;

@Component
public class VoiceChatEventListener {

    private final VoiceChatService voiceChatService;
    private final SimpMessagingTemplate messagingTemplate;

    public VoiceChatEventListener(VoiceChatService voiceChatService, SimpMessagingTemplate messagingTemplate) {
        this.voiceChatService = voiceChatService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleSessionSubscribeListener(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();

        if (destination != null && destination.startsWith("/channels/voice/")) {
            String channelUidStr = destination.substring("/channels/voice/".length());
            if (!channelUidStr.contains("/")) {
                try {
                    UUID channelUid = UUID.fromString(channelUidStr);
                    messagingTemplate.convertAndSend(
                            destination,
                            voiceChatService.getUsersInChannel(channelUid).stream()
                                    .map(UserOutDto::fromEntity)
                                    .toList());
                } catch (IllegalArgumentException ignored) {
                }
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getUser() instanceof UsernamePasswordAuthenticationToken authToken) {
            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();
            UUID userUid = userDetails.getUser().getUserUid();

            UUID affectedChannel = voiceChatService.removeUserFromActiveChannel(userUid);

            if (affectedChannel != null) {
                messagingTemplate.convertAndSend(
                        "/channels/voice/" + affectedChannel,
                        voiceChatService.getUsersInChannel(affectedChannel).stream().map(UserOutDto::fromEntity)
                                .toList());
            }
        }
    }
}
