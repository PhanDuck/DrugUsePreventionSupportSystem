package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Blog;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {
    @Autowired
    private BlogRepository blogRepository;

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public List<Blog> getActiveBlogs() {
        return blogRepository.findByStatus("ACTIVE");
    }

    public Blog getBlogById(Integer id) {
        return blogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    public Blog createBlog(Blog blog, User author) {
        blog.setAuthor(author);
        blog.setPublishDate(LocalDateTime.now());
        blog.setStatus("ACTIVE");
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Integer id, Blog blogDetails) {
        Blog blog = getBlogById(id);
        blog.setTitle(blogDetails.getTitle());
        blog.setContent(blogDetails.getContent());
        blog.setStatus(blogDetails.getStatus());
        return blogRepository.save(blog);
    }

    public void deleteBlog(Integer id) {
        Blog blog = getBlogById(id);
        blog.setStatus("DELETED");
        blogRepository.save(blog);
    }

    public List<Blog> getBlogsByAuthor(Integer authorId) {
        return blogRepository.findByAuthor_UserID(authorId);
    }
} 