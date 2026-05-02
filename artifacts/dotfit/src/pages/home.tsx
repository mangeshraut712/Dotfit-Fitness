import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Clock,
  Check,
  Menu,
  X,
  ArrowRight,
  Star,
  MessageCircle,
  Linkedin,
  Map,
  ChevronDown,
  Shield,
  Users,
  Trophy,
  Activity,
  Zap,
  HeartPulse,
  Timer,
  Dumbbell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-white border border-black/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-display font-bold uppercase tracking-wider text-black hover:text-primary transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : "text-black/40"}`}
        />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight ?? 200}px` : "0px",
          transition: "max-height 0.35s ease",
          overflow: "hidden",
        }}
      >
        <div className="px-6 pb-5 text-black/70 font-medium text-base border-t border-black/5 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  plan: z.string().min(1, "Please select a plan"),
  message: z.string().optional(),
});

export default function Home() {
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        toast({ title: "Request Submitted!", description: "Our team will contact you shortly." });
        form.reset();
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again or call +91 95272 37213 directly.",
        variant: "destructive",
      });
    }
  }

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const schedule = [
    { time: "6:00 – 7:00 AM", mon: "Strength", tue: "Yoga", wed: "Kickboxing", thu: "Zumba", fri: "Circuit", sat: "Open Gym" },
    { time: "7:00 – 9:00 AM", mon: "Open Gym", tue: "Open Gym", wed: "Open Gym", thu: "Open Gym", fri: "Open Gym", sat: "Open Gym" },
    { time: "12:00 – 5:00 PM", mon: "★ Happy Hours", tue: "★ Happy Hours", wed: "★ Happy Hours", thu: "★ Happy Hours", fri: "★ Happy Hours", sat: "★ Happy Hours" },
    { time: "6:00 – 7:00 PM", mon: "Zumba", tue: "Kickboxing", wed: "Power Yoga", thu: "Bollywood", fri: "Strength", sat: "Open Gym" },
    { time: "7:00 – 9:00 PM", mon: "Open Gym", tue: "Open Gym", wed: "Open Gym", thu: "Open Gym", fri: "Open Gym", sat: "Open Gym" },
  ];

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden selection:bg-primary selection:text-white font-sans">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => scrollTo("hero")}>
            <img src="/logo-text.png" alt="Dotfit Fitness" className="h-11 w-auto object-contain drop-shadow-md" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Classes", "Pricing", "Facilities", "Team", "FAQ", "Location"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`text-xs font-bold transition-colors uppercase tracking-widest ${isScrolled ? "text-white/80 hover:text-primary" : "text-white/90 hover:text-primary drop-shadow-sm"}`}
              >
                {item}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-bold text-xs shadow-lg shadow-primary/20 h-10 px-6"
            >
              Free Trial
            </Button>
          </div>

          <button className="md:hidden text-white drop-shadow-md" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {["Classes", "Pricing", "Facilities", "Team", "FAQ", "Location", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-2xl font-display font-black text-white hover:text-primary transition-colors uppercase tracking-widest"
              >
                {item}
              </button>
            ))}
            <div className="flex gap-6 mt-4">
              <a href="https://www.instagram.com/dotfitfitness/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary"><Instagram className="w-6 h-6" /></a>
              <a href="https://wa.me/919527237213" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary"><MessageCircle className="w-6 h-6" /></a>
              <a href="https://www.facebook.com/DotfitFitness/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary"><Facebook className="w-6 h-6" /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919527237213"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section id="hero" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-[#0A0A0A]">
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <img
            src="/hero.png"
            alt="Dotfit Premium Gym Interior"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-primary/40 backdrop-blur-sm shadow-[0_0_20px_rgba(125,181,32,0.2)]"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-widest uppercase text-white">K11 Certified Facility · Est. 2012</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-display font-black leading-[0.88] tracking-tighter mb-6 uppercase text-white">
              Raw Power.
              <br />
              <span className="text-primary">Precision.</span>
              <br />
              Results.
            </h1>

            <p className="text-xl md:text-2xl font-display font-bold text-white/90 mb-3 tracking-wide uppercase">
              Baner's Most Trusted Gym Since 2012
            </p>
            <p className="text-lg text-white/65 mb-10 max-w-xl font-medium leading-relaxed">
              Join a community of 50,000+ members who chose excellence. Professional coaching, cutting-edge equipment, and real results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollTo("contact")}
                size="lg"
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-none text-sm uppercase tracking-widest font-black group shadow-xl shadow-primary/25"
              >
                Book Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollTo("pricing")}
                size="lg"
                variant="outline"
                className="h-14 px-10 border-white/25 bg-white/5 hover:bg-white/10 hover:border-primary/50 hover:text-primary text-white rounded-none text-sm uppercase tracking-widest font-bold backdrop-blur-sm"
              >
                View Plans
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          onClick={() => scrollTo("stats")}
        >
          <span className="text-white/40 text-xs uppercase tracking-widest font-bold">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </section>

      {/* ══════════════════════════════ STATS ══════════════════════════════ */}
      <section id="stats" className="py-20 relative z-20 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { label: "Happy Members", value: "50,000+", icon: <Users className="w-7 h-7 text-primary mb-3 mx-auto" /> },
              { label: "Verified Rating", value: "4.2 / 5", icon: <Star className="w-7 h-7 text-primary mb-3 mx-auto" /> },
              { label: "Trainer Ratio", value: "1 : 4", icon: <Activity className="w-7 h-7 text-primary mb-3 mx-auto" /> },
              { label: "Years of Excellence", value: "13+", icon: <Trophy className="w-7 h-7 text-primary mb-3 mx-auto" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-black/[0.03] border border-black/5 hover:border-primary/20 transition-colors"
              >
                {stat.icon}
                <div className="text-4xl md:text-5xl font-display font-black text-black mb-2 tracking-tight">{stat.value}</div>
                <div className="text-xs text-black/50 uppercase tracking-widest font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ WHY DOTFIT (NEW) ═════════════════════════ */}
      <section className="py-32 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
              Why <span className="text-primary">Dotfit?</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
              Not just another gym. A complete fitness ecosystem built around your results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "K11 Certified Facility",
                desc: "Internationally recognized fitness certification ensuring world-class standards in training and safety.",
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "1:4 Trainer Ratio",
                desc: "Unparalleled personal attention. Every 4 members get one dedicated certified trainer — not the industry-standard 1:30.",
              },
              {
                icon: <Timer className="w-8 h-8 text-primary" />,
                title: "Happy Hours Deal",
                desc: "Train 12 PM – 5 PM and unlock heavily discounted memberships without compromising on facilities or coaching quality.",
              },
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: "5th Floor Premium Space",
                desc: "Fully air-conditioned, spacious 5th-floor facility with state-of-the-art equipment, sauna, steam room, and locker rooms.",
              },
              {
                icon: <HeartPulse className="w-8 h-8 text-primary" />,
                title: "Personalized Nutrition",
                desc: "Certified nutritionists create meal plans tailored to your specific goals — whether it's fat loss, muscle gain, or wellness.",
              },
              {
                icon: <Dumbbell className="w-8 h-8 text-primary" />,
                title: "Diverse Group Classes",
                desc: "From high-energy Zumba and Kickboxing to calming Power Yoga and Bollywood dance — 8+ class types every week.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0A0A0A] p-10 group hover:bg-white/[0.03] transition-colors"
              >
                <div className="mb-5">{item.icon}</div>
                <h3 className="text-xl font-display font-black uppercase tracking-wider text-white mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/55 font-medium leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FACILITIES ════════════════════════════════ */}
      <section id="facilities" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              World-Class <span className="text-primary">Facilities</span>
            </h2>
            <p className="text-black/55 text-lg max-w-2xl mx-auto font-medium">
              Everything you need to reach your peak potential — in our premium air-conditioned 5th floor facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] md:aspect-auto md:row-span-2 overflow-hidden group bg-black">
              <img src="/facility-equipment.png" alt="Power Station" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-2">Power Station</h3>
                <p className="text-white/75 font-medium">Cutting-edge weightlifting & functional area</p>
              </div>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden group bg-black">
              <img src="/facility-sauna.png" alt="Sauna" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-2">Recovery Zone</h3>
                <p className="text-white/75 font-medium">Sauna, Steam Room & Massage Therapy</p>
              </div>
            </div>

            <div className="bg-black text-white p-10 flex flex-col justify-center">
              <h3 className="text-xl font-display font-black uppercase tracking-wider mb-6 text-primary">Also Featuring</h3>
              <ul className="space-y-4">
                {["Premium Cardio Zone with Treadmills & Cycles", "Air-Conditioned 5th Floor Facility", "Personal Training & Nutrition Counseling", "Comprehensive Fitness Assessments", "Dedicated Locker Rooms & Showers"].map((item) => (
                  <li key={item} className="flex items-start gap-4 text-white/85 font-medium text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ CLASSES & SCHEDULE ════════════════════════════ */}
      <section id="classes" className="py-32 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Left col */}
            <div className="lg:w-1/3">
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-6">
                Group <span className="text-primary">Discipline</span>
              </h2>
              <p className="text-white/65 text-lg mb-8 font-medium leading-relaxed">
                From high-intensity kickboxing to restorative yoga — our diverse classes keep you engaged and progressing every day.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-white/5 p-5 border-l-4 border-primary">
                  <h4 className="font-display font-bold uppercase tracking-widest text-primary mb-1 text-xs">Morning Batch</h4>
                  <p className="text-2xl font-black tracking-tight">6:00 AM – 9:00 AM</p>
                </div>
                <div className="bg-white/5 p-5 border-l-4 border-white/20">
                  <h4 className="font-display font-bold uppercase tracking-widest text-white/50 mb-1 text-xs">Happy Hours</h4>
                  <p className="text-2xl font-black tracking-tight">12:00 PM – 5:00 PM</p>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Discounted Membership</p>
                </div>
                <div className="bg-white/5 p-5 border-l-4 border-primary">
                  <h4 className="font-display font-bold uppercase tracking-widest text-primary mb-1 text-xs">Evening Batch</h4>
                  <p className="text-2xl font-black tracking-tight">6:00 PM – 9:00 PM</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Dance Aerobics", "Bokwa", "Strengthening", "Pilates", "Circuit Training"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 border border-white/15 bg-transparent uppercase tracking-wider text-xs font-bold text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right col */}
            <div className="lg:w-2/3 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Zumba & Bollywood", img: "/class-zumba.png" },
                  { title: "Kickboxing & Boxing", img: "/class-kickboxing.png" },
                  { title: "Power Yoga & Pilates", img: "/class-yoga.png" },
                  { title: "Circuit & Body Building", img: "/facility-equipment.png" },
                ].map((cls, i) => (
                  <motion.div
                    key={cls.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-video overflow-hidden bg-black border border-white/10"
                  >
                    <img src={cls.img} alt={cls.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                      <h3 className="text-lg font-display font-black uppercase tracking-widest mb-2">{cls.title}</h3>
                      <div className="w-8 h-1 bg-primary transform origin-left transition-transform group-hover:scale-x-150" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Schedule Table */}
              <div className="overflow-x-auto">
                <h3 className="text-lg font-display font-black uppercase tracking-widest text-primary mb-4">Weekly Class Schedule</h3>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white px-3 py-2.5 text-left font-black uppercase tracking-widest text-xs whitespace-nowrap">Time</th>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <th key={d} className="bg-white/10 text-white px-3 py-2.5 font-black uppercase tracking-wider text-center">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white/[0.03]" : ""}>
                        <td className="px-3 py-2.5 text-white/60 font-bold whitespace-nowrap border-b border-white/5">{row.time}</td>
                        {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((cell, j) => (
                          <td
                            key={j}
                            className={`px-3 py-2.5 text-center font-medium border-b border-white/5 ${cell.startsWith("★") ? "text-primary font-black bg-primary/10" : "text-white/70"}`}
                          >
                            {cell.replace("★ ", "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-white/30 text-xs mt-2 font-medium">* Sunday: Closed &nbsp;|&nbsp; Schedule subject to change. Please confirm at the front desk.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ PRICING ══════════════════════════════════ */}
      <section id="pricing" className="py-32 bg-black/[0.03]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-black/55 text-lg font-medium">
              Premium access without hidden fees. Train between 12 PM – 5 PM for exclusive Happy Hour discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[
              { duration: "1 Month", regular: 3000, happy: 2000 },
              { duration: "3 Months", regular: 5500, happy: 4000 },
              { duration: "6 Months", regular: 7500, happy: 6000 },
              { duration: "1 Year", regular: 15000, happy: 8500, popular: true },
            ].map((plan, i) => (
              <motion.div
                key={plan.duration}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 bg-white flex flex-col transition-shadow hover:shadow-xl ${plan.popular ? "border-2 border-primary shadow-xl shadow-primary/10 scale-[1.03] z-10" : "border border-black/10"}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg">
                    Best Value
                  </div>
                )}
                <h3 className="text-2xl font-display font-black uppercase tracking-wider mb-6 text-center text-black">{plan.duration}</h3>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="text-center">
                    <div className="text-xs text-black/40 uppercase tracking-widest font-bold mb-1">Regular</div>
                    <div className="text-4xl font-display font-black text-black">₹{plan.regular.toLocaleString()}</div>
                  </div>
                  <div className="p-4 border border-primary/25 bg-primary/5 text-center mt-4">
                    <div className="text-xs text-primary uppercase font-black tracking-widest mb-1 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Happy Hours (12–5 PM)
                    </div>
                    <div className="text-3xl font-display font-black text-black">₹{plan.happy.toLocaleString()}</div>
                    <div className="text-xs text-primary/70 font-bold mt-1">Save ₹{(plan.regular - plan.happy).toLocaleString()}</div>
                  </div>
                </div>

                <Button
                  onClick={() => { scrollTo("contact"); form.setValue("plan", plan.duration); }}
                  className={`w-full rounded-none uppercase tracking-widest font-black h-12 ${plan.popular ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" : "bg-black hover:bg-black/80 text-white"}`}
                >
                  Select Plan
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-black/50 font-black uppercase tracking-widest text-xs">
            <span>Single Session: ₹500</span>
            <span className="text-black/20">|</span>
            <span>7-Day Pass: ₹1,500</span>
            <span className="text-black/20">|</span>
            <span>Personal Training: On Request</span>
          </div>
        </div>
      </section>

      {/* ════════════════════ REAL RESULTS / TRANSFORMATIONS ════════════════ */}
      <section className="py-32 bg-white border-y border-black/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
                Real <span className="text-primary">Results</span>
              </h2>
              <p className="text-black/55 max-w-lg text-lg font-medium">
                Our members don't just work out — they transform. Witness the power of dedication and expert guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square md:aspect-[4/3] bg-black/5 group overflow-hidden border border-black/10">
              <img src="/transformation-1.png" alt="Member Transformation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary font-bold uppercase tracking-widest text-sm">15kg Lost in 6 Months</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-8 bg-primary/5 p-8 md:p-12 border border-primary/20">
              <Trophy className="w-12 h-12 text-primary" />
              <h3 className="text-3xl font-display font-black uppercase tracking-tight text-black">Your Transformation Starts Here</h3>
              <p className="text-black/65 font-medium leading-relaxed">
                With a 1:4 trainer ratio and customized nutrition plans, you are not just another face in the crowd. Your goals become our mission — from day one.
              </p>
              <ul className="space-y-3">
                {["Personalized workout plan from Day 1", "Weekly progress tracking & assessments", "Nutrition guidance included", "Dedicated trainer accountability"].map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-black/70 font-medium text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Button onClick={() => scrollTo("contact")} className="w-fit bg-black hover:bg-black/80 text-white rounded-none uppercase tracking-widest font-black">
                Start My Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ TEAM ═══════════════════════════════════════ */}
      <section id="team" className="py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-white">
              The <span className="text-primary">Experts</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg font-medium">
              A 1:4 trainer ratio — unmatched personal attention from certified professionals who demand your best every session.
            </p>
          </div>

          <div className="space-y-16">
            {/* Floor Managers */}
            <div>
              <h3 className="text-sm font-display font-black text-primary uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                Floor Managers
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { name: "Ganesh", role: "Floor Manager", img: "/trainer-ganesh.png" },
                  { name: "Yogesh", role: "Floor Manager", img: "/trainer-1.png" },
                ].map((staff, i) => (
                  <div key={i} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white/5 border border-white/10">
                      <img src={staff.img} alt={staff.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-wider text-white">{staff.name}</h4>
                    <p className="text-primary text-xs uppercase tracking-widest font-bold mt-1">{staff.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialized Instructors */}
            <div>
              <h3 className="text-sm font-display font-black text-primary uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                Specialized Instructors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { name: "Poonam", role: "Yoga Expert", img: "/trainer-poonam.png" },
                  { name: "Kale", role: "Yoga Instructor", img: "/trainer-2.png" },
                  { name: "Sikandar", role: "Zumba & Bollywood", img: "/trainer-sikandar.png" },
                  { name: "Gajendra", role: "Bollywood Beats", img: "/trainer-1.png" },
                ].map((staff, i) => (
                  <div key={i} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white/5 border border-white/10">
                      <img src={staff.img} alt={staff.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-wider text-white">{staff.name}</h4>
                    <p className="text-primary text-xs uppercase tracking-widest font-bold mt-1">{staff.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Roster */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.04] p-8 border border-white/10">
              <div>
                <h4 className="font-display font-black uppercase tracking-widest text-white mb-4 text-sm border-b border-white/10 pb-2">Trainers</h4>
                <div className="space-y-2">
                  {["Dnyaneshwar", "Aryan", "Sunil", "Mayur", "Pravin", "Rupali"].map((n) => (
                    <div key={n} className="flex items-center gap-2 text-white/55 font-medium text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-display font-black uppercase tracking-widest text-white mb-4 text-sm border-b border-white/10 pb-2">Personal Trainers</h4>
                <div className="space-y-2">
                  {["Dinesh", "Rajesh", "Mayur", "Tukaram"].map((n) => (
                    <div key={n} className="flex items-center gap-2 text-white/55 font-medium text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-display font-black uppercase tracking-widest text-white mb-4 text-sm border-b border-white/10 pb-2">Front Desk</h4>
                <div className="space-y-2">
                  {["Prateek"].map((n) => (
                    <div key={n} className="flex items-center gap-2 text-white/55 font-medium text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ══════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              Member <span className="text-primary">Verdicts</span>
            </h2>
            <div className="flex justify-center items-center gap-2 text-primary font-black text-xl">
              <span>4.2 / 5</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-current" : "opacity-40"}`} />
                ))}
              </div>
              <span className="text-black/40 text-sm uppercase tracking-widest ml-2 font-bold">726+ Reviews</span>
            </div>
          </div>

          <Carousel className="max-w-4xl mx-auto cursor-grab active:cursor-grabbing">
            <CarouselContent>
              {[
                { text: "Trainers are very friendly and professional. They give personal attention to each member. Highly recommended!", author: "Verified JustDial Review" },
                { text: "Great gym with well-maintained equipment. The Zumba classes with Sikandar sir are amazing!", author: "Verified Google Review" },
                { text: "Affordable pricing and excellent facilities. The sauna is a great add-on. Happy hours deal is unbeatable.", author: "Verified JustDial Review" },
                { text: "Best gym in Baner. Ganesh sir and the team are very motivating. Lost 15kg in 6 months!", author: "Verified Google Review" },
                { text: "The personal training by Dinesh sir transformed my body completely. Worth every rupee.", author: "Verified Google Review" },
                { text: "Yoga classes by Poonam ma'am are excellent. Perfect for stress relief after office hours.", author: "Verified JustDial Review" },
              ].map((review, i) => (
                <CarouselItem key={i}>
                  <div className="p-8 md:p-16 text-center bg-black/[0.03] border border-black/5 mx-4">
                    <div className="flex justify-center mb-6 gap-1">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-primary fill-current" />)}
                    </div>
                    <p className="text-xl md:text-2xl font-display font-bold leading-tight mb-8 text-black italic">"{review.text}"</p>
                    <div className="text-xs uppercase tracking-widest font-black text-primary">{review.author}</div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white border-black/10 hover:bg-black/5 text-black shadow-md" />
            <CarouselNext className="hidden md:flex -right-12 bg-white border-black/10 hover:bg-black/5 text-black shadow-md" />
          </Carousel>
        </div>
      </section>

      {/* ═══════════════════════════ FAQ ════════════════════════════════════ */}
      <section id="faq" className="py-32 bg-black/[0.03] border-t border-black/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              Questions? <span className="text-primary">Answered.</span>
            </h2>
            <p className="text-black/50 font-medium">Everything you need to know before your first visit.</p>
          </div>

          <div className="w-full space-y-3">
            {[
              { q: "Is there parking available?", a: "Yes, parking is available in the Srushti Elegance building complex at no extra charge." },
              { q: "Do you offer a free trial?", a: "Yes! Book a free trial session by filling the form below or calling +91 95272 37213. No commitment required." },
              { q: "Can I join for a single day?", a: "Yes, a single session (walk-in) costs ₹500. A 7-day pass is ₹1,500." },
              { q: "Are there ladies-only batches?", a: "Yes, we have specific batches and dedicated female trainers available. Please contact us for the schedule." },
              { q: "What is the Happy Hours discount?", a: "Members who train between 12 PM – 5 PM get heavily discounted membership rates. For example, a 1-Year membership drops from ₹15,000 to ₹8,500." },
              { q: "Do you have diet/nutrition guidance?", a: "Yes, our certified nutritionists provide personalized meal plans based on your body type and goals — fat loss, muscle gain, or overall wellness." },
              { q: "Is the gym air-conditioned?", a: "Yes, the entire 5th-floor facility is fully air-conditioned, including the gym floor, group class areas, and locker rooms." },
              { q: "Do you have a sauna?", a: "Yes, our recovery zone includes both a sauna and steam room, available to all members." },
              { q: "What are your operating hours?", a: "We are open Monday to Saturday, 6:00 AM to 10:00 PM. Trainers are available from 5:30 AM. Sunday is closed." },
              { q: "How do I get there?", a: "We're at 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Road, near Salt Hotel, Balewadi Phata, Baner, Pune 411045." },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SOCIAL CTA (NEW) ══════════════════════════════ */}
      <section className="py-24 bg-[#0A0A0A] border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <p className="text-primary font-black uppercase tracking-widest text-sm mb-4">Follow Our Journey</p>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-white mb-6">
                We're Live On <span className="text-primary">Instagram</span>
              </h2>
              <p className="text-white/55 font-medium text-lg mb-8 leading-relaxed">
                Member transformations, trainer tips, class previews, and behind-the-scenes action — follow <strong className="text-white">@dotfitfitness</strong> and be part of the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.instagram.com/dotfitfitness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-8 h-13 py-3 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                  Follow on Instagram
                </a>
                <a
                  href="https://wa.me/919527237213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 h-13 py-3 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-3 gap-2">
              {[
                { bg: "from-primary/30 to-primary/10", icon: <Dumbbell className="w-8 h-8 text-primary" />, label: "Workouts" },
                { bg: "from-white/10 to-white/5", icon: <Users className="w-8 h-8 text-white/60" />, label: "Community" },
                { bg: "from-primary/20 to-transparent", icon: <Trophy className="w-8 h-8 text-primary" />, label: "Results" },
                { bg: "from-white/5 to-transparent", icon: <HeartPulse className="w-8 h-8 text-white/60" />, label: "Wellness" },
                { bg: "from-primary/30 to-primary/5", icon: <Activity className="w-8 h-8 text-primary" />, label: "Classes" },
                { bg: "from-white/10 to-white/5", icon: <Zap className="w-8 h-8 text-white/60" />, label: "Energy" },
              ].map((card, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/dotfitfitness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`aspect-square bg-gradient-to-br ${card.bg} border border-white/10 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors group`}
                >
                  {card.icon}
                  <span className="text-white/30 text-xs uppercase tracking-wider font-bold group-hover:text-white/60 transition-colors">{card.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ CONTACT & LOCATION ════════════════════════════ */}
      <section id="location" className="relative border-t border-black/10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form Side */}
          <div id="contact" className="p-8 md:p-16 lg:p-20 bg-white">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 text-black">
                Start Your <span className="text-primary">Journey</span>
              </h2>
              <p className="text-black/55 mb-10 font-medium">
                Book a free trial or request membership details. Our team responds immediately.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-black">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" className="rounded-none border-black/20 focus-visible:ring-primary h-12 bg-transparent text-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-widest text-xs font-black text-black">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" className="rounded-none border-black/20 focus-visible:ring-primary h-12 bg-transparent text-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-widest text-xs font-black text-black">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" className="rounded-none border-black/20 focus-visible:ring-primary h-12 bg-transparent text-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-black">Interest</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-black/20 focus:ring-primary h-12 bg-transparent text-black">
                              <SelectValue placeholder="Select a plan or inquiry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-black/20">
                            <SelectItem value="Free Trial">Free Trial</SelectItem>
                            <SelectItem value="1 Month">1 Month Plan</SelectItem>
                            <SelectItem value="3 Months">3 Months Plan</SelectItem>
                            <SelectItem value="6 Months">6 Months Plan</SelectItem>
                            <SelectItem value="1 Year">1 Year Plan</SelectItem>
                            <SelectItem value="Personal Training">Personal Training</SelectItem>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-black">Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your goals, preferred batch timing, or any questions..." className="rounded-none border-black/20 focus-visible:ring-primary min-h-[100px] resize-none bg-transparent text-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-black text-sm shadow-lg shadow-primary/20"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Sending..." : "Submit Request"}
                  </Button>

                  <p className="text-xs text-black/40 text-center font-medium">Or call us directly: <a href="tel:+919527237213" className="text-primary font-black">+91 95272 37213</a></p>
                </form>
              </Form>
            </div>
          </div>

          {/* Location Side */}
          <div className="bg-[#0A0A0A] p-8 md:p-16 lg:p-20 text-white flex flex-col">
            <h2 className="text-3xl font-display font-black uppercase tracking-wider mb-8 border-b border-white/10 pb-4">
              Visit Us
            </h2>

            <div className="space-y-7 mb-10 flex-grow">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-2">Address</h4>
                  <p className="text-white/75 font-medium leading-relaxed text-sm">
                    136/1, 5th Floor, Srushti Elegance<br />
                    Old Baner-Balewadi Rd, near Salt Hotel<br />
                    Balewadi Phata, Baner, Pune – 411045
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-2">Timings</h4>
                  <p className="text-white/75 font-medium leading-relaxed text-sm">
                    Mon – Sat: 6:00 AM – 10:00 PM<br />
                    Trainers available from 5:30 AM<br />
                    <span className="text-white/40">Sunday: Closed</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-2">Call / WhatsApp</h4>
                  <a href="tel:+919527237213" className="text-white/75 font-medium hover:text-primary transition-colors text-sm block">+91 95272 37213</a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-2">Email</h4>
                  <a href="mailto:Support@dotfitfitness.in" className="text-white/75 font-medium hover:text-primary transition-colors text-sm block">Support@dotfitfitness.in</a>
                </div>
              </div>
            </div>

            <div className="w-full h-80 border border-white/15 overflow-hidden mt-auto">
              <iframe
                src="https://maps.google.com/maps?q=Dotfit+Fitness+Baner+Pune&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dotfit Fitness Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════════════════ */}
      <footer className="bg-black py-16 border-t border-white/10 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <img src="/logo-text.png" alt="Dotfit Fitness" className="h-9 object-contain opacity-90 mb-5" />
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
                Baner's premier fitness destination since 2012. K11 Certified. 50,000+ happy members. Stay Fit With Dotfit.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-5">Contact</h4>
              <div className="space-y-3">
                <a href="tel:+919527237213" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm font-medium">
                  <Phone className="w-4 h-4 text-primary shrink-0" /> +91 95272 37213
                </a>
                <a href="mailto:Support@dotfitfitness.in" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm font-medium">
                  <Mail className="w-4 h-4 text-primary shrink-0" /> Support@dotfitfitness.in
                </a>
                <div className="flex items-start gap-3 text-white/50 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>136/1, 5th Floor, Srushti Elegance, Baner, Pune 411045</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-5">Follow Us</h4>
              <div className="flex gap-4 flex-wrap">
                <a href="https://www.facebook.com/DotfitFitness/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/30 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/dotfitfitness/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/30 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://wa.me/919527237213" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#25D366] hover:border-[#25D366]/30 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/dotfit-fitness/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/30 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://maps.app.goo.gl/kCSULHGjGmG2Nb44r" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/30 transition-colors">
                  <Map className="w-5 h-5" />
                </a>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => scrollTo("contact")}
                  className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-black text-xs h-10 px-6 shadow-lg shadow-primary/20"
                >
                  Book Free Trial
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Dotfit Fitness. All rights reserved.
            </p>
            <p className="text-white/20 text-xs font-medium">
              Mon–Sat: 6:00 AM – 10:00 PM &nbsp;|&nbsp; Sunday: Closed
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
