import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Instagram, MessageCircle, Menu, X } from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div>
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/98 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm top-0" : "bg-transparent py-5"}`} style={{ top: isScrolled ? "3px" : "35px" }}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => scrollTo("hero")}>Logo</div>
          <div className="hidden md:flex items-center gap-6">
            {["About", "Classes", "Pricing", "Team", "Gallery", "FAQ", "Location"].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className={`text-xs font-bold transition-colors uppercase tracking-widest ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-primary"}`}>
                {item}
              </button>
            ))}
            <a href="/guide" className={`text-xs font-bold transition-colors uppercase tracking-widest ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-primary"}`}>
              Guide
            </a>
            <Button onClick={() => scrollTo("contact")} className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-bold text-xs h-9 px-5 shadow-md shadow-primary/20">
              Free Trial
            </Button>
          </div>
          <button className={`md:hidden ${isScrolled ? "text-gray-900" : "text-white"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-primary font-black text-xs uppercase tracking-widest">New Member Roadmap</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              Fitness <span className="text-primary">Progression</span> Guide
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              A compact roadmap with one clear starting point and a single route to the full guide.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-[#f8fbf3] border border-gray-200 p-6 md:p-8 text-center">
            <div className="w-10 h-10 bg-primary mx-auto mb-4 flex items-center justify-center text-white font-black">1</div>
            <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-3 text-gray-900">Level 1 — Start Here</h3>
            <p className="text-gray-600 font-medium leading-relaxed mb-6">Use the full guide only when you need it; begin with the foundational full-body path and progress level by level.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="/guide" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-950 text-white font-black uppercase tracking-widest text-sm">
                Open Guide <ArrowRight className="w-4 h-4" />
              </a>
              <Button onClick={() => scrollTo("contact")} className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-bold text-xs h-12 px-6">
                Book Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-32 bg-[#f8fbf3]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              We Have <span className="text-primary">Answers.</span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
