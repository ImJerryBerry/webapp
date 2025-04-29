package com.example.webapp.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Article {
    private Integer id;
    private String authorUsername;
    private String title;
    private String content;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
} 