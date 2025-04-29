package com.example.webapp.dao;

import com.example.webapp.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface UserDao {
    User findByUsername(@Param("username") String username);
    int insert(User user);
    int updatePassword(@Param("username") String username, @Param("password") String password);
    List<User> findAll();
    List<User> findAllAuthors();
    int updateArticleCount(@Param("username") String username, @Param("count") int count);
}