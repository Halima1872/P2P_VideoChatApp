import { useState } from "react";
import axios from "axios";
import "./register.css";
const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
      });
      const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };
      const handleLogin = () => {
        window.location.href = "/login";
      }
        const handleClick = async (e) => {
            e.preventDefault();
            try{
            const res = await axios.post("api/auth/register", credentials);
            if(res){
                alert("Registration Successful! Please login to continue");
                window.location.href = "/login";
            }
            }catch(err){
                console.log(err);
            }
            
          }
      return (
    

        <div className="register">
          
          
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
                <label className="form-element" htmlFor="email">Email:</label>
                
                <input
              type="email"
              placeholder="Enter your email address "
              name="email"
              id="email"
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
                <button className="form-element" onClick={handleClick} type="submit">Register</button>
                </div>
                <div>
                <label  id="already" className="form-element " htmlFor="login">Already have an account?</label>
                <button className="loginbtn" onClick={handleLogin}  >Login</button>
                </div>
            
            </form>
            
          </div>
        
      );
    }
    export default Register;