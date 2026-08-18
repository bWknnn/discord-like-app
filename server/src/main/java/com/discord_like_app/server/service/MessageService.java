package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.repository.MessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepo,
            SimpMessagingTemplate messagingTemplate) {
        this.messageRepo = messageRepo;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Message> getMessagesByChannel(String channelUid) {
        return messageRepo.findByChannelUidOrderByCreatedAtAsc(channelUid);
    }

    public Message createMessage(Message message) {
        message.setCreatedAt(LocalDateTime.now());
        Message saved = messageRepo.save(message);
        messagingTemplate.convertAndSend(
                "/channels/" + saved.getChannelUid(),
                saved);
        return saved;
    }
}