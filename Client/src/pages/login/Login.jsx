import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleRegister = () => {
    window.location.href = "/register";
  }

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("api/auth/login", credentials);
      console.log(res.data.username);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.username });
      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <form method="post">
        <div>
          <label className="form-element" htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Enter your username"
            name="username"
            id="username"
            onChange={handleChange}
            className="form-element"
            required
          />
        </div>
        <div>
          <label className="form-element" htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            id="password"
            onChange={handleChange}
            className="form-element"
            required
          />
        </div>
        <div>
          <button className="form-element" disabled={loading} onClick={handleClick} type="submit">Login</button>
        </div>
        <div>
          <label id="already" className="form-element " htmlFor="login">Dont have an account?</label>
          <button className="registerbtn" onClick={handleRegister} >Register</button>
        </div>
      </form>
      {error && <span>{error.message}</span>}
    </div>
  );
};

export default Login;