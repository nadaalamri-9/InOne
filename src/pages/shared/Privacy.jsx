import { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import Card from "../../components/Card";

import PP from "../../assets/PP.svg";

import "./Legal.css";

function Privacy() {
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
                InOne Privacy
              </span>

              <h1>
                Privacy Policy
              </h1>

              <p>
                Your privacy matters to us. This
                policy explains what information
                InOne collects, how we use it, and
                the choices you have.
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
                src={PP}
                alt="Privacy Policy"
              />
            </div>
          </div>
        </section>

        <section className="legal-body">
          <p className="legal-date">
            Last updated: June 2026
          </p>

          <div className="legal-sections">
            <Card className="legal-card">
              <h2>1. Information We Collect</h2>

              <ul>
                <li>
                  Account information: name,
                  email, password, and role.
                </li>

                <li>
                  Profile information: headline,
                  bio, location, target roles,
                  skills, social links,
                  education, and training
                  programs.
                </li>

                <li>
                  Uploaded files: your resume,
                  project screenshots, and other
                  media.
                </li>

                <li>
                  Project content: project
                  descriptions, tech stacks,
                  results, and links you add.
                </li>

                <li>
                  Usage information: basic data
                  such as portfolio views to help
                  you understand your reach.
                </li>
              </ul>
            </Card>

            <Card className="legal-card">
              <h2>2. How We Use Your Information</h2>

              <p>
                We use your information to create
                and display your portfolio,
                enable shareable links, support
                coach review and feedback,
                manage accounts, and improve the
                platform.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>3. How Your Information Is Shared</h2>

              <p>
                Your information is shared only
                with people you choose to share
                your portfolio with, assigned
                career coaches, and platform
                administrators.
              </p>

              <p>
                We do not sell your personal
                information and do not list your
                profile publicly unless you
                choose to make it public.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>4. Your Control Over Your Data</h2>

              <p>
                You can edit or delete your
                profile and projects at any
                time, control portfolio
                visibility, and deactivate
                shareable links.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>5. Data Storage and Security</h2>

              <p>
                Uploaded files and account data
                are stored securely. We
                encourage users to use strong
                passwords and share portfolio
                links responsibly.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>6. Changes to This Policy</h2>

              <p>
                We may update this policy
                periodically. Changes will be
                reflected by updating the last
                updated date.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Privacy;