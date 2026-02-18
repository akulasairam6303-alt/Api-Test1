import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import { FaLock, FaEnvelope } from "react-icons/fa";

export default function Login({ goHome, goSignup }) {
  const dispatch = useDispatch();
  const { error } = useSelector(s => s.auth);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const update = e =>
    setData({ ...data, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    dispatch(loginUser(data));
  };

  return (
    <div className="signupPage">
      <form className="signupBox" onSubmit={submit}>
        <h2>Login</h2>

        <div className="inputIcon">
          <FaEnvelope />
          <input
            name="email"
            placeholder="Email"
            onChange={update}
            required
          />
        </div>

        <div className="inputIcon">
          <FaLock />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={update}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primaryBtn">Login</button>

        <button
          type="button"
          onClick={goSignup}
          className="linkBtn"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
