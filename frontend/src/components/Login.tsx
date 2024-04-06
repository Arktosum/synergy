import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const INIT_USER = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(INIT_USER);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) navigate("/dashboard");
  });

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        // handle result here
        console.log(err);
      });
    setFormData(INIT_USER);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setFormData((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-gray-600 flex flex-col w-1/2 gap-5"
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            value={formData?.email}
            placeholder="Email"
            className=""
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            value={formData?.password}
            placeholder="password"
            className=""
            required
          />
        </div>

        <button className="px-5 py-2 bg-green-600 text-white rounded-xl">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/register">
          <span className="text-blue-600">Register</span>
        </Link>
      </p>
    </>
  );
}
