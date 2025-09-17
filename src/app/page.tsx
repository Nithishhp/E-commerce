import Hero from "@/components/Hero";
import FeaturedSaplings from "@/components/FeaturedSaplings";
import Benefits from "@/components/Benefits";
import BestSeller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedSaplings />
      <Benefits />
      <BestSeller />
      <Testimonials />
      <Footer />
    </div>
  );
}
