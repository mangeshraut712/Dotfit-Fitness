import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Dumbbell,
  Layers,
  MessageCircle,
  Phone,
  Shield,
  Target,
  Zap,
} from "lucide-react";

type Exercise = {
  name: string;
  muscles: string;
  secondary: string;
  equipment: string;
  sets: string;
  reps: string;
  how: string;
  mistakes: string;
  visual: string;
};

type Level = {
  level: number;
  badge: string;
  title: string;
  phase: string;
  frequency: string;
  goal: string;
  notes: string;
  focus: string;
  exercises: Exercise[];
};

const LEVELS: Level[] = [
  {
    level: 1,
    badge: "Beginner",
    title: "Foundational Full-Body Integration",
    phase: "Phase 1",
    frequency: "2–3× / week",
    goal: "Learn the six base movement patterns and build joint stability before adding load.",
    notes: "Technique before weight — always. Rest 60–90 sec between sets. Stop if a movement causes joint pain. Warm up 5 min (see below).",
    focus: "Squat · Hip Hinge · Push · Pull · Carry · Core Stability",
    exercises: [
      {
        name: "⚡ Warm-Up: World's Greatest Stretch",
        muscles: "Full Body Mobility",
        secondary: "Hip Flexors, Thoracic Spine, Hamstrings",
        equipment: "Bodyweight / mat",
        sets: "1",
        reps: "5 / side — before every session",
        how: "Step into a lunge, plant the same-side hand, rotate the top arm open to the ceiling, hold 2 sec, then return. Move slowly through every rep.",
        mistakes: "Rushing, not reaching full rotation, losing balance.",
        visual: "Ask a trainer to walk you through the sequence on Day 1 — it sets the tone for every session.",
      },
      {
        name: "Goblet Squat",
        muscles: "Quadriceps, Glutes",
        secondary: "Core, Upper Back",
        equipment: "Dumbbell or Kettlebell",
        sets: "3",
        reps: "12–15 · Rest 60 sec",
        how: "Hold the weight vertically close to your chest. Push knees out, sit deep between your hips, keep your chest tall, then stand by driving through the floor. Squeeze glutes at the top.",
        mistakes: "Knees caving inward, chest collapsing, heels rising off the floor.",
        visual: "Use a squat anatomy diagram. Ask a trainer to watch depth and torso angle from the side.",
      },
      {
        name: "Incline Push-Up",
        muscles: "Chest, Triceps",
        secondary: "Front Deltoids, Core",
        equipment: "Bodyweight — use a bench or Smith machine bar",
        sets: "3",
        reps: "10–15 · Rest 60 sec",
        how: "Hands shoulder-width on an elevated surface, body forms a straight line from head to heels. Lower chest to the surface under control, then press back up without letting hips sag or shooting upward.",
        mistakes: "Sagging hips, elbows flaring out wider than 45°, shrugging the shoulders at the top.",
        visual: "Ask a trainer to stand at the side and check your plank line — it should never break.",
      },
      {
        name: "Dumbbell Romanian Deadlift (RDL)",
        muscles: "Hamstrings, Glutes",
        secondary: "Erector Spinae, Grip",
        equipment: "Dumbbells (light — prioritise feel)",
        sets: "3",
        reps: "10–12 · Rest 75 sec",
        how: "Stand tall, soft bend in the knees. Push hips back while keeping the dumbbells close to your legs — you should feel a stretch in the hamstrings at the bottom. Drive hips forward to stand and squeeze glutes hard at the top.",
        mistakes: "Rounding the lower back, squatting the weight up, letting dumbbells drift away from the body.",
        visual: "Use a hip-hinge diagram. A trainer can place a dowel rod on your spine to feel neutral position.",
      },
      {
        name: "Seated Cable Row (or Band Row)",
        muscles: "Lats, Rhomboids, Mid-Traps",
        secondary: "Biceps, Rear Deltoids",
        equipment: "Cable machine (D-handle) or resistance band",
        sets: "3",
        reps: "12–15 · Rest 60 sec",
        how: "Sit upright, depress the shoulder blades first, then pull the handle to your lower ribs. Hold for 1 sec at the end range. Return slowly — control the cable back.",
        mistakes: "Rocking the torso back to assist, shrugging at the top, rushing the eccentric (return).",
        visual: "Ask a trainer to cue 'pull your elbows into your back pockets' — it fixes most mistakes instantly.",
      },
      {
        name: "Dumbbell Shoulder Press (Seated)",
        muscles: "Anterior & Medial Deltoids",
        secondary: "Triceps, Upper Traps, Core",
        equipment: "Dumbbells + adjustable bench at 90°",
        sets: "3",
        reps: "10–12 · Rest 60 sec",
        how: "Sit back against the pad, dumbbells at ear height, palms facing forward. Press straight up, stop just before the arms lock out. Lower slowly to the starting position.",
        mistakes: "Over-arching the lower back, leaning back excessively, bouncing the weight off the shoulder.",
        visual: "Check that your wrists stay stacked directly over your elbows throughout the press.",
      },
      {
        name: "Box Step-Up",
        muscles: "Quadriceps, Glutes",
        secondary: "Hamstrings, Core, Balance",
        equipment: "Plyo box or step (20–30 cm)",
        sets: "3",
        reps: "10 / leg · Rest 60 sec",
        how: "Place the entire foot on the box, drive through that heel to stand up fully. Step down under control — don't drop. Add light dumbbells once the movement feels stable.",
        mistakes: "Pushing off the back foot, stepping down too fast, knee diving inward.",
        visual: "Do the first set without weight and film from the front. Your knee should track over your 2nd toe.",
      },
      {
        name: "Dumbbell Bicep Curl",
        muscles: "Biceps Brachii",
        secondary: "Brachialis, Forearm Flexors",
        equipment: "Dumbbells (light — full range of motion first)",
        sets: "3",
        reps: "12–15 · Rest 45 sec",
        how: "Stand tall, elbows pinned to your sides. Curl both dumbbells up with a supinated grip (palms up). Squeeze at the top, then lower slowly over 2–3 seconds.",
        mistakes: "Swinging the body to lift, partial range (never going fully down), wrists bending.",
        visual: "Stand with your back against a wall — this forces strict form and prevents swinging.",
      },
      {
        name: "Tricep Dip (Bench)",
        muscles: "Triceps Brachii",
        secondary: "Anterior Deltoids, Chest",
        equipment: "Flat bench",
        sets: "3",
        reps: "10–15 · Rest 45 sec",
        how: "Grip the edge of a bench behind you, legs straight or slightly bent. Lower until elbows are at 90°, keeping shoulders down and chest open. Press back up through the palms.",
        mistakes: "Shoulders rising up toward the ears, dipping too deep past 90°, flaring elbows out wide.",
        visual: "Keep a small gap between your back and the bench on the way down — it protects the shoulder joint.",
      },
      {
        name: "Dead Bug",
        muscles: "Deep Core (Transverse Abdominis)",
        secondary: "Hip Flexors, Lower Back Stabilisers",
        equipment: "Mat",
        sets: "3",
        reps: "8 / side · Rest 60 sec",
        how: "Lie on your back. Arms point to the ceiling, knees bent at 90°. Press your lower back hard into the mat — hold that. Slowly extend opposite arm and leg toward the floor without losing the back contact. Return and switch.",
        mistakes: "Lower back arching away from the mat, holding the breath, moving too fast.",
        visual: "Ask a trainer to slide a hand under your lower back — you should feel constant pressure throughout.",
      },
      {
        name: "Plank Hold",
        muscles: "Core, Transverse Abdominis, Glutes",
        secondary: "Shoulders, Hip Flexors",
        equipment: "Mat",
        sets: "3",
        reps: "20–40 sec hold · Rest 45 sec",
        how: "Forearms on the mat, elbows under shoulders. Push the floor away, squeeze glutes, brace abs as if bracing for a punch. Keep hips level — no sagging or piking.",
        mistakes: "Hips too high or too low, holding the breath, head dropping or craning up.",
        visual: "Place a water bottle on your lower back — it should stay flat and not fall off for the whole hold.",
      },
    ],
  },
  {
    level: 2,
    badge: "Beginner+",
    title: "Full-Body Conditioning",
    phase: "Phase 1",
    frequency: "3× / week",
    goal: "Increase work capacity, coordination, and basic load tolerance.",
    notes: "Add load only when all reps are clean for 2 sessions.",
    focus: "More volume, better control, basic compound lifts.",
    exercises: [
      {
        name: "Split Squat",
        muscles: "Quadriceps, Glutes",
        secondary: "Hamstrings, Core, Calves",
        equipment: "Dumbbells optional",
        sets: "3",
        reps: "10 / leg",
        how: "Set one foot forward, lower straight down, and press through the front heel.",
        mistakes: "Leaning too far forward, front heel rising, bouncing.",
        visual: "Use a lunge mechanics chart and side-view trainer demo.",
      },
      {
        name: "Single-Arm Row",
        muscles: "Lats, Rhomboids",
        secondary: "Rear Delts, Biceps, Core",
        equipment: "Dumbbell + bench",
        sets: "3 / side",
        reps: "10–12",
        how: "Brace the torso and row toward the hip, not the shoulder.",
        mistakes: "Torso rotation, yanking with momentum.",
        visual: "Study a back anatomy diagram showing scapular retraction.",
      },
      {
        name: "Dumbbell Overhead Press",
        muscles: "Shoulders",
        secondary: "Triceps, Upper Chest, Core",
        equipment: "Dumbbells",
        sets: "3",
        reps: "10–12",
        how: "Press overhead in a controlled line with ribs down.",
        mistakes: "Over-arching the lower back, pressing forward.",
        visual: "Check an overhead press setup guide.",
      },
      {
        name: "Bent-Over Row",
        muscles: "Lats, Mid-Traps, Rhomboids",
        secondary: "Biceps, Posterior Chain",
        equipment: "Dumbbells",
        sets: "3",
        reps: "10",
        how: "Hinge to about 45°, row to the lower ribs, and keep the hinge angle fixed.",
        mistakes: "Swinging, standing up to assist.",
        visual: "Ask a trainer to observe your spine line from the side.",
      },
      {
        name: "Glute Bridge",
        muscles: "Glutes",
        secondary: "Hamstrings, Core",
        equipment: "Mat",
        sets: "3",
        reps: "15",
        how: "Drive hips up by squeezing glutes until knees-to-shoulders form one line.",
        mistakes: "Partial lift, no glute squeeze, knees flaring.",
        visual: "Use a glute activation diagram to feel the difference.",
      },
    ],
  },
  {
    level: 3,
    badge: "Intermediate",
    title: "Upper / Lower Split",
    phase: "Phase 2",
    frequency: "4× / week",
    goal: "Introduce split training with targeted hypertrophy and strength volume.",
    notes: "Rest 60–90 sec for isolation, 2–3 min for compounds.",
    focus: "Upper body one day, lower body the next.",
    exercises: [
      {
        name: "Bench Press",
        muscles: "Chest",
        secondary: "Triceps, Front Delts",
        equipment: "Barbell + bench",
        sets: "4",
        reps: "8–10",
        how: "Set the upper back, plant the feet, and press with forearms vertical.",
        mistakes: "Bouncing the bar, losing upper-back tension.",
        visual: "Study a bench press muscle map before loading.",
      },
      {
        name: "Lat Pulldown",
        muscles: "Lats",
        secondary: "Biceps, Rear Delts, Rhomboids",
        equipment: "Cable machine",
        sets: "4",
        reps: "10–12",
        how: "Depress the shoulder blades first, then drive the elbows down.",
        mistakes: "Leaning back too much, pulling behind the neck.",
        visual: "Ask for a scapular depression demo.",
      },
      {
        name: "Leg Press",
        muscles: "Quads, Glutes",
        secondary: "Hamstrings",
        equipment: "Leg press machine",
        sets: "4",
        reps: "10–12",
        how: "Lower under control and drive through mid-foot without rounding the pelvis.",
        mistakes: "Locking knees hard, pelvis curling.",
        visual: "Check the machine setup chart for seat position.",
      },
      {
        name: "Seated Cable Row",
        muscles: "Mid-Back, Lats",
        secondary: "Biceps, Rear Delts",
        equipment: "Cable machine",
        sets: "4",
        reps: "10–12",
        how: "Pull toward the lower ribs and hold the squeeze briefly.",
        mistakes: "Rocking the torso, shrugging the shoulders.",
        visual: "Use a cable row setup guide.",
      },
    ],
  },
  {
    level: 4,
    badge: "Intermediate+",
    title: "Push / Pull / Legs",
    phase: "Phase 2",
    frequency: "5× / week",
    goal: "Higher training frequency per muscle group with focused volume.",
    notes: "Keep sessions dense. Prioritise recovery and logging.",
    focus: "Push, pull, and legs repeated through the week.",
    exercises: [
      {
        name: "Incline Dumbbell Press",
        muscles: "Upper Chest",
        secondary: "Front Delts, Triceps",
        equipment: "Dumbbells + incline bench",
        sets: "4",
        reps: "8–12",
        how: "Retract the shoulder blades, lower to the upper-chest line, and press without losing tension.",
        mistakes: "Elbows flaring too hard, over-arching.",
        visual: "Compare incline vs flat press angle and muscle bias.",
      },
      {
        name: "Pull-Up / Assisted Pull-Up",
        muscles: "Lats",
        secondary: "Biceps, Rear Delts, Lower Traps",
        equipment: "Pull-up bar / assisted machine",
        sets: "4",
        reps: "6–10",
        how: "Start from a dead hang, depress the shoulders, and pull the chin over the bar.",
        mistakes: "Kipping, partial range.",
        visual: "Watch the scapular initiation in slow motion.",
      },
      {
        name: "Lateral Raise",
        muscles: "Medial Delts",
        secondary: "Supraspinatus, Upper Traps",
        equipment: "Dumbbells",
        sets: "4",
        reps: "15–20",
        how: "Lead with elbows and raise to shoulder height with control.",
        mistakes: "Shrugging, swinging, going too high.",
        visual: "Study a shoulder anatomy diagram.",
      },
      {
        name: "Romanian Deadlift",
        muscles: "Hamstrings, Glutes",
        secondary: "Erectors, Grip",
        equipment: "Barbell",
        sets: "4",
        reps: "8",
        how: "Hinge back, keep the bar close, and drive hips forward to finish.",
        mistakes: "Rounding, bending knees too much.",
        visual: "Check a hip-hinge biomechanics chart.",
      },
    ],
  },
  {
    level: 5,
    badge: "Advanced",
    title: "5-Day Split + Conditioning",
    phase: "Phase 2–3",
    frequency: "5× / week + conditioning",
    goal: "Maximise strength, size, and athletic conditioning.",
    notes: "Use progressive overload and log every lift.",
    focus: "Dedicated days for chest, back, arms, shoulders, legs, and conditioning.",
    exercises: [
      {
        name: "Barbell Back Squat",
        muscles: "Quads, Glutes",
        secondary: "Core, Adductors, Erectors",
        equipment: "Barbell + squat rack",
        sets: "4",
        reps: "5–6",
        how: "Brace deeply, descend with control, and stand with full-body tension.",
        mistakes: "Knees caving, losing brace, partial depth.",
        visual: "Film heavy sessions from the side and front.",
      },
      {
        name: "Barbell Row",
        muscles: "Lats, Rhomboids",
        secondary: "Biceps, Erectors, Core",
        equipment: "Barbell",
        sets: "4",
        reps: "6–8",
        how: "Hinge to about 45°, pull to the lower sternum, and keep the bar path horizontal.",
        mistakes: "Standing up to assist, bouncing plates.",
        visual: "Ask a trainer to watch torso angle and elbow path.",
      },
      {
        name: "Overhead Press",
        muscles: "Deltoids",
        secondary: "Triceps, Upper Traps, Core",
        equipment: "Barbell",
        sets: "4",
        reps: "6–8",
        how: "Press straight up with wrists stacked over elbows and ribs down.",
        mistakes: "Back arching, bar drifting forward.",
        visual: "Review bar path and wrist alignment.",
      },
      {
        name: "HIIT / Sled / Bike Work",
        muscles: "Cardiovascular System",
        secondary: "Lower Body, Core",
        equipment: "Treadmill / bike / sled",
        sets: "8–12 intervals",
        reps: "20–45 sec work",
        how: "Use short, intense bursts with planned recovery intervals.",
        mistakes: "Skipping warm-up, overloading speed or resistance.",
        visual: "Ask a trainer to tailor the interval protocol.",
      },
    ],
  },
];

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="border border-gray-200 bg-white overflow-hidden"
    >
      <details className="group">
        <summary className="list-none cursor-pointer p-4 flex items-start justify-between gap-4 hover:bg-[#f8fbf3]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shrink-0">{index + 1}</span>
              <h4 className="font-black text-gray-900">{exercise.name}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5">{exercise.muscles}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5">{exercise.sets} × {exercise.reps}</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-gray-100 p-4 grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Target</p>
            <p className="text-sm text-gray-700"><span className="font-black text-gray-900">Primary:</span> {exercise.muscles}</p>
            <p className="text-sm text-gray-700 mt-1"><span className="font-black text-gray-900">Secondary:</span> {exercise.secondary}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Equipment</p>
            <p className="text-sm text-gray-700">{exercise.equipment}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Execution</p>
            <p className="text-sm text-gray-700">{exercise.how}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Common Mistakes</p>
            <p className="text-sm text-red-500">{exercise.mistakes}</p>
          </div>
          <div className="md:col-span-2 bg-[#f8fbf3] border border-primary/15 p-4 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">{exercise.visual}</p>
          </div>
        </div>
      </details>
    </motion.div>
  );
}

export default function GuidePage() {
  const [active, setActive] = useState(1);
  const level = useMemo(() => LEVELS.find((item) => item.level === active) ?? LEVELS[0], [active]);
  const visibleLevels = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-gray-950 text-white px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Dotfit Fitness
        </a>
        <div className="flex items-center gap-3 text-xs font-black">
          <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#25D366]">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <a href="tel:+919527237213" className="flex items-center gap-1.5 text-white/60 hover:text-white">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        </div>
      </div>

      <section className="bg-gray-950 text-white py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl grid md:grid-cols-[1.4fr_.8fr] gap-10 items-end">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="text-primary font-black text-xs uppercase tracking-widest">Dotfit Fitness · Baner, Pune</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-4">
              Fitness<br /><span className="text-primary">Progression</span><br />Guide
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42 }}
              className="text-white/60 font-medium max-w-xl leading-relaxed">
              A structured five-level path from foundational movement to advanced split training — designed by Dotfit's K11-certified coaches for every fitness level.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Layers className="w-4 h-4" />, label: "5 Levels" },
              { icon: <Target className="w-4 h-4" />, label: "40+ Exercises" },
              { icon: <Shield className="w-4 h-4" />, label: "K11 Certified" },
              { icon: <Zap className="w-4 h-4" />, label: "Compact Layout" },
            ].map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
                className="bg-white/5 border border-white/10 p-3 flex items-center gap-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:border-primary/40 transition-all">
                <span className="text-primary">{item.icon}</span>{item.label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-3 flex items-center gap-2 overflow-x-auto">
          {visibleLevels.map((n) => (
            <button
              key={n}
              onClick={() => setActive(n)}
              className={`shrink-0 px-4 py-2 text-xs font-black uppercase tracking-widest border transition-all ${active === n ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"}`}
            >
              Level {n}
            </button>
          ))}
          <a href="/#contact" className="ml-auto shrink-0 px-4 py-2 text-xs font-black uppercase tracking-widest bg-gray-950 text-white">
            Start Free Trial
          </a>
        </div>
      </div>

      <section className="bg-[#f8fbf3] border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-6 md:py-8 grid md:grid-cols-[1fr_auto] gap-4 md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{level.phase}</span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-white border border-gray-200 text-gray-500">{level.badge}</span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-500">{level.frequency}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight">{level.title}</h2>
            <p className="text-sm text-gray-600 mt-2 max-w-2xl">{level.goal} {level.notes}</p>
          </div>
            <div className="text-sm font-bold text-gray-500 bg-white border border-gray-200 px-4 py-3">
            Viewing Level {active} by default
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 max-w-5xl py-6 md:py-8">
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {level.exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.name} exercise={exercise} index={index} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 bg-gray-950 text-white p-4 md:p-5">
          <div>
            <p className="text-primary font-black text-xs uppercase tracking-widest mb-1">Quick Switch</p>
            <p className="text-sm text-white/70">Use the tabs above to switch levels without scrolling through a long page.</p>
          </div>
          <a href="/#contact" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest">
            Start Now <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
