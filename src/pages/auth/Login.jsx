import { useState } from "react";
import "./Login.css";
import Button   from "../../components/Button";
import Authtabs from "../../components/Authtabs";
import logo        from "../../assets/logo.svg";
import User        from "../../assets/User.svg";
import Folder      from "../../assets/Folder.svg";
import LinkIcon    from "../../assets/Link.svg";
import CheckCircle from "../../assets/CheckCircle.svg";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);

  const features = [
    { icon: User,        label: "Professional Portfolio"  },
    { icon: Folder,      label: "Structured Projects"     },
    { icon: LinkIcon,    label: "Shareable Link"          },
    { icon: CheckCircle, label: "Coach Review & Feedback" },
  ];

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="login-logo">
          <img src={logo} alt="InOne" />
        </div>

        <div className="login-tagline">
          <h1>
            Build.
            Showcase.<br />
            Get Hired.
          </h1>
          <p>
            Join WeCloudData graduates who are showcasing
            their projects and landing jobs with one
            professional portfolio link.
          </p>
        </div>

        <div className="login-features">
          {features.map(f => (
            <div className="login-feature-item" key={f.label}>
              <div className="login-feature-icon">
                <img src={f.icon} alt={f.label} />
              </div>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>


      <div className="login-right">

        <Authtabs />

        <h2 className="login-form-title">Continue Your Journey..</h2>
          <br />
        <form className="login-form" onSubmit={e => e.preventDefault()}>

          <div>
            <label>Email Address</label>
            <input type="email" placeholder="Email" />
          </div>

          <div>
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <Button variant="primary">Log In</Button>

        </form>
      </div>
    </div>
  );
}

export default Login;
