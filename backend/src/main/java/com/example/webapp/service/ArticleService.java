package com.example.webapp.service;

import com.example.webapp.entity.Article;
import com.example.webapp.entity.User;
import java.util.List;

public interface ArticleService {
    List<Article> getAllArticles();
    List<Article> getArticlesByAuthor(String authorUsername);
    Article getArticleById(int id);
    void addArticle(Article article);
    void updateArticle(Article article);
    void deleteArticle(int id);
    int getArticleCountByAuthor(String authorUsername);
    List<User> getAllAuthors();
} 