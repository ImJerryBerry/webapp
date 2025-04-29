package com.example.webapp.service;

import com.example.webapp.entity.User;
import java.util.List;

public interface UserService {
    // 用户注册
    void register(User user);
    
    // 用户登录
    User login(String username, String password);
    
    // 修改密码
    void updatePassword(String username, String oldPassword, String newPassword);
    
    // 获取用户列表
    List<User> getUserList();
    
    // 添加新方法
    User findByUsername(String username);
}