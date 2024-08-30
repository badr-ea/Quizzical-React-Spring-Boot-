package com.quizzical.quizzical.question;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.quizzical.quizzical.category.Category;
import com.quizzical.quizzical.category.CategoryService;
import com.quizzical.quizzical.question.Question.Difficulty;
import com.quizzical.quizzical.question.Question.QuestionType;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(question);
    }

    @GetMapping
    public ResponseEntity<Page<Question>> getQuestions(
            @RequestParam(value = "category", required = false) Long categoryId,
            @RequestParam(value = "difficulty", required = false) Difficulty difficulty,
            @RequestParam(value = "type", required = false) QuestionType type,
            @RequestParam(value = "amount", defaultValue = "40") Integer amount,
            @RequestParam(value = "page", defaultValue = "0") Integer page) {

        Page<Question> questions = questionService.getQuestions(categoryId, difficulty, type, amount, page);

        if (questions.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        return ResponseEntity.ok(questions); // 200 OK
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question createdQuestion = questionService.saveQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion); // 201 Created
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Question> partialUpdateQuestion(@PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        // Retrieve the existing question
        Question existingQuestion = questionService.getQuestionById(id);
        if (existingQuestion == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }

        // Apply updates
        updates.forEach((key, value) -> {
            switch (key) {
                case "category":
                    // Assuming 'value' is the ID of the new category
                    Long categoryId = Long.parseLong(value.toString());
                    Category newCategory = categoryService.getCategoryById(categoryId);
                    if (newCategory != null) {
                        existingQuestion.setCategory(newCategory);
                    }
                    break;
                case "type":
                    existingQuestion.setType(Question.QuestionType.valueOf(value.toString()));
                    break;
                case "difficulty":
                    existingQuestion.setDifficulty(Question.Difficulty.valueOf(value.toString()));
                    break;
                case "question":
                    existingQuestion.setQuestion(value.toString());
                    break;
                case "correctAnswer":
                    existingQuestion.setCorrectAnswer(value.toString());
                    break;
                case "incorrectAnswers":
                    // Assuming 'value' is a list of incorrect answers
                    existingQuestion.setIncorrectAnswers((List<String>) value);
                    break;
            }
        });

        // Save the updated question
        Question updatedQuestion = questionService.saveQuestion(existingQuestion);
        return ResponseEntity.ok(updatedQuestion); // 200 OK
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (questionService.getQuestionById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
