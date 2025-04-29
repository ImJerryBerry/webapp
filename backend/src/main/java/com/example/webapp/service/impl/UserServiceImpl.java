package com.example.webapp.service.impl;

import com.example.webapp.entity.User;
import com.example.webapp.dao.UserDao;  // 添加UserDao的导入
import com.example.webapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserDao userDao;

    @Override
    public void register(User user) {
        // 检查用户名是否已存在
        if (userDao.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("用户名已存在，请重新输入！");
        }
        
        try {
            userDao.insert(user);
        } catch (Exception e) {
            throw new RuntimeException("注册失败：" + e.getMessage());
        }
    }

    @Override
    public User login(String username, String password) {
        User user = userDao.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        throw new RuntimeException("用户名或密码错误！");
    }

    @Override
    public void updatePassword(String username, String oldPassword, String newPassword) {
        User user = userDao.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在！");
        }
        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("原密码错误！");
        }
        userDao.updatePassword(username, newPassword);
    }

    @Override
    public List<User> getUserList() {
        return userDao.findAll();
    }

    @Override
    public User findByUsername(String username) {
        return userDao.findByUsername(username);
    }
}