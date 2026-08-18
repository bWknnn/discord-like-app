package com.discord_like_app.server.service;

import com.discord_like_app.server.model.Channel;
import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.model.User;
import com.discord_like_app.server.repository.ChannelRepository;
import com.discord_like_app.server.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    private final MessageRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChannelRepository channelRepository;

    public MessageService(MessageRepository messageRepo, SimpMessagingTemplate messagingTemplate,
            ChannelRepository channelRepository) {
        this.messageRepo = messageRepo;
        this.messagingTemplate = messagingTemplate;
        this.channelRepository = channelRepository;
    }

    public List<Message> getMessagesByChannel(String channelUid) {
        return messageRepo.findByChannelUidWithSender(UUID.fromString(channelUid));
    }

    public void createMessage(String channelUid, String text, User user) {
        Channel channel = channelRepository.findById(UUID.fromString(channelUid))
                .orElseThrow(() -> new EntityNotFoundException("Channel not found: " + channelUid));
        Message message = Message.builder()
                .text(text)
                .sender(user)
                .channel(channel)
                .build();

        Message saved = messageRepo.save(message);

        messagingTemplate.convertAndSend(
                "/channels/" + saved.getChannel().getChannelUid(),
                saved);
    }

}