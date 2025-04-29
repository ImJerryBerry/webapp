package com.example.webapp.controller;

import com.example.webapp.entity.Article;
import com.example.webapp.entity.User;
import com.example.webapp.service.ArticleService;
import com.example.webapp.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/article")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;

    @GetMapping("/list")
    public Result<?> getAllArticles() {
        try {
            List<Article> articles = articleService.getAllArticles();
            return Result.success(articles);
        } catch (Exception e) {
            return Result.error("获取文章列表失败：" + e.getMessage());
        }
    }

    @GetMapping("/author/{username}")
    public Result<?> getArticlesByAuthor(@PathVariable String username) {
        try {
            List<Article> articles = articleService.getArticlesByAuthor(username);
            return Result.success(articles);
        } catch (Exception e) {
            return Result.error("获取作者文章失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<?> getArticleById(@PathVariable int id) {
        try {
            Article article = articleService.getArticleById(id);
            return Result.success(article);
        } catch (Exception e) {
            return Result.error("获取文章详情失败：" + e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> addArticle(@RequestBody Article article) {
        try {
            articleService.addArticle(article);
            return Result.success(null);
        } catch (Exception e) {
            return Result.error("添加文章失败：" + e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> updateArticle(@RequestBody Article article) {
        try {
            articleService.updateArticle(article);
            return Result.success(null);
        } catch (Exception e) {
            return Result.error("更新文章失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> deleteArticle(@PathVariable int id) {
        try {
            articleService.deleteArticle(id);
            return Result.success(null);
        } catch (Exception e) {
            return Result.error("删除文章失败：" + e.getMessage());
        }
    }

    @GetMapping("/authors")
    public Result<?> getAllAuthors() {
        try {
            List<User> authors = articleService.getAllAuthors();
            return Result.success(authors);
        } catch (Exception e) {
            return Result.error("获取作者列表失败：" + e.getMessage());
        }
    }
} 