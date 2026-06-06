import Navbar          from "../../components/Navbar";
import Footer          from "../../components/Footer";
import HeroSection     from "./sections/HeroSection";
import StatsSection    from "./sections/StatsSection";
import FeaturesSection from "./sections/FeaturesSection";
import WorkflowSection from "./sections/WorkflowSection";
import AudienceSection from "./sections/AudienceSection";
import FAQSection      from "./sections/FAQSection";
import CTASection      from "./sections/CTASection";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <WorkflowSection />
      <AudienceSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
export default Home;
