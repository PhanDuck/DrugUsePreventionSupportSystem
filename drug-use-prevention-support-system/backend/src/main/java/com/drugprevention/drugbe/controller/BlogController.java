package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Blog;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogController {
    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Blog>> getActiveBlogs() {
        return ResponseEntity.ok(blogService.getActiveBlogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Integer id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PostMapping
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog, Authentication authentication) {
        User author = (User) authentication.getPrincipal();
        return ResponseEntity.ok(blogService.createBlog(blog, author));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Integer id, @RequestBody Blog blogDetails) {
        return ResponseEntity.ok(blogService.updateBlog(id, blogDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Integer id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Blog>> getBlogsByAuthor(@PathVariable Integer authorId) {
        return ResponseEntity.ok(blogService.getBlogsByAuthor(authorId));
    }
} 