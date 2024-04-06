import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const INIT_USER = {
    username: "",
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
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        alert("Registration successful! Login to continue....");
        navigate("/login");
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
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChange}
            type="text"
            name="username"
            value={formData?.username}
            placeholder="username"
            className=""
            required
          />
        </div>
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
          REGISTER
        </button>
      </form>
      <p>
        Already have an account?
        <Link to="/login">
          <span className="text-blue-600">Login</span>
        </Link>
      </p>
    </>
  );
}
