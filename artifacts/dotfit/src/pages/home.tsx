import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Activity
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
  return (
    <div className="bg-white border border-black/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-display font-bold uppercase tracking-wider text-black hover:text-primary transition-colors"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-black/70 font-medium text-base border-t border-black/5">
          {answer}
        </div>
      )}
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      plan: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast({
          title: "Request Submitted!",
          description: "Our team will contact you shortly.",
        });
        form.reset();
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later or call us directly.",
        variant: "destructive",
      });
    }
  }

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden selection:bg-primary selection:text-white font-sans">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => scrollTo("hero")}
          >
            <img
              src="/logo-text.png"
              alt="Dotfit Fitness"
              className="h-12 w-auto object-contain drop-shadow-md"
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Classes", "Pricing", "Facilities", "Team", "FAQ", "Location"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className={`text-sm font-bold transition-colors uppercase tracking-wider ${
                    isScrolled
                      ? "text-white/80 hover:text-primary"
                      : "text-white/90 hover:text-primary drop-shadow-sm"
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-wider font-bold shadow-lg shadow-primary/20"
            >
              Free Trial
            </Button>
          </div>

          <button
            className="md:hidden text-white drop-shadow-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {["Classes", "Pricing", "Facilities", "Team", "FAQ", "Location", "Contact"].map(
            (item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-2xl font-display font-black text-white hover:text-primary transition-colors uppercase tracking-widest"
              >
                {item}
              </button>
            )
          )}
        </div>
      )}

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919527237213"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-[#0A0A0A]"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Dotfit Premium Gym"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-primary/30 backdrop-blur-sm shadow-[0_0_15px_rgba(125,181,32,0.15)]">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-widest uppercase text-white">
                K11 Certified Facility
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-6 uppercase text-white">
              Raw Power.
              <br />
              <span className="text-primary">Precision.</span>
              <br />
              Results.
            </h1>

            <p className="text-xl md:text-2xl font-display font-bold text-white/90 mb-4 tracking-wide uppercase">
              Baner's Most Trusted Gym Since 2012
            </p>

            <p className="text-lg text-white/70 mb-10 max-w-xl font-medium leading-relaxed">
              Join a community of 50,000+ members who chose excellence.
              Professional coaching, cutting-edge equipment, and real results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollTo("contact")}
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-none text-base uppercase tracking-widest font-black group shadow-lg shadow-primary/20"
              >
                Book Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollTo("pricing")}
                size="lg"
                variant="outline"
                className="h-14 px-8 border-white/20 bg-white/5 hover:bg-white/10 hover:text-primary text-white rounded-none text-base uppercase tracking-widest font-bold backdrop-blur-sm"
              >
                View Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Dotfit / Stats Section */}
      <section className="py-20 relative z-20 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                label: "Happy Members",
                value: "50,000+",
                icon: <Users className="w-8 h-8 text-primary mb-3 mx-auto" />,
              },
              {
                label: "Verified Rating",
                value: "4.2/5",
                icon: <Star className="w-8 h-8 text-primary mb-3 mx-auto" />,
              },
              {
                label: "Trainer Ratio",
                value: "1:4",
                icon: <Activity className="w-8 h-8 text-primary mb-3 mx-auto" />,
              },
              {
                label: "Established",
                value: "2012",
                icon: <Trophy className="w-8 h-8 text-primary mb-3 mx-auto" />,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-black/5 border border-black/5"
              >
                {stat.icon}
                <div className="text-3xl md:text-5xl font-display font-black text-black mb-2 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-sm text-black/60 uppercase tracking-widest font-bold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              World-Class <span className="text-primary">Facilities</span>
            </h2>
            <p className="text-black/60 text-lg max-w-2xl mx-auto font-medium">
              Everything you need to reach your peak potential, spread across our
              premium air-conditioned 5th floor facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] md:aspect-auto md:row-span-2 overflow-hidden group bg-black">
              <img
                src="/facility-equipment.png"
                alt="Power Station"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-2">
                  Power Station
                </h3>
                <p className="text-white/80 font-medium">
                  Cutting-edge weightlifting & functional area
                </p>
              </div>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden group bg-black">
              <img
                src="/facility-sauna.png"
                alt="Sauna"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-2">
                  Recovery Zone
                </h3>
                <p className="text-white/80 font-medium">
                  Sauna, Steam Room & Massage Therapy
                </p>
              </div>
            </div>

            <div className="bg-black text-white p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-display font-black uppercase tracking-wider mb-6 text-primary">
                Also Featuring
              </h3>
              <ul className="space-y-4">
                {[
                  "Premium Cardio Zone",
                  "Air-conditioned 5th Floor Facility",
                  "Personal Training & Nutrition Counseling",
                  "Comprehensive Fitness Assessments",
                  "Dedicated Locker Rooms",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-white/90 font-medium"
                  >
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Classes & Timetable */}
      <section id="classes" className="py-32 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-6">
                Group <span className="text-primary">Discipline</span>
              </h2>
              <p className="text-white/70 text-lg mb-8 font-medium leading-relaxed">
                Elevate your heart rate and your mood with our diverse group
                classes. From high-intensity kickboxing to restorative yoga.
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-white/5 p-6 border-l-4 border-primary">
                  <h4 className="font-display font-bold uppercase tracking-widest text-primary mb-2">
                    Morning Batch
                  </h4>
                  <p className="text-2xl font-black tracking-tight">
                    6:00 AM – 9:00 AM
                  </p>
                </div>
                <div className="bg-white/5 p-6 border-l-4 border-primary">
                  <h4 className="font-display font-bold uppercase tracking-widest text-primary mb-2">
                    Evening Batch
                  </h4>
                  <p className="text-2xl font-black tracking-tight">
                    6:00 PM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Zumba & Bollywood", img: "/class-zumba.png" },
                  { title: "Kickboxing & Boxing", img: "/class-kickboxing.png" },
                  { title: "Power Yoga & Pilates", img: "/class-yoga.png" },
                  {
                    title: "Circuit & Body Building",
                    img: "/facility-equipment.png",
                  },
                ].map((cls, i) => (
                  <motion.div
                    key={cls.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-video overflow-hidden bg-black border border-white/10"
                  >
                    <img
                      src={cls.img}
                      alt={cls.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="text-xl font-display font-black uppercase tracking-widest mb-2">
                        {cls.title}
                      </h3>
                      <div className="w-10 h-1 bg-primary transform origin-left transition-transform group-hover:scale-x-150" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Dance Aerobics",
                  "Bokwa",
                  "Strengthening",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 border border-white/20 bg-transparent uppercase tracking-wider text-xs font-bold text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-black/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-black/60 text-lg font-medium">
              Premium access without hidden fees. Join between 12 PM – 5 PM for
              exclusive Happy Hour discounts.
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
                className={`relative p-8 bg-white border-2 flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10"
                    : "border-black/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-md">
                    Best Value
                  </div>
                )}
                <h3 className="text-2xl font-display font-black uppercase tracking-wider mb-6 text-center text-black">
                  {plan.duration}
                </h3>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="text-center">
                    <div className="text-xs text-black/50 uppercase tracking-widest font-bold mb-1">
                      Regular
                    </div>
                    <div className="text-4xl font-display font-black text-black">
                      ₹{plan.regular.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 border border-primary/20 bg-primary/5 text-center mt-4">
                    <div className="text-xs text-primary uppercase font-black tracking-widest mb-1 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Happy Hours
                    </div>
                    <div className="text-2xl font-display font-black text-black">
                      ₹{plan.happy.toLocaleString()}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    scrollTo("contact");
                    form.setValue("plan", plan.duration);
                  }}
                  className={`w-full rounded-none uppercase tracking-widest font-black h-12 ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-black hover:bg-black/90 text-white"
                  }`}
                >
                  Select Plan
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center text-black/60 font-bold uppercase tracking-widest text-sm">
            Single Session: ₹500 &nbsp;|&nbsp; 7 Days: ₹1,500
          </div>
        </div>
      </section>

      {/* Gallery / Transformations Section */}
      <section className="py-32 bg-white border-y border-black/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
                Real <span className="text-primary">Results</span>
              </h2>
              <p className="text-black/60 max-w-lg text-lg font-medium">
                Our members don't just work out, they transform. Witness the
                power of dedication and expert guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square md:aspect-[4/3] bg-black/5 group overflow-hidden border border-black/10">
              <img
                src="/transformation-1.png"
                alt="Member Transformation"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary font-bold uppercase tracking-widest">
                  15kg Lost in 6 Months
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-8 bg-primary/5 p-8 md:p-12 border border-primary/20">
              <Trophy className="w-12 h-12 text-primary" />
              <h3 className="text-3xl font-display font-black uppercase tracking-tight text-black">
                Your Transformation Starts Here
              </h3>
              <p className="text-black/70 font-medium leading-relaxed">
                With a 1:4 trainer ratio and customized nutrition plans, we ensure
                you are not just another face in the crowd. Your goals become our
                mission.
              </p>
              <Button
                onClick={() => scrollTo("contact")}
                className="w-fit bg-black hover:bg-black/80 text-white rounded-none uppercase tracking-widest font-black"
              >
                Start My Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="team" className="py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-white">
              The <span className="text-primary">Experts</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg font-medium">
              1:4 Trainer Ratio. Unmatched personal attention from certified
              professionals who demand your best.
            </p>
          </div>

          <div className="space-y-16">
            {/* Leadership */}
            <div>
              <h3 className="text-2xl font-display font-black text-primary uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                Floor Managers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Ganesh", role: "Floor Manager", img: "/trainer-ganesh.png" },
                  { name: "Yogesh", role: "Floor Manager", img: "/trainer-ganesh.png" },
                ].map((staff, i) => (
                  <div key={i} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white/5 border border-white/10">
                      <img
                        src={staff.img}
                        alt={staff.name}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-wider text-white">
                      {staff.name}
                    </h4>
                    <p className="text-white/50 text-sm uppercase tracking-widest font-bold">
                      {staff.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialized Trainers */}
            <div>
              <h3 className="text-2xl font-display font-black text-primary uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                Specialized Instructors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Poonam", role: "Yoga Expert", img: "/trainer-poonam.png" },
                  { name: "Sikandar", role: "Zumba & Beats", img: "/trainer-sikandar.png" },
                  { name: "Rupali", role: "Trainer", img: "/trainer-rupali.png" },
                  { name: "Gajendra", role: "Bollywood Beats", img: "/trainer-sikandar.png" },
                ].map((staff, i) => (
                  <div key={i} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white/5 border border-white/10">
                      <img
                        src={staff.img}
                        alt={staff.name}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <h4 className="text-xl font-display font-black uppercase tracking-wider text-white">
                      {staff.name}
                    </h4>
                    <p className="text-white/50 text-sm uppercase tracking-widest font-bold">
                      {staff.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roster lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/5 p-8 border border-white/10">
              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-white mb-4">
                  Trainers
                </h4>
                <p className="text-white/60 font-medium leading-relaxed">
                  Dnyaneshwar, Aryan, Sunil, Mayur, Pravin
                </p>
              </div>
              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-white mb-4">
                  Personal Trainers
                </h4>
                <p className="text-white/60 font-medium leading-relaxed">
                  Dinesh, Rajesh, Mayur, Tukaram
                </p>
              </div>
              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-white mb-4">
                  Front Desk
                </h4>
                <p className="text-white/60 font-medium leading-relaxed">
                  Prateek
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              Member <span className="text-primary">Verdicts</span>
            </h2>
            <div className="flex justify-center items-center gap-2 text-primary font-black text-xl">
              <span>4.2/5</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i === 4 ? "opacity-50" : "fill-current"}`}
                  />
                ))}
              </div>
              <span className="text-black/50 text-sm uppercase tracking-widest ml-2">
                (726+ Reviews)
              </span>
            </div>
          </div>

          <Carousel className="max-w-4xl mx-auto cursor-grab active:cursor-grabbing">
            <CarouselContent>
              {[
                {
                  text: "Trainers are very friendly and professional. They give personal attention to each member. Highly recommended!",
                  author: "Verified JustDial Review",
                },
                {
                  text: "Great gym with well-maintained equipment. The Zumba classes with Sikandar sir are amazing!",
                  author: "Verified Google Review",
                },
                {
                  text: "Affordable pricing and excellent facilities. The sauna is a great add-on. Happy hours deal is unbeatable.",
                  author: "Verified JustDial Review",
                },
                {
                  text: "Best gym in Baner. Ganesh sir and the team are very motivating. Lost 15kg in 6 months!",
                  author: "Verified Google Review",
                },
                {
                  text: "The personal training by Dinesh sir transformed my body completely. Worth every rupee.",
                  author: "Verified Google Review",
                },
                {
                  text: "Yoga classes by Poonam ma'am are excellent. Perfect for stress relief after office hours.",
                  author: "Verified JustDial Review",
                },
              ].map((review, i) => (
                <CarouselItem key={i}>
                  <div className="p-8 md:p-12 text-center bg-black/5 border border-black/5 mx-4">
                    <p className="text-xl md:text-3xl font-display font-bold leading-tight mb-8 text-black italic">
                      "{review.text}"
                    </p>
                    <div className="text-sm uppercase tracking-widest font-black text-primary">
                      {review.author}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white border-black/10 hover:bg-black/5 text-black shadow-md" />
            <CarouselNext className="hidden md:flex -right-12 bg-white border-black/10 hover:bg-black/5 text-black shadow-md" />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-black/5 border-t border-black/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-black">
              Questions? <span className="text-primary">Answers.</span>
            </h2>
          </div>

          <div className="w-full space-y-4">
            {[
              { q: "Is there parking available?", a: "Yes, parking is available in the Srushti Elegance building complex." },
              { q: "Do you offer a free trial?", a: "Yes! Book a free trial session by filling the form below or calling +91 95272 37213." },
              { q: "Can I join for a single day?", a: "Yes, a single session costs ₹500." },
              { q: "Are there ladies-only batches?", a: "Yes, we have specific batches and trainers available for ladies." },
              { q: "What is the Happy Hours discount?", a: "Members who train between 12 PM – 5 PM get heavily discounted membership rates." },
              { q: "Do you have diet/nutrition guidance?", a: "Yes, our certified nutritionists provide personalized meal plans based on your goals." },
              { q: "Is the gym air-conditioned?", a: "Yes, we have a fully air-conditioned 5th-floor facility." },
              { q: "Do you have a sauna?", a: "Yes, our recovery zone includes both a sauna and steam room." },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="location" className="relative border-t border-black/10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form Side */}
          <div id="contact" className="p-8 md:p-16 lg:p-24 bg-white">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 text-black">
                Start Your <span className="text-primary">Journey</span>
              </h2>
              <p className="text-black/60 mb-10 font-medium">
                Book a free trial or request membership details. Our team will
                get back to you immediately.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-black">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="rounded-none border-black/20 focus-visible:ring-primary h-12 bg-transparent text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-widest text-xs font-black text-black">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+91 98765 43210"
                              className="rounded-none border-black/20 focus-visible:ring-primary h-12 bg-transparent text-black"
                              {...field}
                            />
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
                          <FormLabel className="uppercase tracking-widest text-xs font-black text-black">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              className="rounded-none border-black/20 focus-visible:ring-primary h-12 bg-transparent text-black"
                              {...field}
                            />
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
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-black">
                          Interest
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none border-black/20 focus:ring-primary h-12 bg-transparent text-black">
                              <SelectValue placeholder="Select a plan or inquiry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-black/20">
                            <SelectItem value="Free Trial">Free Trial</SelectItem>
                            <SelectItem value="1 Month">1 Month Plan</SelectItem>
                            <SelectItem value="3 Months">
                              3 Months Plan
                            </SelectItem>
                            <SelectItem value="6 Months">
                              6 Months Plan
                            </SelectItem>
                            <SelectItem value="1 Year">1 Year Plan</SelectItem>
                            <SelectItem value="Personal Training">
                              Personal Training
                            </SelectItem>
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
                        <FormLabel className="uppercase tracking-widest text-xs font-black text-black">
                          Message (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific goals or medical conditions?"
                            className="rounded-none border-black/20 focus-visible:ring-primary min-h-[100px] resize-none bg-transparent text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest font-black text-base shadow-lg shadow-primary/20"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Sending..."
                      : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Location Side */}
          <div className="bg-[#0A0A0A] p-8 md:p-16 lg:p-24 text-white flex flex-col">
            <h2 className="text-3xl font-display font-black uppercase tracking-wider mb-8 border-b border-white/10 pb-4">
              Visit Us
            </h2>

            <div className="space-y-8 mb-12 flex-grow">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm text-primary mb-2">
                    Address
                  </h4>
                  <p className="text-white/80 font-medium leading-relaxed">
                    136/1, 5th Floor, Srushti Elegance
                    <br />
                    Old Baner-Balewadi Rd, near Salt Hotel,
                    <br />
                    Balewadi Phata, Baner, Pune – 411045
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm text-primary mb-2">
                    Timings
                  </h4>
                  <p className="text-white/80 font-medium leading-relaxed">
                    Mon–Sat: 6:00 AM – 10:00 PM
                    <br />
                    Trainers available from 5:30 AM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm text-primary mb-2">
                    Contact
                  </h4>
                  <p className="text-white/80 font-medium leading-relaxed">
                    +91 95272 37213
                    <br />
                    Support@dotfitfitness.in
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-64 border border-white/20 relative mt-auto">
              <iframe
                src="https://maps.google.com/maps?q=Dotfit+Fitness+Baner+Pune&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10 text-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img
            src="/logo-text.png"
            alt="Dotfit Fitness"
            className="h-8 object-contain opacity-80"
          />
          
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/DotfitFitness/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/dotfitfitness/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/919527237213"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/dotfit-fitness/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://maps.app.goo.gl/kCSULHGjGmG2Nb44r"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors"
            >
              <Map className="w-6 h-6" />
            </a>
          </div>
          
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Dotfit Fitness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
