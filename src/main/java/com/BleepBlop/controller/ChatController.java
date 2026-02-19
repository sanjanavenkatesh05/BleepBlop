package com.BleepBlop.controller;

import com.BleepBlop.model.ChatMessage;
import com.BleepBlop.model.User;
import com.BleepBlop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    /**
     * Broadcasts a message to /topic/public.
     * Used for Join/Leave events mainly, or public chat if we had it.
     */
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    /**
     * Sends a private message to a specific user.
     * The `recipient` field in ChatMessage must be the username of the status.
     */
    @MessageMapping("/chat.sendPrivateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getRecipient() != null) {
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getRecipient(),
                    "/queue/messages",
                    chatMessage
            );

        }
    }
    
    @MessageMapping("/chat.getUsers")
    @SendTo("/topic/users")
    public List<User> getUsers() {
        return userService.findConnectedUsers();
    }
}
