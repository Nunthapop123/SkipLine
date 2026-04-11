import Image from "next/image";
import Hero from "../../components/landing/Hero";
import Categories from "../../components/landing/Categories";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      <main>
        <Hero />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
