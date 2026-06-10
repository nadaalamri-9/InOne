import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import "./Login.css";
import Button from "../../components/Button";
import Authtabs from "../../components/Authtabs";
import ForgotPassword from "./ForgotPassword";
import logo from "../../assets/logo.svg";
import User from "../../assets/User.svg";
import Folder from "../../assets/Folder.svg";
import LinkIcon from "../../assets/Link.svg";
import CheckCircle from "../../assets/CheckCircle.svg";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const features = [
    { icon: User, label: "Professional Portfolio" },
    { icon: Folder, label: "Structured Projects" },
    { icon: LinkIcon, label: "Shareable Link" },
    { icon: CheckCircle, label: "Coach Review & Feedback" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Login submitted", form);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="InOne" />
        </Link>

        <div className="auth-tagline">
          <h1>
            Build. Showcase.
            <br />
            Get Hired.
          </h1>

          <p>
            Join WeCloudData graduates who are showcasing their projects and
            landing jobs with one professional portfolio link.
          </p>
        </div>

        <div className="auth-features">
          {features.map((f) => (
            <div className="auth-feature-item" key={f.label}>
              <div className="auth-feature-icon">
                <img src={f.icon} alt={f.label} />
              </div>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <Authtabs />
          <br />
          <h2 className="login-title">Welcome Back</h2>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="login-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />

              {errors.email && (
                <span className="login-error">{errors.email}</span>
              )}
            </div>

            <div className="login-form-group">
              <label>Password</label>

              <div
                className={`login-password-field ${
                  errors.password ? "input-error" : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {errors.password && (
                <span className="login-error">{errors.password}</span>
              )}
            </div>

            <div className="login-meta">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            </div>

            <Button variant="primary">Log In</Button>

            <p className="login-signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}
    </div>
  );
}

export default Login;