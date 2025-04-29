package com.example.webapp.dao;

import com.example.webapp.entity.ManagedUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ManagedUserDao {
    List<ManagedUser> findAll();
    ManagedUser findById(@Param("id") int id);
    int insert(ManagedUser user);
    int update(ManagedUser user);
    int deleteById(@Param("id") int id);
    List<ManagedUser> search(@Param("keyword") String keyword);
}