package com.discord_like_app.server.controller;

import com.discord_like_app.server.model.Message;
import com.discord_like_app.server.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageRepository repo;

    public MessageController(MessageRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Message> getAllMessages(){
        return repo.findAll();
    }

    @PostMapping
    public Message createMessage(@RequestBody Message message){
        message.setCreatedAt(java.time.LocalDateTime.now());
        return repo.save(message);
    }
}
