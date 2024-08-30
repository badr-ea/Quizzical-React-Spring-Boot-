import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ManageQuestions from "../components/ManageQuestions";
import ManageCategories from "../components/ManageCategories";
import AddQuestion from "../components/AddQuestion";
import EditQuestion from "../components/EditQuestion";
import AddCategory from "../components/AddCategory";
import EditCategory from "../components/EditCategory";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/questions" element={<ManageQuestions />} />
        <Route path="/categories" element={<ManageCategories />} />
        <Route path="/questions/add-question" element={<AddQuestion />} />
        <Route path="/questions/edit-question" element={<EditQuestion />} />
        <Route path="/categories/add-category" element={<AddCategory />} />
        <Route path="/categories/edit-category" element={<EditCategory />} />
      </Routes>
    </>
  );
}
