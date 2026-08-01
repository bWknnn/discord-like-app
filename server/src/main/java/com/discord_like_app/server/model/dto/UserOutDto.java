package com.discord_like_app.server.model.dto;

import com.discord_like_app.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOutDto {
    private UUID uid;
    private String username;
    private String email;

    public static UserOutDto fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserOutDto.builder()
                .uid(user.getUserUid())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}