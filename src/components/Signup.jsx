import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

function Signup({ goLogin }) {
  const dispatch = useDispatch();
  const { error, loading } = useSelector(
    state => state.auth
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(signupUser(form));
  };

  return (
    <div className="signupPage">
      <form className="signupBox" onSubmit={handleSubmit}>
        <h2 className="signuph2">Create Account</h2>

        <div className="inputIcon">
          <FaUser />
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputIcon">
          <FaUser />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputIcon">
          <FaUser />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputIcon">
          <FaEnvelope />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputIcon">
          <FaLock />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputIcon">
          <FaLock />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          className="primaryBtn"
          disabled={loading}
        >
          {loading ? "Signing..." : "Signup"}
        </button>

        <button
          type="button"
          className="secondaryBtn"
          onClick={goLogin}
        >
          Already have account? Login
        </button>
      </form>
    </div>
  );
}

export default Signup;