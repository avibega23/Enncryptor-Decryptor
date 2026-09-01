import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SecuritySection } from "@/components/security-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SecuritySection />
      </main>
      <Footer />
    </>
  );
}
