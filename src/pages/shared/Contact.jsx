import { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import Card from "../../components/Card";

import CU from "../../assets/CU.svg";

import "./Legal.css";

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <main className="legal-page">
        <section className="legal-hero">
          <div className="legal-wrapper">
            <div className="legal-content">
              <span className="legal-kicker">
                Contact InOne
              </span>

              <h1>
                Get in Touch
              </h1>

              <p>
                Have a question, found an issue,
                or want to learn more about
                InOne? We'd love to hear from
                you.
              </p>

              <div className="legal-actions">
                <Link to="/">
                  <Button variant="primary">
                    Back to InOne
                  </Button>
                </Link>
              </div>
            </div>

            <div className="legal-image">
              <img
                src={CU}
                alt="Contact InOne"
              />
            </div>
          </div>
        </section>

        <section className="legal-body">
          <div className="contact-grid">
            <Card className="legal-card">
              <h2>General Contact</h2>

              <p>
                Have a question, found an issue,
                or want to learn more about
                InOne?
              </p>

              <p className="contact-email">
                support@inoneportfolio.com
              </p>
            </Card>

            <Card className="legal-card">
              <h2>For Students</h2>

              <p>
                Need help building your portfolio,
                uploading projects, or sharing
                your portfolio link with
                employers?
              </p>

              <p>
                Reach out and we'll guide you
                through the process.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>For Employers</h2>

              <p>
                Looking to discover talented
                graduates, review portfolios, or
                connect with candidates?
              </p>

              <p>
                We'd be happy to help you explore
                student talent.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>Partnerships</h2>

              <p>
                Interested in collaborating with
                InOne, supporting student talent,
                or building educational
                partnerships?
              </p>

              <p>
                Let's connect and explore
                opportunities together.
              </p>
            </Card>

            <Card className="legal-card contact-wide">
              <h2>Project Team</h2>

              <p>
                Built by{" "}
                <strong>
                  Nada Alamri, Abeer Alsaidan,
                  and Layan Almanaa
                </strong>
              </p>

              <p>
                In partnership with{" "}
                <strong>
                  Saudi Digital Academy &
                  WeCloudData
                </strong>
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;