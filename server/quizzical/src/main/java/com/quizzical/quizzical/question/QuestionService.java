package com.quizzical.quizzical.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.quizzical.quizzical.category.Category;
import com.quizzical.quizzical.category.CategoryRepository;
import com.quizzical.quizzical.question.Question.Difficulty;
import com.quizzical.quizzical.question.Question.QuestionType;

import java.util.Collections;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    public Page<Question> getQuestions(Long categoryId, Difficulty difficulty, QuestionType type, int amount,
            int page) {
        Pageable pageable = PageRequest.of(page, amount);
        Category category = null;

        if (categoryId != null) {
            category = categoryRepository.findById(categoryId).orElse(null);
        }

        // If category is not found or is null, return an empty page
        if (category == null && categoryId != null) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        // Fetch questions based on provided filters
        Page<Question> questions = questionRepository.findAll(
                QuestionSpecifications.withAttributes(category, difficulty, type), pageable);

        return questions;
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
