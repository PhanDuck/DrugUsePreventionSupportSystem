package com.drugprevention.drugbe.dto;

import java.util.List;

public class AssessmentQuestionDTO {
    private Long id;
    private String question;
    private String questionType;
    private List<OptionDTO> options;
    private Integer orderIndex;
    private Boolean isRequired;

    // Constructors
    public AssessmentQuestionDTO() {}

    public AssessmentQuestionDTO(Long id, String question, String questionType, 
                                List<OptionDTO> options, Integer orderIndex, Boolean isRequired) {
        this.id = id;
        this.question = question;
        this.questionType = questionType;
        this.options = options;
        this.orderIndex = orderIndex;
        this.isRequired = isRequired;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public List<OptionDTO> getOptions() { return options; }
    public void setOptions(List<OptionDTO> options) { this.options = options; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean isRequired) { this.isRequired = isRequired; }

    // Inner class for options
    public static class OptionDTO {
        private Integer value;
        private String text;

        public OptionDTO() {}

        public OptionDTO(Integer value, String text) {
            this.value = value;
            this.text = text;
        }

        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
} 