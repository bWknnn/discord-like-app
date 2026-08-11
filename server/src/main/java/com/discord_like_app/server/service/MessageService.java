package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepo;

    public MessageService(MessageRepository messageRepo) {
        this.messageRepo = messageRepo;
    }

    public List<Message> getMessagesByChannel(String channelUid) {
        return messageRepo.findByChannelUidOrderByCreatedAtAsc(channelUid);
    }

    public Message createMessage(Message message) {
        message.setCreatedAt(LocalDateTime.now());
        return messageRepo.save(message);
    }
}