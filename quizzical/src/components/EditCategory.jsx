import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function EditCategory() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
  });

  const { category } = location.state || {};

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:8080/api/categories/${category.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
      <h1>Edit Category</h1>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
