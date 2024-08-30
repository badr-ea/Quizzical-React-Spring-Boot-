import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <Link to="/admin/questions">
          <li>Manage Questions</li>
        </Link>

        <Link to="/admin/categories">
          <li>Manage Categories</li>
        </Link>
        <Link to="/">
          <li className="">Quizzical</li>
        </Link>
      </ul>
    </nav>
  );
}
