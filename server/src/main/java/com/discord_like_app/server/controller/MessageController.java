package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

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

    @MessageMapping("/message")
    public void sendMessage(Message message) {
        messageService.createMessage(message);
    }
}
