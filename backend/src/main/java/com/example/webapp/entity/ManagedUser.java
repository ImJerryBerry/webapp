package com.example.webapp.entity;

import lombok.Data;

@Data
public class ManagedUser {
    private int id;
    private String date;
    private String name;
    private String province;
    private String city;
    private String address;
    private String zipCode;
}