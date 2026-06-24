import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

function getRoleFromId(userId) {
  const prefix = userId.trim().charAt(0).toUpperCase();
  if (prefix === "S") return "student";
  if (prefix === "C") return "coach";
  if (prefix === "E") return "employer";
  if (prefix === "A") return "admin";
  return null;
}

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    userId: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    userId: "",
    email: "",
    password: "",
    terms: "",
    form: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  }

  async function handleSignup(e) {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const userId = formData.userId.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    const nextErrors = { fullName: "", userId: "", email: "", password: "", terms: "", form: "" };

    if (!fullName) nextErrors.fullName = "Full name is required.";
    if (!userId) nextErrors.userId = "ID is required.";
    if (!email) nextErrors.email = "Email address is required.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (!acceptedTerms) nextErrors.terms = "You must agree to the Terms and Privacy Policy.";

    const role = getRoleFromId(userId);
    if (userId && !role) {
      nextErrors.userId = "Invalid ID. Use S for Student, C for Coach, or E for Employer.";
    }

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setErrors(nextErrors);
      return;
    }

    // Split full name into first / last
    const parts = fullName.split(" ");
    const first_name = parts[0] || fullName;
    const last_name = parts.slice(1).join(" ") || "";

    setSubmitting(true);
    try {
      await register({
        first_name,
        last_name,
        email,
        password,
        role,
        user_id_string: userId,
      });

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email,
          message: "Account created successfully. Please log in to continue.",
        },
      });
    } catch (err) {
      const msg = err.message || "Registration failed.";
      if (msg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: msg }));
      } else if (msg.toLowerCase().includes("id")) {
        setErrors((prev) => ({ ...prev, userId: msg }));
      } else {
        setErrors((prev) => ({ ...prev, form: msg }));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <a href="/" className="auth-logo">
          <img src="/logo.svg" alt="InOne" />
        </a>
        <button className="auth-home-btn" type="button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Home
        </button>
      </div>

      <section className="auth-split">
        <div className="auth-copy">
          <span>WELCOME TO INONE</span>
          <h1>InOne</h1>
          <p>One portfolio. One link. Endless opportunities.</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="auth-tabs">
            <button type="button" onClick={() => navigate("/login")}>Log In</button>
            <button type="button" className="active">Sign Up</button>
          </div>

          {errors.form ? (
            <div className="auth-alert" role="alert">{errors.form}</div>
          ) : null}

          <div className="auth-grid-2">
            <label className={`auth-field ${errors.fullName ? "has-error" : ""}`}>
              <span>Full Name</span>
              <input
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}
            </label>

            <label className={`auth-field ${errors.userId ? "has-error" : ""}`}>
              <span>ID</span>
              <input
                name="userId"
                type="text"
                placeholder="S-2026-0001"
                value={formData.userId}
                onChange={handleChange}
              />
              {errors.userId ? <small className="field-error">{errors.userId}</small> : null}
            </label>
          </div>

          <label className={`auth-field ${errors.email ? "has-error" : ""}`}>
            <span>Email Address</span>
            <input
              name="email"
              type="email"
              placeholder="name@email.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email ? <small className="field-error">{errors.email}</small> : null}
          </label>

          <div className="password-wrap">
            <label className={`auth-field ${errors.password ? "has-error" : ""}`}>
              <span>Password</span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password ? <small className="field-error">{errors.password}</small> : null}
            </label>
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className={`check-line terms-line ${errors.terms ? "has-error" : ""}`}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked) setErrors((prev) => ({ ...prev, terms: "" }));
              }}
            />
            <span>
              I agree to the{" "}
              <button type="button" className="inline-legal-link" onClick={() => navigate("/terms")}>
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="inline-legal-link" onClick={() => navigate("/privacy")}>
                Privacy Policy
              </button>
              .
            </span>
          </label>

          {errors.terms ? <small className="field-error">{errors.terms}</small> : null}

          <Button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>
      </section>
    </main>
  );
}
