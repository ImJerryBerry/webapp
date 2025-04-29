package com.example.webapp.service;

import com.example.webapp.entity.ManagedUser;
import java.util.List;

public interface ManagedUserService {
    List<ManagedUser> getAllUsers();
    void addUser(ManagedUser user);
    void updateUser(ManagedUser user);
    void deleteUser(int id);  // 改为int类型
    List<ManagedUser> searchUsers(String keyword);
}