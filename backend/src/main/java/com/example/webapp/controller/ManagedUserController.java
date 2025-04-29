package com.example.webapp.controller;

import com.example.webapp.entity.ManagedUser;
import com.example.webapp.service.ManagedUserService;
import com.example.webapp.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managed-user")
public class ManagedUserController {
    
    @Autowired
    private ManagedUserService managedUserService;

    @GetMapping("/list")
    public Result<?> getAllUsers() {
        try {
            List<ManagedUser> users = managedUserService.getAllUsers();
            return Result.success(users);
        } catch (Exception e) {
            return Result.error("获取用户列表失败：" + e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> addUser(@RequestBody ManagedUser user) {
        try {
            managedUserService.addUser(user);
            return Result.success(null);  // 修改为传入null
        } catch (Exception e) {
            return Result.error("添加用户失败：" + e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> updateUser(@RequestBody ManagedUser user) {
        try {
            managedUserService.updateUser(user);
            return Result.success(null);  // 修改为传入null
        } catch (Exception e) {
            return Result.error("更新用户失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> deleteUser(@PathVariable int id) {
        try {
            managedUserService.deleteUser(id);
            return Result.success(null);  // 修改为传入null
        } catch (Exception e) {
            return Result.error("删除用户失败：" + e.getMessage());
        }
    }

    @GetMapping("/search")
    public Result<?> searchUsers(@RequestParam String keyword) {
        try {
            List<ManagedUser> users = managedUserService.searchUsers(keyword);
            return Result.success(users);
        } catch (Exception e) {
            return Result.error("搜索用户失败：" + e.getMessage());
        }
    }
}