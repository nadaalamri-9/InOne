import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";

import CU from "../../assets/CU.svg";

import "./Legal.css";

function Contact() {
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
  };

  return (
    <>
      <Navbar />

      <main className="legal-page">
        <section className="legal-hero">
          <div className="legal-wrapper">
            <div className="legal-content">
              <span className="legal-kicker">Contact InOne</span>

              <h1>Get in Touch</h1>

              <p>
                Have a question, found an issue, or want to learn more about
                InOne? We'd love to hear from you.
              </p>

              <div className="legal-actions">
                <Link to="/">
                  <Button variant="primary">Back to InOne</Button>
                </Link>
              </div>
            </div>

            <div className="legal-image">
              <img src={CU} alt="Contact InOne" />
            </div>
          </div>
        </section>

        <section className="legal-body">
          <div className="contact-grid">

            <Card className="legal-card">
              <h2>General Contact</h2>

              <p>
                Have a question, found an issue, or want to learn more about
                InOne?
              </p>

              <p className="contact-email">inoneportfolio@gmail.com</p>
            </Card>

            <Card className="legal-card">
              <h2>For Students</h2>

              <p>
                Need help building your portfolio, uploading projects, or sharing
                your portfolio link with employers?
              </p>

              <p>Reach out and we'll guide you through the process.</p>
            </Card>

            <Card className="legal-card">
              <h2>For Employers</h2>

              <p>
                Looking to discover talented graduates, review portfolios, or
                connect with candidates?
              </p>

              <p>We'd be happy to help you explore student talent.</p>
            </Card>

            <Card className="legal-card">
              <h2>Partnerships</h2>

              <p>
                Interested in collaborating with InOne, supporting student
                talent, or building educational partnerships?
              </p>

              <p>Let's connect and explore opportunities together.</p>
            </Card>

            <Card className="legal-card contact-wide">
              <h2>Project Team</h2>

              <p>
                Built by{" "}
                <strong>Nada Alamri, Abeer Alsaidan, and Layan Almanaa</strong>
              </p>

              <p>
                In partnership with{" "}
                <strong>Saudi Digital Academy & WeCloudData</strong>
              </p>
            </Card>
            <Card className="legal-card contact-form-card contact-wide">
              <h2>Send Us a Message</h2>
              <p>
                Fill out the form below and the InOne team will get back to you
                soon.
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                  />
                </div>

                <Input
                  label="Subject"
                  type="text"
                  placeholder="What is this about?"
                />

                <div className="contact-field">
                  <label>Message</label>

                  <textarea placeholder="Write your message here"></textarea>
                </div>

                <Button variant="primary">Send Message</Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;