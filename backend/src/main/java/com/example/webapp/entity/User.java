package com.example.webapp.entity;

import lombok.Data;

@Data
public class User {
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String birthDate;
    private String avatar;
    private Integer articleCount;
}