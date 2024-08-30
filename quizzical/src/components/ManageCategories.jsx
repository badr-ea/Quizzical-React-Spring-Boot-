import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoriesContext } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";

export default function ManageCategories() {
  const navigate = useNavigate();
  const { categories, setCategories } = useContext(CategoriesContext);
  const { token } = useAuth();

  console.log(categories);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category) => {
    navigate("./edit-category", { state: { category } });
  };

  return (
    <div className="manage-questions-container">
      <h1>Manage Categories</h1>
      <div className="table-container">
        <Link to="./add-category" className="add-question-button">
          Add Category
        </Link>
        <table className="questions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
