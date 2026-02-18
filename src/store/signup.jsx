import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "./authSlice";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function Signup({ goLogin }) {
  const dispatch = useDispatch();
  const { error } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const update = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(signupUser(form));
    goLogin();
  };

  return (
    <div className="signupPage">
      <form className="signupBox" onSubmit={submit}>

        <h1 className="brand">ECOM</h1>
        <p className="subtitle">
          Create your shopping account
        </p>

        <h2>Create Account</h2>

        <div className="inputIcon">
          <FaUser />
          <input name="firstName" placeholder="First Name" onChange={update} required />
        </div>

        <div className="inputIcon">
          <FaUser />
          <input name="lastName" placeholder="Last Name" onChange={update} required />
        </div>

        <div className="inputIcon">
          <FaUser />
          <input name="username" placeholder="Username" onChange={update} required />
        </div>

        <div className="inputIcon">
          <FaEnvelope />
          <input name="email" placeholder="Email" onChange={update} required />
        </div>

        <div className="inputIcon">
          <FaLock />
          <input name="password" type="password" placeholder="Password" onChange={update} required />
        </div>

        <div className="inputIcon">
          <FaLock />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={update} required />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primaryBtn">Signup</button>

        <button type="button" onClick={goLogin} className="linkBtn">
          Already have account? Login
        </button>

      </form>
    </div>
  );
}
