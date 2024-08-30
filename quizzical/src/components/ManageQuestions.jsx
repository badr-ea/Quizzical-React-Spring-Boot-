import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ManageQuestions() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10); // Or any number you prefer
  const navigate = useNavigate();

  async function getQuestions(page = 0) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/questions?page=${page}&amount=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setQuestions(data.content); // Assuming data.content contains the list of questions
      setTotalPages(data.totalPages); // Assuming data.totalPages contains total number of pages
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteQuestion(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/questions/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 204) {
        throw new Error("An error has occurred");
      }
      await getQuestions(currentPage); // Refresh the current page after deletion
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getQuestions(currentPage);
  }, [currentPage]);

  const handleEdit = (question) => {
    navigate("./edit-question", { state: { question } });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="manage-questions-container">
      <h1>Manage Questions</h1>
      <div className="table-container">
        <Link to="./add-question" className="add-question-button">
          Add Question
        </Link>
        <table className="questions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>Question</th>
              <th>Correct Answer</th>
              <th>Incorrect Answers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.category.name}</td>
                <td>{q.type}</td>
                <td>{q.difficulty}</td>
                <td>{q.question}</td>
                <td>{q.correctAnswer}</td>
                <td>{q.incorrectAnswers.join(", ")}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(q)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteQuestion(q.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
