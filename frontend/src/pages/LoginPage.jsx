import { useState } from "react";
import "./LoginPage.css"; // Ensure this file exists

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    onLogin(); // Ensure this function is passed as a prop
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
      <p className="toggle-text">
        Don't have an account?{" "}
        <button className="toggle-button" onClick={() => { }}>
          Register here
        </button>
      </p>
    </div>
  );
}
