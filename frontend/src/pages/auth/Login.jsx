import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const signupMessage = location.state?.registered ? location.state.message : "";
  const rememberedEmail = location.state?.email || localStorage.getItem("inoneRememberEmail") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("inoneRememberMe") === "true"
  );

  const [formData, setFormData] = useState({
    email: rememberedEmail,
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState(signupMessage);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
    resetEmail: "",
  });

  const [resetEmail, setResetEmail] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  }


  function handleRememberChange(e) {
    const checked = e.target.checked;
    setRememberMe(checked);
    localStorage.setItem("inoneRememberMe", checked ? "true" : "false");
    if (!checked) localStorage.removeItem("inoneRememberEmail");
  }

  async function handleLogin(e) {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    const nextErrors = { email: "", password: "", form: "", resetEmail: "" };
    if (!email) nextErrors.email = "Email address is required.";
    if (!password) nextErrors.password = "Password is required.";

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);

      if (rememberMe) {
        localStorage.setItem("inoneRememberEmail", email);
      } else {
        localStorage.removeItem("inoneRememberEmail");
      }

      navigate("/");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Invalid email or password.",
      }));
    } finally {
      setSubmitting(false);
    }
  }

  function openForgotModal() {
    setResetEmail(formData.email || "");
    setResetSent(false);
    setErrors((prev) => ({ ...prev, resetEmail: "" }));
    setShowForgotModal(true);
  }

  function closeForgotModal() {
    setShowForgotModal(false);
    setResetSent(false);
    setResetEmail("");
    setErrors((prev) => ({ ...prev, resetEmail: "" }));
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    const email = resetEmail.trim().toLowerCase();
    if (!email) {
      setErrors((prev) => ({ ...prev, resetEmail: "Email address is required." }));
      return;
    }
    try {
      await api.post("/auth/forgot-password", { email });
    } catch {
      // Always show success to avoid user enumeration
    }
    setResetSent(true);
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

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-tabs">
            <button type="button" className="active">Log In</button>
            <button type="button" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>

          {successMessage ? (
            <div className="auth-alert auth-alert-success" role="status">{successMessage}</div>
          ) : null}

          {errors.form ? (
            <div className="auth-alert" role="alert">{errors.form}</div>
          ) : null}

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
                placeholder="Enter your password"
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

          <div className="auth-row">
            <label className="check-line">
              <input type="checkbox" checked={rememberMe} onChange={handleRememberChange} />
              <span>Remember me</span>
            </label>
            <button className="text-link" type="button" onClick={openForgotModal}>
              Forgot password?
            </button>
          </div>

          <Button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Log In"}
          </Button>
        </form>
      </section>

      {showForgotModal && (
        <div className="auth-modal-overlay">
          <form className="auth-modal" onSubmit={handleForgotSubmit}>
            <button className="auth-modal-close" type="button" onClick={closeForgotModal} aria-label="Close">
              <X size={18} />
            </button>

            {!resetSent ? (
              <>
                <span>RESET PASSWORD</span>
                <h3>Forgot your password?</h3>
                <p>Enter your email address and we will send reset instructions.</p>
                <label className={`auth-field ${errors.resetEmail ? "has-error" : ""}`}>
                  <span>Email Address</span>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, resetEmail: "" }));
                    }}
                  />
                  {errors.resetEmail ? <small className="field-error">{errors.resetEmail}</small> : null}
                </label>
                <Button className="auth-submit" type="submit">Send Reset Link</Button>
              </>
            ) : (
              <>
                <span>EMAIL SENT</span>
                <h3>Check your email</h3>
                <p>We sent password reset instructions to your email. Please check your inbox.</p>
                <Button className="auth-submit" type="button" onClick={closeForgotModal}>Done</Button>
              </>
            )}
          </form>
        </div>
      )}
    </main>
  );
}
