package com.discord_like_app.server.controller;

import com.discord_like_app.server.config.CustomUserDetails;
import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{channelUid}")
    public List<Message> getMessagesByChannel(@PathVariable String channelUid) {
        return messageService.getMessagesByChannel(channelUid);
    }

    @MessageMapping("/messages/{channelUid}")
    public void sendMessage(
            @DestinationVariable String channelUid,
            @Payload String text,
            Principal principal) {

        UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) principal;
        CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();
        messageService.createMessage(channelUid, text, userDetails.getUser());
    }
}
