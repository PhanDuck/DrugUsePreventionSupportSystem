package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Temporarily disabled due to service issues
//@RestController
//@RequestMapping("/api/courses")
//@CrossOrigin(origins = "*")
public class CourseController {
    // Controller disabled - will fix after basic system is running
} 