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

    // 1. Lấy tất cả blogs
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // 2. Lấy blog theo ID
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    // 3. Tạo blog mới
    @Transactional
    public Blog createBlog(Blog blog) {
        blog.setStatus("draft");
        blog.setViewCount(0);
        blog.setIsFeatured(false);
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
        blog.setCategoryId(blogDetails.getCategoryId());
        blog.setImageUrl(blogDetails.getImageUrl());
        blog.setStatus(blogDetails.getStatus());
        blog.setTags(blogDetails.getTags());
        blog.setIsFeatured(blogDetails.getIsFeatured());
        blog.setIsActive(blogDetails.getIsActive());
        blog.setUpdatedAt(LocalDateTime.now());
        
        if ("published".equals(blogDetails.getStatus()) && blog.getPublishedAt() == null) {
            blog.setPublishedAt(LocalDateTime.now());
        }
        
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

    // 6. Lấy blogs theo author
    public List<Blog> getBlogsByAuthor(Long authorId) {
        return blogRepository.findByAuthorId(authorId);
    }

    // 7. Lấy blogs theo category
    public List<Blog> getBlogsByCategory(Long categoryId) {
        return blogRepository.findByCategoryId(categoryId);
    }

    // 8. Lấy published blogs
    public List<Blog> getPublishedBlogs() {
        return blogRepository.findByStatusAndIsActiveTrue("published");
    }

    // 9. Lấy featured blogs
    public List<Blog> getFeaturedBlogs() {
        return blogRepository.findByIsFeaturedTrue();
    }

    // 10. Search blogs
    public List<Blog> searchBlogs(String keyword) {
        return blogRepository.findByKeyword(keyword);
    }

    // 11. Lấy blogs với pagination
    public Page<Blog> getPublishedBlogsWithPagination(Pageable pageable) {
        return blogRepository.findByStatusAndIsActiveTrue("published", pageable);
    }

    // 12. Tăng view count
    @Transactional
    public void incrementViewCount(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        blog.setViewCount(blog.getViewCount() + 1);
        blogRepository.save(blog);
    }

    // 13. Publish blog
    @Transactional
    public Blog publishBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        blog.setStatus("published");
        blog.setPublishedAt(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    // 14. Lấy latest blogs
    public List<Blog> getLatestBlogs(int limit) {
        return blogRepository.findTop10ByStatusOrderByPublishedAtDesc("published");
    }

    // 15. Lấy popular blogs
    public List<Blog> getPopularBlogs(int limit) {
        return blogRepository.findTop10ByStatusOrderByViewCountDesc("published");
    }
}