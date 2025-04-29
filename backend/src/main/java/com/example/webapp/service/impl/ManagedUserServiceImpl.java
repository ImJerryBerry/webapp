package com.example.webapp.service.impl;

import com.example.webapp.entity.ManagedUser;
import com.example.webapp.dao.ManagedUserDao;
import com.example.webapp.service.ManagedUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;  // 添加List导入

@Service
public class ManagedUserServiceImpl implements ManagedUserService {
    
    @Autowired
    private ManagedUserDao managedUserDao;  // 修正变量名

    @Override
    public List<ManagedUser> getAllUsers() {
        return managedUserDao.findAll();  // 修正方法调用
    }

    @Override
    @Transactional
    public void addUser(ManagedUser user) {
        managedUserDao.insert(user);  // 修正方法调用
    }

    @Override
    @Transactional
    public void updateUser(ManagedUser user) {
        managedUserDao.update(user);  // 修正方法调用
    }

    @Override
    @Transactional
    public void deleteUser(int id) {
        managedUserDao.deleteById(id);
    }

    @Override
    public List<ManagedUser> searchUsers(String keyword) {  // 添加搜索方法实现
        return managedUserDao.search(keyword);
    }
}