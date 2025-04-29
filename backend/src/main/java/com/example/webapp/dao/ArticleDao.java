package com.example.webapp.dao;

import com.example.webapp.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ArticleDao {
    List<Article> findAll();
    List<Article> findByAuthor(@Param("authorUsername") String authorUsername);
    Article findById(@Param("id") int id);
    int insert(Article article);
    int update(Article article);
    int deleteById(@Param("id") int id);
    int countByAuthor(@Param("authorUsername") String authorUsername);
} 