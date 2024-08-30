import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CategoriesContext } from "../contexts/CategoriesContext";

export default function AddCategory() {
  const navigate = useNavigate();
  const { setCategories } = useContext(CategoriesContext);
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/categories", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const category = await response.json();

    navigate("/admin/categories");
    window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="add-question-container">
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
}
