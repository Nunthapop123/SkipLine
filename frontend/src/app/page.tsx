import Image from "next/image";
import Hero from "../../components/landing/Hero";
import Categories from "../../components/landing/Categories";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <main>
        <Hero />
        <Categories />
      </main>
    </div>
  );
}
