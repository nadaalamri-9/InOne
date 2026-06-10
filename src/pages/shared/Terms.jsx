import { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import Card from "../../components/Card";

import TC from "../../assets/TC.svg";

import "./Legal.css";

function Terms() {
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
                InOne Legal
              </span>

              <h1>
                Terms of Service
              </h1>

              <p>
                Welcome to InOne. By creating an
                account or using our platform,
                you agree to these Terms. Please
                read them carefully.
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
                src={TC}
                alt="Terms of Service"
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
              <h2>1. About InOne</h2>

              <p>
                InOne is a student portfolio
                showcase platform that allows
                WeCloudData graduates to build a
                professional portfolio, present
                projects, and share one portfolio
                link with employers, recruiters,
                and career coaches.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>2. Accounts and Roles</h2>

              <p>
                You may use InOne as a Student,
                Employer, Career Coach, or Admin.
                You are responsible for keeping
                your login credentials secure and
                for all activity under your
                account.
              </p>

              <p>
                You must provide accurate
                information and keep it updated.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>3. Your Content</h2>

              <p>
                You keep ownership of everything
                you upload, including your
                profile, resume, project
                descriptions, and images.
              </p>

              <p>
                By posting content, you grant
                InOne permission to display it
                within the platform so it can be
                viewed by people you choose to
                share it with.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>4. Acceptable Use</h2>

              <p>
                You agree not to upload unlawful,
                misleading, or offensive content,
                impersonate others, misuse the
                platform, or access accounts that
                are not yours.
              </p>

              <p>
                We may suspend or remove accounts
                that violate these rules.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>5. Sharing and Visibility</h2>

              <p>
                Portfolios are private by default.
                When you generate a shareable
                link, anyone with that link may
                view the portfolio according to
                the visibility settings you
                choose.
              </p>

              <p>
                You can deactivate a link at any
                time.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>6. Career Coach Feedback</h2>

              <p>
                Career coaches may review your
                portfolio and leave feedback to
                help you improve.
              </p>

              <p>
                Feedback is intended as guidance
                and does not guarantee any outcome
                with employers.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>7. Availability</h2>

              <p>
                InOne is provided as available. We
                work to keep the platform running
                smoothly but cannot guarantee
                uninterrupted or error-free
                service.
              </p>
            </Card>

            <Card className="legal-card">
              <h2>8. Changes to These Terms</h2>

              <p>
                We may update these Terms from
                time to time. Continued use of
                InOne means you accept any updated
                version.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Terms;