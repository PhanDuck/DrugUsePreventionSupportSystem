package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.UserDTO;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserID(user.getId());
        dto.setUserName(user.getUsername() != null ? user.getUsername() : "");
        dto.setEmail(user.getEmail() != null ? user.getEmail() : "");
        
        // Safe null handling for name
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String lastName = user.getLastName() != null ? user.getLastName() : "";
        dto.setFullName(firstName + " " + lastName);
        
        dto.setPhone(user.getPhone());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setDegree(user.getDegree());
        dto.setExpertise(user.getExpertise());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRole(user.getRole());
        return dto;
    }

    public List<UserDTO> convertToDTOList(List<User> users) {
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllUsersDTO() {
        return convertToDTOList(userRepository.findAll());
    }

    public Optional<UserDTO> getUserByIdDTO(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<UserDTO> getUsersByRoleDTO(Long roleId) {
        return convertToDTOList(userRepository.findByRoleId(roleId));
    }

    public List<UserDTO> getConsultantsDTO() {
        return convertToDTOList(userRepository.findConsultants());
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Consultant-related methods
    public List<User> findAllConsultants() {
        return userRepository.findConsultants();
    }
    
    public List<User> searchConsultants(String keyword, String specialty, String location, Double minRating, Double maxPrice) {
        // For now, return all consultants. Can be enhanced later with filtering
        return userRepository.findConsultants();
    }
    
    public List<User> findAvailableConsultants() {
        // For now, return all active consultants
        return userRepository.findConsultants().stream()
                .filter(user -> user.getIsActive() != null && user.getIsActive())
                .collect(Collectors.toList());
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
} 