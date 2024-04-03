import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div>Home</div>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );
}
