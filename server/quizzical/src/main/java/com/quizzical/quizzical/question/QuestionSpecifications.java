package com.quizzical.quizzical.question;

import com.quizzical.quizzical.category.Category;
import com.quizzical.quizzical.question.Question.Difficulty;
import com.quizzical.quizzical.question.Question.QuestionType;

import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

public class QuestionSpecifications {

    public static Specification<Question> withAttributes(Category category, Difficulty difficulty, QuestionType type) {
        return (root, query, criteriaBuilder) -> {
            // Create a list to hold predicates
            List<Predicate> predicates = new ArrayList<>();

            // Add predicates based on provided attributes
            if (category != null) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (difficulty != null) {
                predicates.add(criteriaBuilder.equal(root.get("difficulty"), difficulty));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
