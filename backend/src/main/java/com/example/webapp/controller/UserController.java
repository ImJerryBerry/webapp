package com.example.webapp.controller;

import com.example.webapp.entity.User;
import com.example.webapp.service.UserService;
import com.example.webapp.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result<?> register(@RequestBody User user) {
        try {
            userService.register(user);
            return Result.success(null);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Result<User> login(@RequestParam String username, @RequestParam String password) {
        User user = userService.login(username, password);
        return Result.success(user);
    }

    @PutMapping("/password")
    public Result<?> updatePassword(@RequestParam String username, 
                                  @RequestParam String oldPassword,
                                  @RequestParam String newPassword) {
        try {
            userService.updatePassword(username, oldPassword, newPassword);
            return Result.success(null);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<?> getUserList() {
        return Result.success(userService.getUserList());
    }

    @GetMapping("/check")
    public Result<?> checkUsername(@RequestParam String username) {
        User user = userService.findByUsername(username);
        return user != null ? Result.success(null) : Result.error("用户名不存在");
    }

    @GetMapping("/detail")
    public Result<User> getUserDetail(@RequestParam String username) {
        try {
            User user = userService.findByUsername(username);
            if (user != null) {
                // 不返回密码
                user.setPassword(null);
                return Result.success(user);
            } else {
                return Result.error("用户不存在");
            }
        } catch (Exception e) {
            return Result.error("获取用户详情失败：" + e.getMessage());
        }
    }
}