package com.example.webapp.service.impl;

import com.example.webapp.dao.ArticleDao;
import com.example.webapp.dao.UserDao;
import com.example.webapp.entity.Article;
import com.example.webapp.entity.User;
import com.example.webapp.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleDao articleDao;
    
    @Autowired
    private UserDao userDao;

    @Override
    public List<Article> getAllArticles() {
        return articleDao.findAll();
    }

    @Override
    public List<Article> getArticlesByAuthor(String authorUsername) {
        return articleDao.findByAuthor(authorUsername);
    }

    @Override
    public Article getArticleById(int id) {
        return articleDao.findById(id);
    }

    @Override
    @Transactional
    public void addArticle(Article article) {
        articleDao.insert(article);
        
        // 更新作者的文章计数
        String authorUsername = article.getAuthorUsername();
        int articleCount = articleDao.countByAuthor(authorUsername);
        userDao.updateArticleCount(authorUsername, articleCount);
    }

    @Override
    @Transactional
    public void updateArticle(Article article) {
        articleDao.update(article);
    }

    @Override
    @Transactional
    public void deleteArticle(int id) {
        Article article = articleDao.findById(id);
        if (article != null) {
            articleDao.deleteById(id);
            
            // 更新作者的文章计数
            String authorUsername = article.getAuthorUsername();
            int articleCount = articleDao.countByAuthor(authorUsername);
            userDao.updateArticleCount(authorUsername, articleCount);
        }
    }

    @Override
    public int getArticleCountByAuthor(String authorUsername) {
        return articleDao.countByAuthor(authorUsername);
    }

    @Override
    public List<User> getAllAuthors() {
        return userDao.findAllAuthors();
    }
} 