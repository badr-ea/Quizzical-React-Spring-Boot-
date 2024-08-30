import React, { useContext } from "react";
import { CategoriesContext } from "../contexts/CategoriesContext";

export default function Start(props) {
  const { categories, loading, error } = useContext(CategoriesContext);

  return (
    <div className="start-page">
      <p className="title">Quizzical</p>
      <p className="description">
        Test your knowledge by answerings questions from various topics
      </p>
      <input type="number" onChange={props.handleNumber}></input>
      <select onChange={props.handleCategory}>
        <option value="">Any Category</option>
        {categories.map((item, index) => {
          return (
            <option value={item.id} key={index}>
              {item.name}
            </option>
          );
        })}
      </select>
      <select onChange={props.handleDifficulty}>
        <option value="any">Any Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div className="start-button" onClick={props.start}>
        Start Quiz
      </div>
    </div>
  );
}
