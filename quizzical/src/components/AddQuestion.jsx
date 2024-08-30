import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesContext } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";

export default function AddQuestion() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { categories, loading, error } = useContext(CategoriesContext);
  const [formData, setFormData] = useState({
    category: null,
    type: "multiple",
    difficulty: "easy",
    question: "",
    correctAnswer: "",
    incorrectAnswers: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category.id === parseInt(selectedCategoryId)
    );
    setFormData((prevData) => ({
      ...prevData,
      category: selectedCategory,
    }));
  };

  const postQuestion = async () => {
    const { incorrectAnswers, ...data } = formData;
    const incorrectAnswersArray = incorrectAnswers
      .split(",")
      .map((answer) => answer.trim());

    const requestBody = {
      ...data,
      incorrectAnswers: incorrectAnswersArray,
    };

    try {
      const response = await fetch("http://localhost:8080/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to submit question");
      }

      const result = await response.json();
      console.log("Question added successfully:", result);
      // Redirect to ManageQuestions page after successful submission
      navigate("/admin/questions");
    } catch (error) {
      console.error("Error adding question:", error.message);
      // Handle errors (show user feedback, etc.)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postQuestion();
  };

  return (
    <div className="add-question-container">
      <h1>Add Question</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category ? formData.category.id : ""}
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="multiple">Multiple Choice</option>
            <option value="true_false">True/False</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input
            id="question"
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="correctAnswer">Correct Answer:</label>
          <input
            id="correctAnswer"
            type="text"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="incorrectAnswers">
            Incorrect Answers (comma-separated):
          </label>
          <input
            id="incorrectAnswers"
            type="text"
            name="incorrectAnswers"
            value={formData.incorrectAnswers}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
}
