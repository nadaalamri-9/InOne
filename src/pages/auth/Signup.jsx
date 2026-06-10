import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import "./Signup.css";
import Button from "../../components/Button";
import Authtabs from "../../components/Authtabs";
import logo from "../../assets/logo.svg";
import User from "../../assets/User.svg";
import Folder from "../../assets/Folder.svg";
import LinkIcon from "../../assets/Link.svg";
import CheckCircle from "../../assets/CheckCircle.svg";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Student");
  const [agree, setAgree] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const features = [
    { icon: User, label: "Professional Portfolio" },
    { icon: Folder, label: "Structured Projects" },
    { icon: LinkIcon, label: "Shareable Link" },
    { icon: CheckCircle, label: "Coach Review & Feedback" },
  ];

  const roles = ["Student", "Career Coach", "Employer"];

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) return { label: "", className: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", className: "weak" };
    if (score <= 3) return { label: "Medium", className: "medium" };
    return { label: "Strong", className: "strong" };
  };

  const passwordStrength = getPasswordStrength();

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!agree) {
      newErrors.agree = "You must agree before creating an account.";
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

  const handleSignup = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (role === "Student") navigate("/student/dashboard");
    else if (role === "Career Coach") navigate("/coach/dashboard");
    else if (role === "Employer") navigate("/employer/dashboard");
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
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">You're creating an account as</p>

          <div className="role-selector">
            {roles.map((r) => (
              <label
                key={r}
                className={`role-option ${role === r ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                />
                {r}
              </label>
            ))}
          </div>

          <form className="signup-form" onSubmit={handleSignup} noValidate>
            <div className="signup-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className={errors.fullName ? "input-error" : ""}
              />

              {errors.fullName && (
                <span className="signup-error">{errors.fullName}</span>
              )}
            </div>

            <div className="signup-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />

              {errors.email && (
                <span className="signup-error">{errors.email}</span>
              )}
            </div>

            <div className="signup-form-group">
              <label>Password</label>

              <div
                className={`signup-password-field ${
                  errors.password ? "input-error" : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create your password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {form.password && (
                <div className="password-strength">
                  <div className={`strength-bar ${passwordStrength.className}`} />
                  <span className={passwordStrength.className}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}

              {errors.password && (
                <span className="signup-error">{errors.password}</span>
              )}
            </div>

            <label className="terms-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => {
                  setAgree(!agree);
                  setErrors((prev) => ({
                    ...prev,
                    agree: "",
                  }));
                }}
              />

              <span>
                By signing up, you agree to our{" "}
                <Link to="/terms" className="terms-link">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>.
              </span>

            </label>

            {errors.agree && (
              <span className="signup-error">{errors.agree}</span>
            )}

            <Button variant="primary">Sign Up</Button>

            <p className="signup-login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;