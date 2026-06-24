import { useEffect } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import Hero from "./Sections/Hero";
import Brands from "./Sections/Brands";
import Stats from "./Sections/Stats";
import ExplorePortfolios from "./Sections/ExplorePortfolios";
import HowItWorks from "./Sections/HowItWorks";
import FAQ from "./Sections/FAQ";
import CTA from "./Sections/CTA";

export default function HomePage() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <div className="reveal">
        <Brands />
      </div>

      <div className="reveal">
        <Stats />
      </div>

      <div className="reveal">
        <ExplorePortfolios />
      </div>

      <div className="reveal">
        <HowItWorks />
      </div>

      <div className="reveal">
        <FAQ />
      </div>

      <div className="reveal">
        <CTA />
      </div>

      <Footer />
    </>
  );
}