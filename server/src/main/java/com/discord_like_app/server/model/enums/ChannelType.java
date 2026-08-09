package com.discord_like_app.server.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ChannelType {
    TEXT("text"),
    VOICE("voice");

    private final String value;

    ChannelType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ChannelType fromValue(String value) {
        for (ChannelType type : ChannelType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum type " + value);
    }
}
