package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Blog;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService {
    
    @Autowired
    private BlogRepository blogRepository;

    // 1. Get all blogs
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // 2. Get blog by ID
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    // 3. Create new blog
    @Transactional
    public Blog createBlog(Blog blog) {
        blog.setIsActive(true);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setUpdatedAt(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    // 4. Update blog
    @Transactional
    public Blog updateBlog(Long id, Blog blogDetails) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        blog.setTitle(blogDetails.getTitle());
        blog.setContent(blogDetails.getContent());
        blog.setAuthorId(blogDetails.getAuthorId());
        blog.setCategoryId(blogDetails.getCategoryId());
        blog.setStatus(blogDetails.getStatus());
        blog.setIsActive(blogDetails.getIsActive());
        blog.setUpdatedAt(LocalDateTime.now());
        
        return blogRepository.save(blog);
    }

    // 5. Delete blog
    @Transactional
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new RuntimeException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    // 6. Get blogs by author
    public List<Blog> getBlogsByAuthor(Long authorId) {
        return blogRepository.findByAuthorId(authorId);
    }

    // 7. Get blogs by category
    public List<Blog> getBlogsByCategory(Long categoryId) {
        return blogRepository.findByCategoryId(categoryId);
    }

    // 8. Get published blogs
    public List<Blog> getPublishedBlogs() {
        return blogRepository.findByStatus("published");
    }

    // 9. Get featured blogs
    public List<Blog> getFeaturedBlogs() {
        return blogRepository.findByIsFeaturedTrue();
    }

    // 10. Search blogs by keyword
    public List<Blog> searchBlogs(String keyword) {
        return blogRepository.findByKeyword(keyword);
    }

    // 11. Get blogs with pagination
    public Page<Blog> getBlogsWithPagination(Pageable pageable) {
        return blogRepository.findAll(pageable);
    }

    // 12. Increment view count
    @Transactional
    public void incrementViewCount(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setViewCount(blog.getViewCount() + 1);
        blogRepository.save(blog);
    }

    // 13. Get blogs by status
    public List<Blog> getBlogsByStatus(String status) {
        return blogRepository.findByStatus(status);
    }

    // 14. Get latest blogs
    public List<Blog> getLatestBlogs(int limit) {
        return blogRepository.findTop10ByStatusOrderByPublishedAtDesc("published");
    }

    // 15. Get popular blogs
    public List<Blog> getPopularBlogs() {
        return blogRepository.findPopularBlogs();
    }
}