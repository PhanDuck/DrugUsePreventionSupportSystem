package com.drugprevention.drugbe.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * Utility class for converting Vietnamese names to English format
 * Handles Vietnamese diacritics and special characters
 */
public class NameConverter {

    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    /**
     * Convert Vietnamese name to English format
     * Example: "Trần Ân" -> "Tran An"
     */
    public static String convertToEnglish(String vietnameseName) {
        if (vietnameseName == null || vietnameseName.trim().isEmpty()) {
            return "";
        }

        // Remove diacritics and convert to ASCII
        String normalized = Normalizer.normalize(vietnameseName, Normalizer.Form.NFD);
        String withoutDiacritics = DIACRITICS_PATTERN.matcher(normalized).replaceAll("");
        
        // Convert to uppercase first letter of each word
        String[] words = withoutDiacritics.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (words[i].length() > 0) {
                String word = words[i].toLowerCase();
                word = word.substring(0, 1).toUpperCase() + word.substring(1);
                
                if (i > 0) {
                    result.append(" ");
                }
                result.append(word);
            }
        }
        
        return result.toString();
    }

    /**
     * Validate if name contains Vietnamese characters
     */
    public static boolean containsVietnameseCharacters(String name) {
        if (name == null) return false;
        
        // Check for Vietnamese diacritics
        return name.matches(".*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ].*");
    }

    /**
     * Validate if name is in English format (no Vietnamese characters)
     */
    public static boolean isValidEnglishName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        
        // Check if contains only English letters, spaces, and common punctuation
        return name.matches("^[a-zA-Z\\s\\-']+$");
    }

    /**
     * Get validation message for name input
     */
    public static String getNameValidationMessage(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Name cannot be empty";
        }
        
        if (containsVietnameseCharacters(name)) {
            return "Please enter name in English format (e.g., 'Tran An' instead of 'Trần Ân')";
        }
        
        if (!isValidEnglishName(name)) {
            return "Name should contain only English letters, spaces, hyphens, and apostrophes";
        }
        
        return null; // Valid name
    }
} 