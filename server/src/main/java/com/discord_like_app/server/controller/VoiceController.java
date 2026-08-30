package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.model.dto.SignalingMessage;
import com.discord_like_app.server.model.dto.UserOutDto;
import com.discord_like_app.server.service.VoiceChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
public class VoiceController {

    private final VoiceChatService voiceChatService;
    private final SimpMessagingTemplate messagingTemplate;

    public VoiceController(VoiceChatService voiceChatService, SimpMessagingTemplate messagingTemplate) {
        this.voiceChatService = voiceChatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/voice/join/{channelUid}")
    public void joinVoiceChannel(@DestinationVariable UUID channelUid, Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();

            voiceChatService.addUserToChannel(channelUid, userDetails.getUser());

            messagingTemplate.convertAndSend(
                    "/channels/voice/" + channelUid,
                    voiceChatService.getUsersInChannel(channelUid).stream().map(UserOutDto::fromEntity).toList());
        }
    }

    @MessageMapping("/voice/leave/{channelUid}")
    public void leaveVoiceChannel(@DestinationVariable UUID channelUid, Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();

            voiceChatService.removeUserFromChannel(channelUid, userDetails.getUser().getUserUid());

            messagingTemplate.convertAndSend(
                    "/channels/voice/" + channelUid,
                    voiceChatService.getUsersInChannel(channelUid).stream().map(UserOutDto::fromEntity).toList());
        }
    }

    @MessageMapping("/voice/signal")
    public void signalWebRTC(SignalingMessage message, Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();

            message.setSenderUid(userDetails.getUser().getUserUid());

            messagingTemplate.convertAndSend(
                    "/channels/voice/signal/" + message.getTargetUid(),
                    message);
        }
    }

    @MessageMapping("/voice/sync/{channelUid}")
    public void syncVoiceChannel(@DestinationVariable UUID channelUid) {
        messagingTemplate.convertAndSend(
                "/channels/voice/" + channelUid,
                voiceChatService.getUsersInChannel(channelUid).stream().map(UserOutDto::fromEntity).toList());
    }
}
