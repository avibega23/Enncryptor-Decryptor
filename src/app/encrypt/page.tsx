import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CryptoWorkspace } from "@/components/crypto-workspace";

export default function EncryptPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-start justify-center px-4 py-12 sm:py-20">
        <CryptoWorkspace mode="encrypt" />
      </main>
      <Footer />
    </>
  );
}
