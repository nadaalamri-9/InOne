import { useState } from "react";
import PopupModal from "../../components/PopupModal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import fp from "../../assets/fp.svg";
import ms from "../../assets/ms.svg";
import "./ForgotPassword.css";

function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const maskEmail = (value) => {
    const [name, domain] = value.split("@");

    if (!name || !domain) return value;

    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-1);

    return `${visibleStart}***${visibleEnd}@${domain}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSent(true);
  };

  return (
    <PopupModal onClose={onClose}>
      {!sent ? (
        <>
          <div className="image">
            <img src={fp} alt="Forgot password illustration" />
          </div>

          <h2 className="fp-title">Forgot Password?</h2>

          <p className="fp-subtitle">
            No worries! Enter your email and we'll send you reset instructions.
          </p>

          <form className="fp-form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

            {error && <span className="error-text">{error}</span>}

            <Button variant="primary">Send Reset Link</Button>

            <button type="button" className="fp-back-btn" onClick={onClose}>
              Back to Log In
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="image">
            <span>
              <img src={ms} alt="Message sent illustration" />
            </span>
          </div>

          <h2 className="fp-title">Check Your Email</h2>

          <p className="fp-subtitle">
            We sent a reset link to: <strong>{maskEmail(email)}</strong>. Check
            your inbox and follow the instructions.
          </p>

          <div className="pf-btn">
            <Button variant="primary" onClick={onClose}>
              Back to Log In
            </Button>
          </div>

          <p className="fp-resend">
            Didn't receive the email?{" "}
            <button
              type="button"
              className="fp-resend-btn"
              onClick={() => setSent(false)}
            >
              Try again
            </button>
          </p>
        </>
      )}
    </PopupModal>
  );
}

export default ForgotPassword;