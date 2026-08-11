package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageController(MessageService messageService,
            SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/{channelUid}")
    public List<Message> getMessagesByChannel(@PathVariable String channelUid) {
        return messageService.getMessagesByChannel(channelUid);
    }

    @MessageMapping("/message")
    public void sendMessage(Message message) {
        Message saved = messageService.createMessage(message);
        messagingTemplate.convertAndSend(
                "/channels/" + saved.getChannelUid(),
                saved);
    }
}
