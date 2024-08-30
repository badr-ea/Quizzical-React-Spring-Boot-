import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CategoriesContext } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";

export default function EditQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, loading, error } = useContext(CategoriesContext);
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    category: "",
    type: "multiple",
    difficulty: "easy",
    question: "",
    correctAnswer: "",
    incorrectAnswers: "",
  });
  const [questionId, setQuestionId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.question) {
      const questionData = location.state.question;
      setQuestionId(questionData.id); // Store the question ID
      setFormData({
        category: questionData.category.id, // Use only category ID
        type: questionData.type,
        difficulty: questionData.difficulty,
        question: questionData.question,
        correctAnswer: questionData.correctAnswer,
        incorrectAnswers: questionData.incorrectAnswers.join(", "),
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { incorrectAnswers, ...data } = formData;
    // Convert comma-separated incorrect answers to an array
    const incorrectAnswersArray = incorrectAnswers
      .split(",")
      .map((answer) => answer.trim());

    // Prepare data to send to backend
    const updatedQuestion = {
      ...data,
      incorrectAnswers: incorrectAnswersArray,
      // Include only the category ID
      category: formData.category,
    };

    console.log(updatedQuestion);

    try {
      const response = await fetch(
        `http://localhost:8080/api/questions/${questionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedQuestion),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the question");
      }

      // Redirect to ManageQuestions page after successful update
      navigate("/admin/questions/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="add-question-container">
      <h1>Edit Question</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category.id}
            onChange={handleChange}
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
