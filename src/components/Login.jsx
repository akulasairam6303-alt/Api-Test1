import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login({ goSignup }) {
  const dispatch = useDispatch();
  const { error, loading } = useSelector(
    state => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="signupPage">
      <form className="signupBox" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="authSubtitle">
          Login to continue shopping
        </p>

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

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          className="primaryBtn"
          disabled={loading}
        >
          {loading ? "Logging..." : "Login"}
        </button>

        <button
          type="button"
          className="secondaryBtn"
          onClick={goSignup}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Login;