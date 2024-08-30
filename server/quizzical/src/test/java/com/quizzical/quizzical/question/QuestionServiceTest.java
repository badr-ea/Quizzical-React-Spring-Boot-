package com.quizzical.quizzical.question;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.quizzical.quizzical.category.Category;
import com.quizzical.quizzical.category.CategoryRepository;
import com.quizzical.quizzical.question.Question.Difficulty;
import com.quizzical.quizzical.question.Question.QuestionType;

import java.util.Collections;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class QuestionServiceTest {

    @InjectMocks
    private QuestionService questionService;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuestionSpecifications questionSpecifications;

    @Mock
    private CategoryRepository categoryRepository;

    @Test
    public void shouldReturnQuestionWhenIdIsFound() {

        Long questionId = 1L;
        Question mockQuestion = new Question();
        mockQuestion.setId(questionId);

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(mockQuestion));

        Question result = questionService.getQuestionById(questionId);

        assertNotNull(result);
        assertEquals(questionId, result.getId());
    }

    @Test
    public void shouldReturnNullWhenIdIsNotFound() {
        Long questionId = 99999L;
        when(questionRepository.findById(questionId)).thenReturn(Optional.empty());

        Question result = questionService.getQuestionById(questionId);

        assertNull(result);
    }

    @Test
    public void testGetQuestions_WithCategory() {
        // Arrange
        Long categoryId = 1L;
        Category category = new Category();
        category.setId(categoryId);

        Difficulty difficulty = Difficulty.medium;
        QuestionType type = QuestionType.multiple;
        int amount = 10;
        int page = 0;

        Pageable pageable = PageRequest.of(page, amount);
        Page<Question> expectedPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(questionRepository.findAll(
                any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        // Act
        Page<Question> result = questionService.getQuestions(categoryId, difficulty, type, amount, page);

        // Assert
        assertEquals(expectedPage, result);
        verify(categoryRepository).findById(categoryId);
        verify(questionRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    public void testGetQuestions_WithoutCategory() {
        // Arrange
        Long categoryId = null;

        Difficulty difficulty = Difficulty.medium;
        QuestionType type = QuestionType.multiple;
        int amount = 10;
        int page = 0;

        Pageable pageable = PageRequest.of(page, amount);
        Page<Question> expectedPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(questionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        // Act
        Page<Question> result = questionService.getQuestions(categoryId, difficulty, type, amount, page);

        // Assert
        assertEquals(expectedPage, result);
        verify(categoryRepository, never()).findById(anyLong());
        verify(questionRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    public void testSaveQuestion() {
        // Arrange
        Question question = new Question();
        Category category = new Category();
        question.setQuestion("What is Java?");
        category.setName("Programming");
        question.setCategory(category);

        when(questionRepository.save(question)).thenReturn(question);

        // Act
        Question savedQuestion = questionService.saveQuestion(question);

        // Assert
        assertNotNull(savedQuestion);
        assertEquals("What is Java?", savedQuestion.getQuestion());
        assertEquals(category, savedQuestion.getCategory());
        verify(questionRepository, times(1)).save(question);
    }

    @Test
    public void testAddDeleteAndRetrieveQuestion() {
        // Arrange
        Long questionId = 1L;
        Question question = new Question();
        question.setId(questionId);
        question.setQuestion("What is Java?");

        when(questionRepository.save(question)).thenReturn(question);
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(questionRepository.findById(questionId)).thenReturn(Optional.empty());

        // Act - Add the question
        Question addedQuestion = questionService.saveQuestion(question);

        // Assert - Check the question was added correctly
        assertNotNull(addedQuestion);
        assertEquals(questionId, addedQuestion.getId());
        assertEquals("What is Java?", addedQuestion.getQuestion());

        // Act - Delete the question
        questionService.deleteQuestion(questionId);

        // Assert - Check that deleteById was called
        verify(questionRepository, times(1)).deleteById(questionId);

        // Act - Attempt to retrieve the deleted question
        Question retrievedQuestion = questionService.getQuestionById(questionId);

        // Assert - Verify that the question cannot be found
        assertNull(retrievedQuestion);
    }

}
