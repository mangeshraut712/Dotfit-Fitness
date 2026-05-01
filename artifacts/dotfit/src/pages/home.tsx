import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Check, Menu, X, ArrowRight, Star, Twitter } from "lucide-react";

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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => scrollTo("hero")}>
            <img src="/logo-text.png" alt="Dotfit Fitness" className="h-12 w-auto object-contain" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Classes", "Pricing", "Facilities", "Team", "Location"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {item}
              </button>
            ))}
            <Button onClick={() => scrollTo("contact")} className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-wider font-bold">
              Free Trial
            </Button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {["Classes", "Pricing", "Facilities", "Team", "Location", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-2xl font-display font-bold text-white hover:text-primary transition-colors uppercase tracking-wider"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919527237213"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Premium gym"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium tracking-wider uppercase text-white/80">K11 Certified Facility</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-4 uppercase">
              Raw Power.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">
                Precision.
              </span><br />
              Results.
            </h1>

            <p className="text-xl md:text-2xl font-display font-semibold text-white/90 mb-4 tracking-wide">
              Stay Fit With Dotfit
            </p>
            
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl font-light leading-relaxed">
              Baner's most trusted gym since 2012. A K11-certified professional facility dedicated to helping you achieve your fitness goals, build discipline, and transform your body. Join 50,000+ happy members.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => scrollTo("contact")} size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-none text-base uppercase tracking-wider font-bold group">
                Book Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => scrollTo("pricing")} size="lg" variant="outline" className="h-14 px-8 border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-none text-base uppercase tracking-wider font-bold backdrop-blur-sm">
                View Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-20 -mt-10 border-y border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/5">
            {[
              { label: "Happy Members", value: "50,000+" },
              { label: "Google Rating", value: "4.2/5", icon: <Star className="inline w-6 h-6 text-primary mb-1 mr-1" /> },
              { label: "Trainer Ratio", value: "1:4" },
              { label: "Established", value: "2012" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-3xl md:text-5xl font-display font-black text-white mb-2 tracking-tighter">
                  {stat.icon}
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 uppercase tracking-widest font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
                Find Your <span className="text-primary">Discipline</span>
              </h2>
              <p className="text-white/60 max-w-lg text-lg">
                From high-intensity circuit training to restorative power yoga. Group sessions start from 7:30 AM daily.
              </p>
            </div>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white rounded-none uppercase tracking-wider font-bold">
              View Schedule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Zumba & Aerobics", img: "/class-zumba.png" },
              { title: "Kickboxing", img: "/class-kickboxing.png" },
              { title: "Power Yoga", img: "/class-yoga.png" },
            ].map((cls, i) => (
              <motion.div
                key={cls.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden bg-white/5"
              >
                <img src={cls.img} alt={cls.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-2">{cls.title}</h3>
                  <div className="w-12 h-1 bg-primary transform origin-left transition-transform group-hover:scale-x-150" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            {["Bokwa", "Circuit Training", "Pilates", "Body Building", "Strengthening"].map((tag) => (
              <span key={tag} className="px-6 py-3 border border-white/10 bg-white/5 uppercase tracking-wider text-sm font-medium text-white/80 hover:bg-primary/20 hover:text-primary transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-white/5 relative border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
              Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-white/60 text-lg">
              No hidden fees. Premium access. Special Happy Hour rates available between 12 PM – 5 PM.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { duration: "1 Month", regular: 3000, happy: 2000 },
              { duration: "3 Months", regular: 5500, happy: 4000, popular: true },
              { duration: "6 Months", regular: 7500, happy: 6000 },
              { duration: "1 Year", regular: 15000, happy: 8500 },
            ].map((plan, i) => (
              <motion.div
                key={plan.duration}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 border ${plan.popular ? 'border-primary bg-primary/5' : 'border-white/10 bg-background'} backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-6">{plan.duration}</h3>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Regular Price</div>
                    <div className="text-4xl font-display font-black">₹{plan.regular}</div>
                  </div>
                  
                  <div className="p-4 border border-primary/20 bg-primary/10">
                    <div className="text-sm text-primary uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Happy Hours
                    </div>
                    <div className="text-2xl font-display font-bold text-white">₹{plan.happy}</div>
                    <div className="text-xs text-white/60 mt-1">12 PM – 5 PM Access Only</div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {["Full facility access", "Free fitness assessment", "Locker room & sauna"].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-white/70 text-sm">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button onClick={() => { scrollTo("contact"); form.setValue("plan", plan.duration); }} className="w-full bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-wider font-bold h-12">
                  Select Plan
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center text-white/50 text-sm">
            Single Session: ₹500 • 7 Days: ₹1,500
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-16 text-center">
            World-Class <span className="text-primary">Facilities</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] md:aspect-auto md:row-span-2 overflow-hidden group">
              <img src="/facility-equipment.png" alt="Equipment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-display font-bold uppercase tracking-wider">Power Station</h3>
                <p className="text-white/70">Cutting-edge weightlifting area</p>
              </div>
            </div>
            
            <div className="relative aspect-[16/9] overflow-hidden group">
              <img src="/facility-sauna.png" alt="Sauna" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-display font-bold uppercase tracking-wider">Recovery Zone</h3>
                <p className="text-white/70">Sauna, Steam Room & Massage</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-4">Also Featuring</h3>
              <ul className="space-y-4">
                {[
                  "Premium Cardio Zone",
                  "Air-conditioned 5th Floor Facility",
                  "Nutrition Counseling",
                  "Comprehensive Fitness Assessments"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="team" className="py-32 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
                The <span className="text-primary">Experts</span>
              </h2>
              <p className="text-white/60 max-w-lg text-lg">
                1:4 Trainer Ratio. Unmatched personal attention from certified professionals who demand your best.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: "/trainer-1.png", name: "Head Coach" },
              { img: "/trainer-2.png", name: "Senior Trainer" },
              { img: "/trainer-1.png", name: "Strength Spec." },
              { img: "/trainer-2.png", name: "Yoga Master" }
            ].map((trainer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-500 m-4" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-wider">{trainer.name}</h3>
                <p className="text-primary text-sm uppercase tracking-widest font-bold">K11 Certified</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-16 text-center">
            Member <span className="text-primary">Verdicts</span>
          </h2>

          <Carousel className="max-w-4xl mx-auto cursor-grab active:cursor-grabbing">
            <CarouselContent>
              {[
                { text: "Trainers are friendly, professional, and attentive. Best decision I made for my health.", author: "Verified Member" },
                { text: "Well-maintained equipment and clean facilities. The power station is incredible.", author: "Verified Member" },
                { text: "Affordable membership prices compared to other gyms in Baner without compromising on quality.", author: "Verified Member" }
              ].map((review, i) => (
                <CarouselItem key={i}>
                  <div className="p-8 md:p-12 text-center">
                    <div className="flex justify-center gap-1 mb-8 text-primary">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
                    </div>
                    <p className="text-2xl md:text-4xl font-display font-light leading-tight mb-8">"{review.text}"</p>
                    <div className="text-sm uppercase tracking-widest font-bold text-white/50">{review.author}</div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white/5 border-white/10 hover:bg-white/20 text-white" />
            <CarouselNext className="hidden md:flex -right-12 bg-white/5 border-white/10 hover:bg-white/20 text-white" />
          </Carousel>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="location" className="relative border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form Side */}
          <div id="contact" className="p-8 md:p-16 lg:p-24 bg-background">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4">
                Start Your <span className="text-primary">Journey</span>
              </h2>
              <p className="text-white/60 mb-10">Book a free trial or request membership details. Our team will get back to you immediately.</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-xs text-white/50">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-white/5 border-white/10 rounded-none h-12 focus-visible:ring-primary" {...field} />
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
                          <FormLabel className="uppercase tracking-widest text-xs text-white/50">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 XXXXX XXXXX" className="bg-white/5 border-white/10 rounded-none h-12 focus-visible:ring-primary" {...field} />
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
                          <FormLabel className="uppercase tracking-widest text-xs text-white/50">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="bg-white/5 border-white/10 rounded-none h-12 focus-visible:ring-primary" {...field} />
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
                        <FormLabel className="uppercase tracking-widest text-xs text-white/50">Interested In</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-12 focus:ring-primary">
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-white/10 bg-background/95 backdrop-blur-xl">
                            <SelectItem value="Trial">Free Trial</SelectItem>
                            <SelectItem value="1 Month">1 Month Plan</SelectItem>
                            <SelectItem value="3 Months">3 Months Plan</SelectItem>
                            <SelectItem value="6 Months">6 Months Plan</SelectItem>
                            <SelectItem value="1 Year">1 Year Plan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-wider font-bold text-lg mt-4">
                    Send Request
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Map Side */}
          <div className="relative min-h-[400px] lg:min-h-full bg-white/5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.355331613149!2d73.77494541537243!3d18.55805568738676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2beca652e7837%3A0xc3b0922880bba3b!2sDotfit%20Fitness!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            <div className="absolute bottom-8 right-8 bg-background/90 backdrop-blur-md p-6 border border-white/10 max-w-sm">
              <h3 className="font-display font-bold uppercase tracking-wider mb-4 text-xl">Visit Us</h3>
              <div className="space-y-4 text-sm text-white/70">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <p>136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, near Salt Hotel, Baner, Pune – 411045</p>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <p>Mon–Sat: 6:00 AM – 10:00 PM<br/>Sun: Closed</p>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <p>+91 95272 37213</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <img src="/logo-text.png" alt="Dotfit Fitness" className="h-12 w-auto object-contain" />
              </div>
              <p className="text-white/50 max-w-md mb-8">
                Raw power meets precision training. A K11 certified facility designed for serious transformations.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-bold uppercase tracking-widest mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {["Classes", "Pricing", "Facilities", "Team", "Contact"].map((link) => (
                  <li key={link}>
                    <button onClick={() => scrollTo(link.toLowerCase())} className="text-white/50 hover:text-primary transition-colors uppercase text-sm tracking-wider">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li>Support@dotfitfitness.in</li>
                <li>+91 95272 37213</li>
                <li>Baner, Pune</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Dotfit Fitness. All rights reserved.</p>
            <p>Part of K11 Fitness Management Co. Pvt. Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
