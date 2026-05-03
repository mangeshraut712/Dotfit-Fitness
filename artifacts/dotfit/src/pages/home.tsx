import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  MapPin, Phone, Mail, Instagram, Facebook, Clock, Check, Menu, X,
  ArrowRight, Star, MessageCircle, Linkedin, ChevronDown, Shield,
  Users, Trophy, Activity, Zap, HeartPulse, Timer, Dumbbell,
  ExternalLink, Flame, Wind, Brain, Apple, CalendarCheck, ChevronRight,
  Target, Sparkles, BookOpen, BarChart2, Heart, Bike, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

/* ─── Animated count-up hook ────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const step = target / (duration / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 16);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ─── FAQ accordion ─────────────────────────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="border border-gray-200 overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-display font-bold uppercase tracking-wider text-gray-900 hover:text-primary transition-colors">
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : "text-gray-400"}`} />
      </button>
      <div ref={ref} style={{ maxHeight: open ? `${ref.current?.scrollHeight ?? 400}px` : "0px", transition: "max-height 0.35s ease", overflow: "hidden" }}>
        <div className="px-6 pb-5 text-gray-600 font-medium text-sm leading-relaxed border-t border-gray-100 pt-4">{answer}</div>
      </div>
    </div>
  );
}

/* ─── Staff card ─────────────────────────────────────────────────────────── */
function StaffCard({ name, role, img, cert }: { name: string; role: string; img: string; cert?: string }) {
  return (
    <div className="group text-center">
      <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-gray-100 border-2 border-gray-100 group-hover:border-primary transition-colors duration-300">
        <img src={img} alt={name} loading="lazy" decoding="async" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {cert && <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"><span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-1">{cert}</span></div>}
      </div>
      <h4 className="text-base font-display font-black uppercase tracking-wider text-gray-900">{name}</h4>
      <p className="text-primary text-xs uppercase tracking-widest font-bold mt-0.5">{role}</p>
    </div>
  );
}

/* ─── Stat box with count-up ─────────────────────────────────────────────── */
function StatBox({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: React.ReactNode }) {
  const { count, ref } = useCountUp(value);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-center p-8 bg-white border-2 border-gray-100 hover:border-primary/30 transition-colors">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-4xl md:text-5xl font-display font-black text-gray-900 mb-1 tracking-tight">{count}{suffix}</div>
      <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{label}</div>
    </motion.div>
  );
}

/* ─── BMI Calculator ─────────────────────────────────────────────────────── */
function BmiCalculator({ onBook }: { onBook: (plan: string) => void }) {
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(heightCm) / 100;
    if (w > 0 && h > 0) setBmi(parseFloat((w / (h * h)).toFixed(1)));
  };

  const category = bmi
    ? bmi < 18.5 ? { label: "Underweight", color: "text-blue-500", plan: "3 Months", tip: "Focus on strength training + nutrition for healthy weight gain." }
    : bmi < 25 ? { label: "Normal Weight", color: "text-primary", plan: "1 Year", tip: "Maintain your fitness with group classes + toning sessions." }
    : bmi < 30 ? { label: "Overweight", color: "text-amber-500", plan: "6 Months", tip: "Combine cardio, HIIT circuits, and a calorie-managed meal plan." }
    : { label: "Obese", color: "text-red-500", plan: "1 Year", tip: "Medically supervised fat-loss program with dedicated personal trainer." }
    : null;

  return (
    <div className="bg-white border-2 border-gray-100 p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-primary font-black text-xs uppercase tracking-widest">Free Tool</span>
          <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter text-gray-900 mt-2 mb-3">
            Check Your <span className="text-primary">BMI</span>
          </h3>
          <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
            Calculate your Body Mass Index instantly and get a personalised Dotfit program recommendation.
          </p>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 block">Weight (kg)</label>
              <input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="e.g. 75"
                className="w-full h-12 border-2 border-gray-200 focus:border-primary outline-none px-4 text-gray-900 font-bold text-sm transition-colors" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 block">Height (cm)</label>
              <input value={heightCm} onChange={e => setHeightCm(e.target.value)} type="number" placeholder="e.g. 170"
                className="w-full h-12 border-2 border-gray-200 focus:border-primary outline-none px-4 text-gray-900 font-bold text-sm transition-colors" />
            </div>
          </div>
          <button onClick={calculate}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm transition-colors">
            Calculate My BMI
          </button>
        </div>

        <div>
          {!bmi ? (
            <div className="border-2 border-dashed border-gray-200 p-10 text-center">
              <BarChart2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium text-sm">Your BMI result will appear here</p>
              <div className="mt-6 space-y-2">
                {[["< 18.5", "Underweight"], ["18.5 – 24.9", "Normal"], ["25 – 29.9", "Overweight"], ["≥ 30", "Obese"]].map(([r, l]) => (
                  <div key={l} className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>{r}</span><span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border-2 border-primary/30 bg-[#f8fbf3] p-8">
              <div className="text-6xl font-display font-black mb-1 text-gray-900">{bmi}</div>
              <div className={`text-xl font-display font-black uppercase tracking-wider mb-4 ${category?.color}`}>{category?.label}</div>
              <p className="text-gray-600 font-medium text-sm mb-6 leading-relaxed">{category?.tip}</p>
              <div className="bg-white border border-primary/20 p-4 mb-5">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Recommended Plan</div>
                <div className="text-lg font-display font-black text-gray-900">{category?.plan} Membership</div>
              </div>
              <button onClick={() => onBook(category?.plan ?? "")}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors">
                Book Free Trial <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Offer Popup ────────────────────────────────────────────────────────── */
function OfferPopup({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-white max-w-sm w-full">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="bg-primary px-8 py-7 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" /> Special Offer
          </div>
          <h3 className="text-3xl font-display font-black uppercase tracking-tighter text-white leading-tight">
            Your First<br />Session Is Free
          </h3>
        </div>
        <div className="p-8">
          <p className="text-gray-500 font-medium text-sm leading-relaxed mb-5">
            Walk in, meet our K11-certified trainers, and experience the full 5th-floor facility — completely free. No payment, no commitment.
          </p>
          <div className="bg-[#f8fbf3] border-2 border-primary/20 p-4 mb-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Happy Hours Annual</div>
              <div className="text-3xl font-display font-black text-gray-900">₹10,000</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-through mb-0.5">₹12,000</div>
              <div className="text-xs font-black text-green-600 uppercase tracking-widest">Save ₹2,000</div>
            </div>
          </div>
          <button onClick={onBook}
            className="w-full h-13 py-4 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm mb-3 transition-colors flex items-center justify-center gap-2">
            Book My Free Trial <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="w-full text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors py-1">
            No thanks
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Happy Hours countdown ──────────────────────────────────────────────── */
function getIST() {
  const ist = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(ist);
}

function useHappyHoursLabel() {
  const compute = () => {
    const d = getIST();
    const day = d.getDay();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const totalSec = h * 3600 + m * 60 + s;
    const startSec = 12 * 3600;
    const endSec = 17 * 3600;
    if (day === 0) return "🔥 Happy Hours Mon–Sat 12PM–5PM · Annual ₹10,000";
    if (totalSec >= startSec && totalSec < endSec) {
      const rem = endSec - totalSec;
      const rh = Math.floor(rem / 3600);
      const rm = Math.floor((rem % 3600) / 60);
      const rs = rem % 60;
      return `🟢 HAPPY HOURS LIVE — ${rh > 0 ? rh + "h " : ""}${String(rm).padStart(2, "0")}m ${String(rs).padStart(2, "0")}s remaining · Annual ₹10,000`;
    } else if (totalSec < startSec) {
      const rem = startSec - totalSec;
      const rh = Math.floor(rem / 3600);
      const rm2 = Math.floor((rem % 3600) / 60);
      return `⏰ Happy Hours starts in ${rh}h ${String(rm2).padStart(2, "0")}m · Annual ₹10,000`;
    }
    return "🔥 Happy Hours: 12 PM – 5 PM Daily · Annual Membership ₹10,000";
  };
  const [label, setLabel] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setLabel(compute()), 1000);
    return () => clearInterval(id);
  }, []);
  return label;
}

/* ─── Schema ─────────────────────────────────────────────────────────────── */
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  plan: z.string().min(1, "Please select a plan"),
  message: z.string().optional(),
});

/* ─── SCHEDULE data ──────────────────────────────────────────────────────── */
const schedule = [
  { time: "6:00 – 8:00 AM", mon: "Strength", tue: "Power Yoga", wed: "Kickboxing", thu: "Zumba", fri: "Circuit", sat: "Open Gym" },
  { time: "8:00 AM – 12:00 PM", mon: "Open Gym", tue: "Open Gym", wed: "Open Gym", thu: "Open Gym", fri: "Open Gym", sat: "Open Gym" },
  { time: "12:00 – 2:00 PM", mon: "Rest / Closed", tue: "Rest / Closed", wed: "Rest / Closed", thu: "Rest / Closed", fri: "Rest / Closed", sat: "Rest / Closed" },
  { time: "2:00 – 4:00 PM", mon: "Trainer Workout", tue: "Trainer Workout", wed: "Trainer Workout", thu: "Trainer Workout", fri: "Trainer Workout", sat: "Trainer Workout" },
  { time: "4:00 – 6:00 PM", mon: "Happy Hours", tue: "Happy Hours", wed: "Happy Hours", thu: "Happy Hours", fri: "Happy Hours", sat: "Happy Hours" },
  { time: "6:00 – 10:00 PM", mon: "Zumba / Gym", tue: "Kickboxing / Gym", wed: "Yoga / Gym", thu: "Bollywood / Gym", fri: "Strength / Gym", sat: "Open Gym" },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [formDone, setFormDone] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedPlan, setSubmittedPlan] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const happyHoursLabel = useHappyHoursLabel();

  useEffect(() => {
    if (sessionStorage.getItem("df_popup")) return;
    const t = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("df_popup", "1");
    }, 20000);
    return () => clearTimeout(t);
  }, []);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);

  useEffect(() => {
    const fn = () => {
      setIsScrolled(window.scrollY > 60);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", plan: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setSubmittedName(values.name.split(" ")[0]);
        setSubmittedPlan(values.plan);
        setFormDone(true);
        form.reset();
      } else throw new Error();
    } catch {
      toast({ title: "Submission failed", description: "Please call +91 95272 37213 directly.", variant: "destructive" });
    }
  }

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const bookPlan = (plan: string) => {
    form.setValue("plan", plan);
    scrollTo("contact");
  };

  /* ─── RENDER ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden selection:bg-primary selection:text-white">

      {/* ── Offer popup ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPopup && (
          <OfferPopup
            onClose={() => setShowPopup(false)}
            onBook={() => { setShowPopup(false); scrollTo("contact"); }}
          />
        )}
      </AnimatePresence>

      {/* ── Scroll progress bar ────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 z-[70] h-[3px] bg-primary transition-all duration-75 shadow-[0_0_8px_rgba(125,181,32,0.8)]"
        style={{ width: `${scrollPct}%` }} />

      {/* ── Promo announcement bar ─────────────────────────────────────── */}
      <div className={`text-white text-center py-2 px-4 text-xs font-black uppercase tracking-widest z-[60] relative transition-colors duration-700 ${happyHoursLabel.startsWith("🟢") ? "bg-green-600" : "bg-primary"}`} style={{ marginTop: "3px" }}>
        {happyHoursLabel} &nbsp;|&nbsp;
        <button onClick={() => scrollTo("contact")} className="underline underline-offset-2 hover:no-underline">Book Free Trial →</button>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/98 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm top-0" : "bg-transparent py-5"}`}
        style={{ top: isScrolled ? "3px" : "35px" }}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => scrollTo("hero")}>
            <img src="/logo-text.png" alt="Dotfit Fitness" className={`h-10 w-auto object-contain transition-all ${isScrolled ? "brightness-100" : "brightness-0 invert"}`} />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["About", "Classes", "Pricing", "Team", "Gallery", "FAQ", "Location"].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())}
                className={`text-xs font-bold transition-colors uppercase tracking-widest ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-primary"}`}>
                {item}
              </button>
            ))}
            <a href="/guide"
              className={`text-xs font-bold transition-colors uppercase tracking-widest ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-primary"}`}>
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

      {/* ── Mobile full-screen menu ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-6 md:hidden">
            <img src="/logo-text.png" alt="Dotfit" className="h-12 mb-2" />
            {["About", "Classes", "Pricing", "Facilities", "Team", "Gallery", "FAQ", "Location", "Contact"].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())}
                className="text-2xl font-display font-black text-gray-900 hover:text-primary transition-colors uppercase tracking-widest">
                {item}
              </button>
            ))}
            <div className="flex gap-4 mt-4">
              {[
                { href: "https://www.instagram.com/dotfitfitness/", icon: <Instagram className="w-6 h-6" /> },
                { href: "https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session.", icon: <MessageCircle className="w-6 h-6" /> },
                { href: "https://www.facebook.com/DotfitFitness/", icon: <Facebook className="w-6 h-6" /> },
                { href: "https://www.linkedin.com/company/dotfit-fitness/", icon: <Linkedin className="w-6 h-6" /> },
              ].map((s, i) => <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">{s.icon}</a>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop floating buttons ───────────────────────────────────── */}
      <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Dotfit Fitness"
        className="fixed bottom-20 right-5 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full hidden md:flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform">
        <MessageCircle className="w-7 h-7" />
      </a>
      <a href="tel:+919527237213"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-primary text-white rounded-full hidden md:flex items-center justify-center shadow-[0_4px_20px_rgba(125,181,32,0.4)] hover:scale-110 transition-transform">
        <Phone className="w-6 h-6" />
      </a>

      {/* ── Scroll to top ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {scrollPct > 8 && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="fixed bottom-40 right-5 z-50 w-11 h-11 bg-gray-900 text-white hidden md:flex items-center justify-center shadow-xl hover:bg-primary transition-colors">
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Desktop floating "Book Trial" left side tab ─────────────────── */}
      <button onClick={() => scrollTo("contact")}
        className="fixed left-0 top-1/2 z-50 hidden lg:flex items-center gap-2 bg-primary text-white font-black uppercase tracking-widest text-[11px] px-3 py-4 shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors"
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}>
        <CalendarCheck className="w-4 h-4 shrink-0" />
        Book Free Trial
      </button>

      {/* ── Mobile sticky bottom bar ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-gray-200 shadow-2xl">
        <a href="tel:+919527237213" className="flex-1 h-14 bg-gray-900 text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs">
          <Phone className="w-4 h-4 text-primary" /> Call Now
        </a>
        <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer"
          className="flex-1 h-14 bg-[#25D366] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <button onClick={() => scrollTo("contact")}
          className="flex-1 h-14 bg-primary text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs">
          <CalendarCheck className="w-4 h-4" /> Book Trial
        </button>
      </div>

      {/* ════════════════════════════ HERO ══════════════════════════════ */}
      <section id="hero" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-gray-950">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <img src="/hero.png" alt="Dotfit Fitness Gym Floor" fetchPriority="high" decoding="async" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 to-transparent" />
        </motion.div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-primary/40 bg-primary/10 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-black tracking-widest uppercase text-white">K11 Certified · Est. 2012 · Baner, Pune</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[108px] font-display font-black leading-[0.88] tracking-tighter mb-5 uppercase text-white">
              Raw Power.<br />
              <span className="text-primary">Precision.</span><br />
              Results.
            </h1>
            <p className="text-xl md:text-2xl font-display font-black text-white/90 mb-3 tracking-wide uppercase">
              Baner's Most Trusted Gym Since 2012
            </p>
            <p className="text-base text-white/60 mb-10 max-w-xl font-medium leading-relaxed">
              Join 25,000+ members who chose excellence. Expert coaches, premium equipment, and real transformations — 5th floor, fully air-conditioned.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pb-20 md:pb-0">
              <Button onClick={() => scrollTo("contact")} size="lg"
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-none text-sm uppercase tracking-widest font-black group shadow-xl shadow-primary/30">
                Book Free Trial <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => scrollTo("pricing")} size="lg" variant="outline"
                className="h-14 px-10 border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-white rounded-none text-sm uppercase tracking-widest font-bold">
                View Plans
              </Button>
              <a href="tel:+919527237213"
                className="h-14 px-8 border border-white/20 bg-transparent hover:bg-white/5 text-white rounded-none text-sm uppercase tracking-widest font-bold flex items-center gap-2 justify-center transition-colors">
                <Phone className="w-4 h-4 text-primary" /> +91 95272 37213
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer hidden md:flex"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} onClick={() => scrollTo("trust")}>
          <span className="text-white/30 text-xs uppercase tracking-widest font-bold">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ════════════════════════ TRUST STRIP ═══════════════════════════ */}
      <div id="trust" className="bg-white border-b border-gray-100 py-5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14">
            {[
              { icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />, label: "4.2/5 Google Rating", sub: "726+ Reviews" },
              { icon: <Shield className="w-5 h-5 text-primary" />, label: "K11 Certified Facility", sub: "International Standard" },
              { icon: <Users className="w-5 h-5 text-primary" />, label: "25,000+ Members", sub: "Since 2012" },
              { icon: <Check className="w-5 h-5 text-green-600" />, label: "JustDial Verified", sub: "Trusted Business" },
              { icon: <Trophy className="w-5 h-5 text-primary" />, label: "1:4 Trainer Ratio", sub: "Unmatched Attention" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                {t.icon}
                <div>
                  <div className="text-sm font-black text-gray-900 leading-none">{t.label}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════ ABOUT / OUR STORY ═════════════════════════ */}
      <section id="about" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-black text-xs uppercase tracking-widest">Est. 2012 · Baner, Pune</span>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-6 text-gray-900">
                Our <span className="text-primary">Story</span>
              </h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-5">
                Dotfit Fitness was founded in 2012 with a single vision: make world-class fitness accessible to every person in Baner, Pune. Starting from a modest setup, we invested aggressively in equipment, trainer certification, and member experience.
              </p>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                Today, from our 5th-floor facility at Srushti Elegance, we serve 25,000+ members — backed by a K11 Certified team, a strict 1:4 trainer-to-member ratio, and a relentless focus on delivering real, measurable results.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Target className="w-5 h-5 text-primary" />, label: "Mission", text: "Results for every member, every day" },
                  { icon: <Sparkles className="w-5 h-5 text-primary" />, label: "Vision", text: "Pune's most trusted fitness brand" },
                  { icon: <Shield className="w-5 h-5 text-primary" />, label: "Certified", text: "K11 International Standard" },
                  { icon: <Heart className="w-5 h-5 text-primary" />, label: "Community", text: "25,000+ happy members" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3 p-4 bg-[#f8fbf3] border border-gray-100">
                    {item.icon}
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-gray-500">{item.label}</div>
                      <div className="text-sm font-bold text-gray-800 mt-0.5">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone timeline */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8">Our Journey</h3>
              <div className="relative pl-8 border-l-2 border-gray-100 space-y-0">
                {[
                  { year: "2012", event: "Founded in Baner", detail: "Dotfit Fitness opens its doors with a vision to transform Pune's fitness culture." },
                  { year: "2014", event: "Full 5th Floor Expansion", detail: "Doubled facility size — dedicated zones for weights, cardio, and group classes." },
                  { year: "2016", event: "K11 Certification Achieved", detail: "Became one of Pune's first K11 certified gyms — international training standards." },
                  { year: "2018", event: "10,000 Member Milestone", detail: "Hit 10,000 members and launched our dedicated nutrition counseling program." },
                  { year: "2020", event: "Recovery Zone Launch", detail: "Added professional sauna, steam room, and post-workout recovery facilities." },
                  { year: "2022", event: "25,000 Members Strong", detail: "Expanded personal training programs and launched Bollywood Beats classes." },
                  { year: "2026", event: "25,000+ Members Today", detail: "Baner's #1 gym — still growing, still delivering real results every day." },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="relative pb-7 last:pb-0">
                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-white" />
                    <div className="text-xs font-black text-primary uppercase tracking-widest mb-0.5">{m.year}</div>
                    <div className="text-base font-black text-gray-900">{m.event}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">{m.detail}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ STATS ─ animated ══════════════════════ */}
      <section className="py-20 bg-[#f8fbf3]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox value={25000} suffix="+" label="Happy Members" icon={<Users className="w-7 h-7 text-primary mx-auto" />} />
            <StatBox value={13} suffix="+" label="Years Running" icon={<Trophy className="w-7 h-7 text-primary mx-auto" />} />
            <StatBox value={4} suffix=":1" label="Member Trainer Ratio" icon={<Activity className="w-7 h-7 text-primary mx-auto" />} />
            <StatBox value={726} suffix="+" label="Google Reviews" icon={<Star className="w-7 h-7 text-amber-400 mx-auto" />} />
          </div>
        </div>
      </section>

      {/* ════════════════════ WHY DOTFIT ════════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              Not Just a Gym.<br /><span className="text-primary">A Lifestyle.</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
              Dotfit Fitness is Baner's most complete fitness ecosystem — built around your results, not just your membership fee.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-8 h-8 text-primary" />, title: "K11 Certified Facility", desc: "Internationally recognized certification ensuring world-class training standards, safety protocols, and equipment quality." },
              { icon: <Users className="w-8 h-8 text-primary" />, title: "1:4 Trainer Ratio", desc: "Every 4 members get one dedicated certified trainer — not the industry-standard 1:30. Your form, your progress, always monitored." },
              { icon: <Timer className="w-8 h-8 text-primary" />, title: "Happy Hours 12–5 PM", desc: "Train between 12 PM and 5 PM and unlock massively discounted memberships. Annual plan starts at just ₹10,000." },
              { icon: <Wind className="w-8 h-8 text-primary" />, title: "Fully Air-Conditioned", desc: "5th floor, 100% air-conditioned facility with premium lighting, ventilation, sauna, steam room, and spacious locker rooms." },
              { icon: <Apple className="w-8 h-8 text-primary" />, title: "Nutrition Counseling", desc: "Certified nutritionists craft personalized meal plans for fat loss, muscle gain, or sports performance — included with membership." },
              { icon: <CalendarCheck className="w-8 h-8 text-primary" />, title: "8+ Group Classes/Week", desc: "Zumba, Bollywood Beats, Kickboxing, Power Yoga, Pilates, Circuit Training, Dance Aerobics, and Bokwa — every week." },
              { icon: <HeartPulse className="w-8 h-8 text-primary" />, title: "Fitness Assessments", desc: "Comprehensive body composition analysis, BMI tracking, and progress reports — so you always know where you stand." },
              { icon: <Flame className="w-8 h-8 text-primary" />, title: "Sauna & Steam Room", desc: "Post-workout recovery zone with professional-grade sauna and steam room. Reduce soreness, improve circulation, relax." },
              { icon: <Brain className="w-8 h-8 text-primary" />, title: "Personal Training", desc: "1-on-1 customized training programs by certified personal trainers for maximum results in minimum time." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-8 border-2 border-gray-100 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group bg-white">
                <div className="w-14 h-14 bg-[#f8fbf3] border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:border-primary transition-all">
                  <div className="group-hover:[&>*]:text-white transition-all">{item.icon}</div>
                </div>
                <h3 className="text-lg font-display font-black uppercase tracking-wider text-gray-900 mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FACILITIES ════════════════════════════════ */}
      <section id="facilities" className="py-32 bg-[#f8fbf3]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">5th Floor, Baner</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              World-Class <span className="text-primary">Facilities</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] md:aspect-auto md:row-span-2 overflow-hidden group bg-gray-900">
              <img src="/facility-equipment.png" alt="Power Station" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-black uppercase tracking-widest mb-3">Premium Equipment</div>
                <h3 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-2">Power Station</h3>
                <p className="text-white/75 font-medium text-sm">Cutting-edge weightlifting & functional training area</p>
              </div>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden group bg-gray-900">
              <img src="/facility-sauna.png" alt="Recovery Zone" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-display font-black uppercase tracking-wider text-white mb-1">Recovery Zone</h3>
                <p className="text-white/70 font-medium text-sm">Sauna, Steam Room & Massage Therapy</p>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-100 p-10 flex flex-col justify-center">
              <h3 className="text-xl font-display font-black uppercase tracking-wider mb-6 text-primary">Complete Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Premium Cardio Zone", "Olympic Weightlifting Area", "Functional Training Area",
                  "Sauna & Steam Room", "Dedicated Locker Rooms", "Personal Training Studio",
                  "Zumba & Dance Floor", "Air-Conditioned 5th Floor", "Nutrition Counseling Room",
                  "Group Class Area", "Free Parking", "CCTV Security",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ EQUIPMENT ZONES ══════════════════════════ */}
      <div className="bg-gray-950 py-10 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-white/30 text-xs uppercase tracking-widest font-black mb-8">Equipment & Training Zones</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { icon: <Dumbbell className="w-6 h-6" />, label: "Free Weights Zone" },
              { icon: <Bike className="w-6 h-6" />, label: "Premium Cardio" },
              { icon: <Zap className="w-6 h-6" />, label: "Functional Area" },
              { icon: <Activity className="w-6 h-6" />, label: "Cable & Pulley" },
              { icon: <Wind className="w-6 h-6" />, label: "Sauna & Steam" },
              { icon: <Brain className="w-6 h-6" />, label: "PT Studio" },
            ].map((z, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-5 border border-white/10 hover:border-primary/40 transition-colors group">
                <div className="text-white/40 group-hover:text-primary transition-colors">{z.icon}</div>
                <span className="text-white/40 group-hover:text-white/70 text-xs uppercase tracking-widest font-bold text-center transition-colors">{z.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════ CLASSES & SCHEDULE ════════════════════════ */}
      <section id="classes" className="py-32 bg-gray-950 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <span className="text-primary font-black text-xs uppercase tracking-widest">Group Training</span>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-6">
                Group <span className="text-primary">Discipline</span>
              </h2>
              <p className="text-white/60 text-base mb-8 font-medium leading-relaxed">
                8+ diverse weekly classes led by certified instructors. From high-energy Zumba to calming Yoga — there's something for every goal.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { label: "Morning Batch", time: "6:00 AM – 9:00 AM", color: "border-primary" },
                  { label: "Happy Hours", time: "12:00 PM – 5:00 PM", color: "border-primary/40", note: "Discounted Membership" },
                  { label: "Evening Batch", time: "6:00 PM – 9:00 PM", color: "border-primary" },
                ].map((b) => (
                  <div key={b.label} className={`bg-white/5 p-5 border-l-4 ${b.color}`}>
                    <div className="text-primary font-black uppercase tracking-widest text-xs mb-1">{b.label}</div>
                    <div className="text-xl font-black tracking-tight">{b.time}</div>
                    {b.note && <div className="text-primary/70 text-xs font-bold uppercase tracking-wider mt-1">{b.note}</div>}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["Dance Aerobics", "Bokwa", "Strengthening", "Pilates", "Circuit Training"].map((t) => (
                  <span key={t} className="px-3 py-1.5 border border-white/15 text-white/50 uppercase tracking-wider text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>
            <div className="lg:w-2/3 flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Zumba & Bollywood Beats", img: "/class-zumba.png", inst: "Sikandar & Gajendra" },
                  { title: "Kickboxing & Boxing", img: "/class-kickboxing.png", inst: "Certified Trainers" },
                  { title: "Power Yoga & Pilates", img: "/class-yoga.png", inst: "Poonam & Kale" },
                  { title: "Circuit & Body Building", img: "/facility-equipment.png", inst: "Floor Managers" },
                ].map((cls, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="group relative aspect-video overflow-hidden bg-gray-900 border border-white/10">
                    <img src={cls.img} alt={cls.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <h3 className="text-sm font-display font-black uppercase tracking-widest mb-1">{cls.title}</h3>
                      <p className="text-white/40 text-xs font-medium">{cls.inst}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-display font-black uppercase tracking-widest text-primary">Weekly Schedule</h3>
                  <span className="text-white/30 text-xs font-medium">Sunday: 6 AM – 12 PM · Closed rest of day</span>
                </div>
                <table className="w-full text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white px-3 py-2.5 text-left font-black uppercase tracking-wider text-xs whitespace-nowrap">Time Slot</th>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <th key={d} className="bg-white/10 text-white px-3 py-2.5 font-black uppercase tracking-wider text-center">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white/[0.03]" : ""}>
                        <td className="px-3 py-2.5 text-white/50 font-bold whitespace-nowrap border-b border-white/5">{row.time}</td>
                        {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((cell, j) => (
                          <td key={j} className={`px-3 py-2.5 text-center font-medium border-b border-white/5 ${cell.includes("Happy") ? "text-primary font-black bg-primary/10" : "text-white/60"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-white/25 text-xs mt-2">* Schedule may vary. Confirm on WhatsApp +91 95272 37213</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ PRICING ═══════════════════════════════════ */}
      <section id="pricing" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">No Hidden Fees</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">Train 12 PM – 5 PM (Happy Hours) for massively discounted rates.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-16">
            {[
              { duration: "1 Month", regular: 3500, happy: 3000 },
              { duration: "3 Months", regular: 5500, happy: 5000 },
              { duration: "6 Months", regular: 7500, happy: 7000 },
              { duration: "1 Year", regular: 12000, happy: 10000, popular: true },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative p-8 bg-white flex flex-col transition-all hover:shadow-xl ${plan.popular ? "border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02] z-10" : "border-2 border-gray-100 hover:border-primary/30"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg">
                    Best Value
                  </div>
                )}
                <h3 className="text-2xl font-display font-black uppercase tracking-wider mb-6 text-center text-gray-900">{plan.duration}</h3>
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Regular Hours</div>
                    <div className="text-4xl font-display font-black text-gray-900">₹{plan.regular.toLocaleString()}</div>
                  </div>
                  <div className="p-4 border-2 border-primary/25 bg-[#f8fbf3] text-center">
                    <div className="text-xs text-primary uppercase font-black tracking-widest mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Happy Hours (12–5 PM)</div>
                    <div className="text-3xl font-display font-black text-gray-900">₹{plan.happy.toLocaleString()}</div>
                    <div className="text-xs text-primary font-bold mt-1">Save ₹{(plan.regular - plan.happy).toLocaleString()}</div>
                  </div>
                </div>
                <Button onClick={() => bookPlan(plan.duration)}
                  className={`w-full rounded-none uppercase tracking-widest font-black h-12 ${plan.popular ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" : "bg-gray-900 hover:bg-gray-800 text-white"}`}>
                  Select Plan
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Membership comparison table */}
          <div className="overflow-x-auto">
            <h3 className="text-center text-lg font-display font-black uppercase tracking-widest text-gray-900 mb-6">What's Included — Plan Comparison</h3>
            <table className="w-full border-collapse min-w-[640px] text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left px-4 py-3 font-black text-xs uppercase tracking-widest text-gray-500 w-48">Feature</th>
                  {["1 Month", "3 Months", "6 Months", "1 Year"].map((p) => (
                    <th key={p} className="text-center px-4 py-3 font-black text-xs uppercase tracking-widest text-gray-900 w-1/5">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Full Gym Access", vals: [true, true, true, true] },
                  { feature: "All Group Classes", vals: [true, true, true, true] },
                  { feature: "Locker Room Access", vals: [true, true, true, true] },
                  { feature: "Fitness Assessment", vals: [true, true, true, true] },
                  { feature: "Nutrition Consultation", vals: [false, true, true, true] },
                  { feature: "Sauna & Steam Room", vals: [false, false, true, true] },
                  { feature: "Priority Batch Booking", vals: [false, false, true, true] },
                  { feature: "Free Personal Training Sessions", vals: [false, false, false, "2 Free"] },
                  { feature: "Guest Pass", vals: [false, false, false, true] },
                  { feature: "Progress Report (Monthly)", vals: [false, true, true, true] },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-[#f8fbf3]/40" : ""}`}>
                    <td className="px-4 py-3 font-bold text-gray-700 text-xs">{row.feature}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className="text-center px-4 py-3">
                        {v === true ? <Check className="w-4 h-4 text-primary mx-auto" />
                          : v === false ? <X className="w-4 h-4 text-gray-300 mx-auto" />
                          : <span className="text-xs font-black text-primary uppercase tracking-widest">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-gray-400 font-black uppercase tracking-widest text-xs">
            <span>Single Session: ₹500</span>
            <span className="text-gray-200">|</span>
            <span>7-Day Trial Pass: ₹1,500</span>
            <span className="text-gray-200">|</span>
            <span>Personal Training: On Request</span>
          </div>
        </div>
      </section>

      {/* ════════════════════ URGENCY STRIP ═════════════════════════════ */}
      <div className="bg-gray-950 border-y border-white/5 py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-white/80 font-black uppercase tracking-widest text-sm">
                Happy Hours slots are limited — <span className="text-primary">Annual plan at ₹10,000</span> valid while slots last
              </p>
            </div>
            <button onClick={() => scrollTo("contact")}
              className="shrink-0 h-10 px-7 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-colors">
              Claim Your Spot →
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════ TRANSFORMATIONS ═══════════════════════════ */}
      <section className="py-32 bg-[#f8fbf3] border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-primary font-black text-xs uppercase tracking-widest">Member Stories</span>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
                Real <span className="text-primary">Results</span>
              </h2>
              <p className="text-gray-500 max-w-lg text-lg font-medium">Our members don't just work out — they transform.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-white border-2 border-gray-100">
                <div className="text-3xl font-display font-black text-primary">15kg</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Lost in 6 Months</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-gray-100">
                <div className="text-3xl font-display font-black text-primary">8kg</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Muscle in 90 Days</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square md:aspect-[4/3] bg-gray-100 group overflow-hidden border-2 border-gray-200">
              <img src="/transformation-1.png" alt="Member Transformation" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary font-black uppercase tracking-widest text-sm">15kg Lost · 6 Months</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 bg-white p-8 md:p-12 border-2 border-gray-100">
              <Trophy className="w-10 h-10 text-primary" />
              <h3 className="text-3xl font-display font-black uppercase tracking-tight text-gray-900">Your Transformation Starts Here</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                With a 1:4 trainer-to-member ratio and personalized nutrition plans, every member gets a customized path — from Day 1.
              </p>
              <ul className="space-y-3">
                {["Personalized workout plan from Day 1", "Weekly body composition tracking", "Nutrition guidance included in all plans", "Dedicated trainer accountability sessions", "Monthly progress reports"].map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                    <div className="w-5 h-5 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div>
                    {pt}
                  </li>
                ))}
              </ul>
              <Button onClick={() => scrollTo("contact")} className="w-fit bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-black">
                Start My Journey <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ TEAM ══════════════════════════════════════ */}
      <section id="team" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">1:4 Trainer Ratio</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              The <span className="text-primary">Experts</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">Certified professionals who demand your best — every single session.</p>
          </div>

          {/* Floor Managers */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-100" />
              <h3 className="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Floor Managers</h3>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StaffCard name="Ganesh" role="Floor Manager" img="/trainer-ganesh.png" cert="K11 Certified" />
              <StaffCard name="Yogesh" role="Floor Manager" img="/trainer-1.png" cert="K11 Certified" />
            </div>
          </div>

          {/* Specialized Instructors */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-100" />
              <h3 className="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Specialized Instructors</h3>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StaffCard name="Poonam" role="Yoga Expert" img="/trainer-poonam.png" cert="Yoga Alliance" />
              <StaffCard name="Kale" role="Yoga Instructor" img="/trainer-2.png" cert="Certified Yoga" />
              <StaffCard name="Sikandar" role="Zumba & Bollywood Beats" img="/trainer-sikandar.png" cert="Zumba Licensed" />
              <StaffCard name="Gajendra" role="Bollywood Beats" img="/trainer-1.png" cert="Dance Certified" />
            </div>
          </div>

          {/* Personal Trainers */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-100" />
              <h3 className="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Personal Trainers</h3>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StaffCard name="Dinesh" role="Personal Trainer" img="/trainer-ganesh.png" cert="CPT Certified" />
              <StaffCard name="Rajesh" role="Personal Trainer" img="/trainer-1.png" cert="K11 Certified" />
              <StaffCard name="Mayur" role="Personal Trainer" img="/trainer-2.png" cert="Strength Coach" />
              <StaffCard name="Tukaram" role="Personal Trainer" img="/trainer-sikandar.png" cert="K11 Certified" />
            </div>
          </div>

          {/* Full roster */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#f8fbf3] p-8 border-2 border-gray-100">
            {[
              { title: "Trainers", names: ["Dnyaneshwar", "Aryan", "Sunil", "Mayur", "Pravin", "Rupali"] },
              { title: "Personal Trainers", names: ["Dinesh", "Rajesh", "Mayur", "Tukaram"] },
              { title: "Front Desk", names: ["Prateek"] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="font-black uppercase tracking-widest text-gray-900 mb-4 text-xs border-b border-gray-200 pb-2">{group.title}</h4>
                <div className="space-y-2">
                  {group.names.map((n) => (
                    <div key={n} className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ PHOTO GALLERY ═════════════════════════════ */}
      <section id="gallery" className="py-32 bg-[#f8fbf3]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Inside Dotfit</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              The <span className="text-primary">Experience</span>
            </h2>
          </div>
          {/* Row 1: featured large + 2 stacked */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="group relative overflow-hidden md:row-span-2 bg-gray-900 col-span-1 md:col-span-1"
              style={{ gridRow: "span 2" }}>
              <div className="relative h-64 md:h-full min-h-[320px] overflow-hidden">
                <img src="/hero.png" alt="Main Gym Floor" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="text-primary font-black uppercase tracking-widest text-[10px]">Gym Floor</span>
                  <p className="text-white font-black uppercase tracking-tight text-lg leading-tight">Main Training<br />Floor</p>
                </div>
              </div>
            </motion.div>
            {[
              { src: "/facility-equipment.png", label: "Power Station" },
              { src: "/facility-sauna.png", label: "Recovery & Sauna" },
            ].map((photo, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden aspect-square bg-gray-900">
                <img src={photo.src} alt={photo.label} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-white font-black uppercase tracking-widest text-xs">{photo.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Row 2: 4-col strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: "/class-zumba.png", label: "Zumba & Dance" },
              { src: "/class-yoga.png", label: "Yoga & Pilates" },
              { src: "/class-kickboxing.png", label: "Kickboxing" },
              { src: "/transformation-1.png", label: "Transformations" },
            ].map((photo, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden aspect-square bg-gray-900">
                <img src={photo.src} alt={photo.label} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <span className="text-white font-black uppercase tracking-widest text-[10px]">{photo.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://www.instagram.com/dotfitfitness/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all">
              <Instagram className="w-4 h-4" /> See More on Instagram @dotfitfitness
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════ TESTIMONIALS ══════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Verified Reviews</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              Member <span className="text-primary">Verdicts</span>
            </h2>
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 text-amber-400 ${i < 4 ? "fill-amber-400" : "fill-amber-200"}`} />)}</div>
              <span className="font-black text-xl text-gray-900">4.2 / 5</span>
              <span className="text-gray-400 text-sm font-medium">· 726+ Reviews on Google & JustDial</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { text: "Trainers are very friendly and professional. They give personal attention to each member. The equipment is well-maintained and the facility is top-notch.", author: "Rahul S.", source: "Google Review", goal: "Fat Loss" },
              { text: "Great gym with well-maintained equipment. The Zumba classes with Sikandar sir are amazing — full energy! Highly recommend for anyone in Baner.", author: "Priya M.", source: "JustDial Review", goal: "Fitness" },
              { text: "Affordable pricing and excellent facilities. The sauna and steam room are a great add-on. Happy hours deal is absolutely unbeatable in Pune.", author: "Aakash P.", source: "Google Review", goal: "Overall Fitness" },
              { text: "Best gym in Baner. Ganesh sir and the entire team are very motivating. Lost 15kg in 6 months! The nutrition guidance made all the difference.", author: "Sneha R.", source: "Google Review", goal: "Fat Loss — 15kg" },
              { text: "The personal training by Dinesh sir transformed my body completely. The 1:4 trainer ratio is real — I always get personal attention. Worth every rupee.", author: "Vikram D.", source: "JustDial Review", goal: "Muscle Gain" },
              { text: "Yoga classes by Poonam ma'am are excellent. Perfect for stress relief after long office hours. The facility is extremely clean and well-managed.", author: "Anita K.", source: "Google Review", goal: "Yoga & Flexibility" },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-7 bg-[#f8fbf3] border-2 border-gray-100 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all flex flex-col">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                <span className="self-start px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">{r.goal}</span>
                <p className="text-gray-700 font-medium text-sm leading-relaxed flex-grow italic mb-5">"{r.text}"</p>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-gray-900">{r.author}</div>
                    <div className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">{r.source}</div>
                  </div>
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            <a href="https://g.page/r/CXQjnMYrSoMTEBM/review" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all">
              <Star className="w-3 h-3" /> Rate on Google
            </a>
            <a href="https://www.justdial.com/Pune/Dot-Fit-Fitness-Baner/020PXX20-XX20-200618142717-H5T6_BZDET" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all">
              <ExternalLink className="w-3 h-3" /> View on JustDial
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════ BMI CALCULATOR ════════════════════════════ */}
      <section className="py-24 bg-[#f8fbf3]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Free Tool</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mt-2 text-gray-900">
              Know Your <span className="text-primary">BMI</span>
            </h2>
          </div>
          <BmiCalculator onBook={bookPlan} />
        </div>
      </section>

      {/* ════════════════════ FITNESS GOALS ═════════════════════════════ */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Choose Your Path</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mt-2 text-white">
              What's Your <span className="text-primary">Goal?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Flame className="w-8 h-8" />, title: "Fat Loss", desc: "Cardio-focused programs, HIIT circuits, and calorie-deficit nutrition plans. Visible results in 8–12 weeks.", plan: "1 Month", cta: "Start Burning" },
              { icon: <Dumbbell className="w-8 h-8" />, title: "Muscle Gain", desc: "Progressive overload strength training, protein-rich meal plans, and dedicated personal trainer sessions.", plan: "3 Months", cta: "Start Building" },
              { icon: <HeartPulse className="w-8 h-8" />, title: "Overall Fitness", desc: "Balanced mix of cardio, strength, yoga, and group classes. Improve stamina, flexibility, and energy levels.", plan: "6 Months", cta: "Start Today" },
            ].map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {g.icon}
                </div>
                <h3 className="text-xl font-display font-black uppercase tracking-wider text-white mb-3">{g.title}</h3>
                <p className="text-white/55 font-medium text-sm leading-relaxed mb-6">{g.desc}</p>
                <button onClick={() => bookPlan(g.plan)}
                  className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-3 transition-all">
                  {g.cta} <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FITNESS TIPS / BLOG ═══════════════════════ */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Expert Advice</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              Fitness <span className="text-primary">Tips</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">Curated insights from Dotfit's certified trainers and nutritionists.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Flame className="w-6 h-6 text-primary" />,
                tag: "Fat Loss",
                title: "5 Ways to Maximise Your Morning Workout",
                excerpt: "Early morning workouts on an empty stomach (fasted cardio) can boost fat oxidation by up to 20%. Combine it with HIIT and a protein-rich breakfast for maximum results.",
                read: "3 min read",
              },
              {
                icon: <Dumbbell className="w-6 h-6 text-primary" />,
                tag: "Muscle Gain",
                title: "The Right Protein Intake for Your Goal",
                excerpt: "Aim for 1.6–2.2g of protein per kg of body weight daily. Spread intake across 4–5 meals for optimal muscle protein synthesis. Our nutritionists can personalise this for you.",
                read: "4 min read",
              },
              {
                icon: <HeartPulse className="w-6 h-6 text-primary" />,
                tag: "Recovery",
                title: "Why Rest Days are the Secret to Faster Progress",
                excerpt: "Muscles grow during rest, not during training. Our sauna and steam room accelerate recovery by improving circulation and reducing DOMS. 1–2 rest days per week is optimal.",
                read: "3 min read",
              },
            ].map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border-2 border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group bg-white flex flex-col">
                <div className="relative overflow-hidden aspect-video bg-[#f8fbf3] flex items-center justify-center border-b border-gray-100">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 flex items-center justify-center">{tip.icon}</div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest">{tip.tag}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display font-black uppercase tracking-wider text-gray-900 mb-3 text-base leading-tight group-hover:text-primary transition-colors">{tip.title}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed flex-grow">{tip.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1"><BookOpen className="w-3 h-3" />{tip.read}</span>
                    <button onClick={() => scrollTo("contact")} className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                      Ask Our Trainers <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FITNESS PROGRESSION GUIDE TEASER ══════════ */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-primary font-black text-xs uppercase tracking-widest">New Member Roadmap</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              Fitness <span className="text-primary">Progression</span> Guide
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              A structured five-level path from foundational movement to advanced split training — designed by our K11-certified coaches.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-[#f8fbf3] border border-gray-200 p-6 md:p-8 text-center">
            <div className="w-10 h-10 bg-primary mx-auto mb-4 flex items-center justify-center text-white font-black text-lg">1</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Beginner · 2× / week</div>
            <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-3 text-gray-900">Level 1 — Start Here</h3>
            <p className="text-gray-600 font-medium leading-relaxed mb-6">
              Begin with the foundational full-body path. Master movement patterns before adding load — five levels await when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="/guide" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-950 hover:bg-gray-900 text-white font-black uppercase tracking-widest text-sm transition-colors">
                Open Full Guide <ArrowRight className="w-4 h-4" />
              </a>
              <Button onClick={() => scrollTo("contact")} className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-bold text-xs h-12 px-6 shadow-md shadow-primary/20">
                Book Free Trial
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-4 uppercase tracking-widest">5 levels · 40+ exercises · Form cues · Visual references</p>
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════════════════════════ */}
      <section id="faq" className="py-32 bg-[#f8fbf3]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
              We Have <span className="text-primary">Answers.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Where is Dotfit Fitness located?", a: "We're at 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Road, near Salt Hotel, Balewadi Phata, Baner, Pune 411045. Just 2 minutes from Balewadi High Street." },
              { q: "What are your operating hours?", a: "Mon–Sat: 6:00 AM – 12:00 PM (regular), 12:00–2:00 PM rest/closed, 2:00–4:00 PM trainer workout, 4:00–10:00 PM regular. Sunday: 6:00 AM – 12:00 PM only." },
              { q: "Do you offer a free trial?", a: "Yes! Book a free trial session via the form below, WhatsApp, or call +91 95272 37213. No commitment or payment required for the trial." },
              { q: "What is the Happy Hours discount?", a: "Members who train between 12 PM and 5 PM (Happy Hours) get discounted memberships. Annual plan: ₹10,000 (Happy Hours) vs ₹12,000 regular — saving ₹2,000!" },
              { q: "Can I join for a single day or short trial?", a: "Yes. Single session walk-in costs ₹500. A 7-day trial pass is ₹1,500." },
              { q: "Are there ladies-only batches?", a: "Yes, we have specific batches and dedicated female trainers (Poonam, Rupali) for ladies. Please contact us for the current schedule." },
              { q: "Do you provide nutrition/diet guidance?", a: "Yes, certified nutritionists provide personalized meal plans based on your goals — included from the 3-month plan onwards." },
              { q: "Is the gym air-conditioned?", a: "Yes, the entire 5th-floor facility is fully air-conditioned including the gym floor, group class studio, and locker rooms." },
              { q: "Do you have a sauna and steam room?", a: "Yes, our recovery zone includes a professional-grade sauna and steam room — available to 6-month and 1-year members." },
              { q: "Is parking available?", a: "Yes, parking is available in the Srushti Elegance building complex at no extra charge." },
              { q: "What certifications does Dotfit Fitness have?", a: "Dotfit Fitness is K11 Certified — an internationally recognized fitness certification ensuring world-class training standards, equipment safety, and trainer qualifications." },
              { q: "How is the 1:4 trainer ratio maintained?", a: "Unlike most gyms (1:30 ratio), Dotfit maintains a strict 1 trainer per 4 members policy. This ensures your form, progress, and safety are always monitored during training." },
            ].map((faq, i) => <FaqItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════ SOCIAL CTA ════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <span className="text-primary font-black text-xs uppercase tracking-widest">Community</span>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mt-2 mb-5 text-gray-900">
                Follow <span className="text-primary">@dotfitfitness</span>
              </h2>
              <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
                Member transformations, workout reels, class highlights, and behind-the-scenes. Join our community on Instagram.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://www.instagram.com/dotfitfitness/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
                  <Instagram className="w-5 h-5" /> Follow on Instagram
                </a>
                <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-3 gap-2">
              {["/class-zumba.png", "/facility-equipment.png", "/class-yoga.png", "/class-kickboxing.png", "/facility-sauna.png", "/hero.png"].map((src, i) => (
                <a key={i} href="https://www.instagram.com/dotfitfitness/" target="_blank" rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden group bg-gray-100">
                  <img src={src} alt="Dotfit Fitness on Instagram" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ CONTACT & LOCATION ════════════════════════ */}
      <section id="location" className="border-t-2 border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form */}
          <div id="contact" className="p-8 md:p-16 lg:p-20 bg-white pb-28 md:pb-16">
            <div className="max-w-md mx-auto lg:mx-0">
              <span className="text-primary font-black text-xs uppercase tracking-widest">Free Trial Available</span>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mt-2 mb-4 text-gray-900">
                Start Your <span className="text-primary">Journey</span>
              </h2>
              <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">
                Fill the form below — our team responds within 30 minutes. Or WhatsApp/call +91 95272 37213 directly.
              </p>
              {formDone ? (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-[#f8fbf3] border-2 border-primary/20 p-8">
                  <div className="w-14 h-14 bg-primary flex items-center justify-center mb-5">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-gray-900 mb-1">
                    You're In{submittedName ? `, ${submittedName}` : ""}!
                  </h3>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Request received for <span className="font-black text-gray-900">{submittedPlan || "Free Trial"}</span>.
                  </p>
                  <p className="text-primary font-black text-xs uppercase tracking-widest mb-6">
                    We'll call you within 30 minutes.
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      "Our team will call to confirm your trial slot",
                      "You'll get a WhatsApp with directions & what to bring",
                      "Walk in, meet the trainers — no payment needed",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                        <p className="text-gray-600 text-sm font-medium leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%20just%20submitted%20the%20form%20and%20I%27d%20like%20to%20connect%20for%20my%20free%20trial."
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 h-12 bg-[#25D366] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Now
                    </a>
                    <a href="tel:+919527237213"
                      className="flex-1 h-12 bg-gray-900 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                      <Phone className="w-4 h-4" /> Call Us
                    </a>
                  </div>
                  <button onClick={() => setFormDone(false)} className="mt-4 text-xs text-gray-400 hover:text-gray-600 font-medium underline underline-offset-2 w-full text-center">
                    Submit another request
                  </button>
                </motion.div>
              ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-widest text-xs font-black text-gray-700">Full Name</FormLabel>
                      <FormControl><Input placeholder="Your Full Name" className="rounded-none border-gray-200 focus-visible:ring-primary h-12 bg-white text-gray-900" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-gray-700">Phone / WhatsApp</FormLabel>
                        <FormControl><Input placeholder="+91 98765 43210" className="rounded-none border-gray-200 focus-visible:ring-primary h-12 bg-white text-gray-900" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-gray-700">Email</FormLabel>
                        <FormControl><Input placeholder="you@example.com" className="rounded-none border-gray-200 focus-visible:ring-primary h-12 bg-white text-gray-900" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="plan" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-widest text-xs font-black text-gray-700">I'm Interested In</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="rounded-none border-gray-200 focus:ring-primary h-12 bg-white text-gray-900"><SelectValue placeholder="Select a plan or inquiry" /></SelectTrigger></FormControl>
                        <SelectContent className="rounded-none border-gray-200">
                          {["Free Trial", "1 Month", "3 Months", "6 Months", "1 Year", "Personal Training", "Zumba / Yoga Classes", "General Inquiry"].map((v) => (
                            <SelectItem key={v} value={v}>{v === "Free Trial" ? "Free Trial (No payment required)" : v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-widest text-xs font-black text-gray-700">Message (Optional)</FormLabel>
                      <FormControl><Textarea placeholder="Goals, preferred batch timing, any health conditions..." className="rounded-none border-gray-200 focus-visible:ring-primary min-h-[90px] resize-none bg-white text-gray-900" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-black text-sm shadow-lg shadow-primary/20" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Sending..." : "Submit — Get Callback Within 30 Mins"}
                  </Button>
                  <div className="flex gap-3 pt-2">
                    <a href="tel:+919527237213" className="flex-1 h-11 border-2 border-gray-200 hover:border-primary flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-all font-black uppercase tracking-widest text-xs">
                      <Phone className="w-3.5 h-3.5" /> Call Now
                    </a>
                    <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer" className="flex-1 h-11 bg-[#25D366] hover:bg-[#22c55e] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-xs transition-all">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </form>
              </Form>
              )}
            </div>
          </div>

          {/* Location info + map */}
          <div className="bg-gray-950 p-8 md:p-16 lg:p-20 text-white flex flex-col">
            <h2 className="text-3xl font-display font-black uppercase tracking-wider mb-8 border-b border-white/10 pb-5">Find Us</h2>
            <div className="space-y-6 mb-8 flex-grow">
              {[
                { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Address", content: <>136/1, 5th Floor, Srushti Elegance<br />Old Baner-Balewadi Rd, near Salt Hotel<br />Balewadi Phata, Baner, Pune – 411045<br /><a href="https://maps.app.goo.gl/kCSULHGjGmG2Nb44r" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-primary text-xs font-bold hover:underline">Open in Google Maps <ExternalLink className="w-3 h-3" /></a></> },
                { icon: <Clock className="w-4 h-4 text-primary" />, label: "Timings", content: <><strong>Mon – Sat:</strong> 6:00 AM – 12:00 PM &amp; 4:00 PM – 10:00 PM<br />12:00–2:00 PM Rest · 2:00–4:00 PM Trainer Workout<br /><span className="text-white/40">Sunday: 6:00 AM – 12:00 PM only</span></> },
                { icon: <Phone className="w-4 h-4 text-primary" />, label: "Phone / WhatsApp", content: <a href="tel:+919527237213" className="text-white/75 font-medium text-sm hover:text-primary transition-colors">+91 95272 37213</a> },
                { icon: <Mail className="w-4 h-4 text-primary" />, label: "Email", content: <a href="mailto:Support@dotfitfitness.in" className="text-white/75 font-medium text-sm hover:text-primary transition-colors">Support@dotfitfitness.in</a> },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-primary font-black text-xs uppercase tracking-widest mb-2">{item.label}</div>
                    <div className="text-white/75 font-medium text-sm leading-relaxed">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6">
              <div className="text-primary font-black text-xs uppercase tracking-widest mb-3">Social Links</div>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="https://www.instagram.com/dotfitfitness/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/DotfitFitness/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/company/dotfit-fitness/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://maps.app.goo.gl/kCSULHGjGmG2Nb44r" target="_blank" rel="noopener noreferrer" aria-label="Google Maps" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </div>
            {/* Google Maps embed with red pin */}
            <div className="w-full h-72 border border-white/10 overflow-hidden">
              <iframe
                title="Dotfit Fitness Location — Baner, Pune"
                src="https://maps.google.com/maps?q=Dotfit+Fitness,+136+Srushti+Elegance,+Old+Baner-Balewadi+Road,+Baner,+Pune+411045&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ PRE-FOOTER CTA ════════════════════════════ */}
      <section className="py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="container relative mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-white/70 font-black uppercase tracking-[0.3em] text-xs mb-5">Baner's #1 Gym Since 2012</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter text-white leading-none mb-6">
              Your First<br />Session Is <span className="text-gray-950">Free.</span>
            </h2>
            <p className="text-white/75 font-medium text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              No commitment. No payment. Walk in, meet our trainers, experience the facility — and decide if Dotfit is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo("contact")}
                className="h-16 px-12 bg-gray-950 hover:bg-gray-900 text-white font-black uppercase tracking-widest text-sm transition-colors shadow-2xl">
                Book My Free Trial
              </button>
              <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer"
                className="h-16 px-12 bg-white/15 hover:bg-white/25 border-2 border-white/30 text-white font-black uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-3">
                <MessageCircle className="w-5 h-5" /> WhatsApp Now
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { val: "Free", label: "Trial Session" },
                { val: "30 min", label: "Response Time" },
                { val: "₹10,000", label: "Annual Plan" },
                { val: "6–10 PM", label: "Evening Hours" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-display font-black text-white">{s.val}</div>
                  <div className="text-white/50 text-xs font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════════════════════ */}
      <footer className="bg-gray-950 text-white border-t border-white/5 pb-28 md:pb-0">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="flex justify-center">
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">@2026 Dotfit Fitness All Rights Reserved</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
