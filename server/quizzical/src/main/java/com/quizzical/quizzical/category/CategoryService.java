package com.quizzical.quizzical.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quizzical.quizzical.question.QuestionRepository;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        boolean hasQuestions = questionRepository.existsByCategoryId(id);

        if (hasQuestions) {
            throw new IllegalStateException("Cannot delete category with associated questions.");
        }
        categoryRepository.deleteById(id);
    }
}
