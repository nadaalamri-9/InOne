import {
  Mail,
  Building2,
  GraduationCap,
  Handshake,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "../../components/Footer";
import Button from "../../components/Button";
import Card from "../../components/Card";
import logo from "../../assets/logo.svg";
const contactCards = [
  {
    icon: GraduationCap,
    title: "For Students",
    text: "Need help building your portfolio, uploading projects, or sharing your portfolio link? We can guide you.",
  },
  {
    icon: Building2,
    title: "For Employers",
    text: "Looking to discover talented graduates or review portfolios? We would be happy to help.",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    text: "Interested in collaborating with InOne or supporting student talent? Let’s connect.",
  },
  {
    icon: Users,
    title: "Project Team",
    text: "Built by Nada Alamri, Abeer Alsaidan, and Layan Almanaa.",
  },
];

export default function Contact() {
  return (
    <>
      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link to="/" className="legal-logo">
            <img src={logo} alt="InOne" />
          </Link>
        </div>
      </header>

      <main className="legal-page">
        <section className="container">
          <div className="legal-hero">
            <div className="legal-hero-content">
              <p className="legal-kicker">Contact InOne</p>

              <h1>Get in Touch</h1>

              <p>
                Have a question, found an issue, or want to learn more about
                InOne? We would love to hear from you.
              </p>

              <Link to="/" className="back-home">
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>

            <div className="legal-visual">
              <div className="legal-orb" />

              <div className="visual-card contact-visual-card">
                <div className="visual-icon">
                  <Mail size={38} />
                </div>

                <h3>Get In Touch</h3>
                <span>inoneportfolio@gmail.com</span>

                <div className="floating-badge badge-top">
                  <Users size={18} />
                  Students
                </div>

                <div className="floating-badge badge-bottom">
                  <Building2 size={18} />
                  Employers
                </div>
              </div>
            </div>
          </div>

          <Card padding="lg" className="contact-highlight">
            <div className="contact-icon">
              <Mail size={22} />
            </div>

            <div>
              <h3>General Contact</h3>
              <a href="mailto:inoneportfolio@gmail.com">
                inoneportfolio@gmail.com
              </a>
            </div>
          </Card>

          <div className="contact-grid">
            <div className="contact-cards">
              {contactCards.map(({ icon: Icon, title, text }) => (
                <Card hover className="contact-card" key={title}>
                  <div className="contact-icon">
                    <Icon size={20} />
                  </div>

                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>

            <Card padding="lg" className="contact-form-card">
              <form
                className="contact-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <h2>Send Us a Message</h2>

                <p>
                  Fill out the form and the InOne team will get back to you.
                </p>

                <label className="form-field">
                  <span>Full Name</span>
                  <input placeholder="Enter your full name" />
                </label>

                <label className="form-field">
                  <span>Email Address</span>
                  <input type="email" placeholder="Enter your email" />
                </label>

                <label className="form-field">
                  <span>Subject</span>
                  <input placeholder="What is this about?" />
                </label>

                <label className="form-field">
                  <span>Message</span>
                  <textarea placeholder="Write your message" />
                </label>

                <Button type="submit">Send Message</Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}