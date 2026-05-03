import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, ChevronRight, ArrowRight, Phone, MessageCircle,
  Target, Layers, BookOpen, Shield, Zap, Activity,
  ChevronDown, ChevronUp, ArrowLeft,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Exercise {
  name: string;
  muscles: string;
  secondary: string;
  equipment: string;
  sets: string;
  reps: string;
  how: string;
  mistakes: string;
  visual: string;
}

interface Split {
  group: string;
  exercises: Exercise[];
}

interface Level {
  level: number;
  badge: string;
  title: string;
  phase: string;
  frequency: string;
  goal: string;
  notes: string;
  splits?: Split[];
  exercises?: Exercise[];
}

/* ─── Exercise data ───────────────────────────────────────────────────────── */
const LEVELS: Level[] = [
  {
    level: 1,
    badge: "Beginner",
    title: "Foundational Full-Body Integration",
    phase: "Phase 1",
    frequency: "2× / week",
    goal: "Learn basic movement patterns and build initial neuromuscular coordination.",
    notes: "Rest 60–90 sec between sets. Focus entirely on technique — not load. Stop immediately if a movement causes joint pain.",
    exercises: [
      {
        name: "Goblet Squat",
        muscles: "Quadriceps, Glutes",
        secondary: "Core, Upper Back",
        equipment: "Dumbbell or Kettlebell",
        sets: "3",
        reps: "12–15",
        how: "Hold the weight vertically close to your chest with both hands cupped underneath. Set your feet shoulder-width apart, toes turned slightly out. Inhale, brace your core, and sit your hips down and back between your heels — not forward. Keep your chest tall and your elbows inside your knees at depth. Drive through the entire foot to stand, exhaling at the top.",
        mistakes: "Heels rising off the floor (lack of ankle mobility), chest collapsing forward, knees caving inward.",
        visual: "Study a goblet squat anatomy diagram highlighting quad and glute recruitment, then ask a Dotfit trainer to demonstrate the depth and torso angle live.",
      },
      {
        name: "Incline Push-Up",
        muscles: "Chest (pectoralis major)",
        secondary: "Triceps, Anterior Deltoids, Core",
        equipment: "Bodyweight — bench, box or bar at waist height",
        sets: "3",
        reps: "10–15",
        how: "Place hands slightly wider than shoulder-width on an elevated surface, fingers pointing forward. Create a straight line from head to heels — no sagging or piked hips. Inhale as you lower slowly (3 sec), elbows at ~45° from torso. Press back explosively without locking elbows hard at the top.",
        mistakes: "Hips sagging or piking, elbows flaring perpendicular to the body, shrugging the shoulders up toward ears.",
        visual: "Find a push-up muscle engagement diagram and ask a trainer to check your plank position and elbow angle before starting.",
      },
      {
        name: "Dumbbell Romanian Deadlift",
        muscles: "Hamstrings, Glutes",
        secondary: "Lower Back (erector spinae), Grip",
        equipment: "Dumbbells (pair)",
        sets: "3",
        reps: "10–12",
        how: "Stand holding dumbbells at your thighs, soft bend in knees. Hinge at the hips by pushing them backward, keeping the spine in a neutral straight line. Lower the dumbbells close to your legs until you feel a stretch in the hamstrings (usually mid-shin level). Reverse by squeezing the glutes and driving the hips forward — not by pulling with the lower back.",
        mistakes: "Rounding the lower back, turning it into a squat by bending knees too much, letting dumbbells drift away from the legs.",
        visual: "Study a hip-hinge movement diagram and ask your trainer to put a hand on your lower back so you can feel the neutral spine position.",
      },
      {
        name: "Band Pull-Apart",
        muscles: "Rear Deltoids, Rhomboids",
        secondary: "Rotator Cuff, Lower Traps",
        equipment: "Resistance Band",
        sets: "3",
        reps: "15–20",
        how: "Hold a light resistance band in front of you with arms extended at shoulder height, grip just outside shoulder width. Keeping arms nearly straight, pull the band apart toward your chest by squeezing your shoulder blades together. Control the return — never let the band snap back.",
        mistakes: "Shrugging the shoulders upward, using a band with too much resistance, not completing the full range of motion.",
        visual: "Check a rear delt and rhomboid anatomy diagram — the goal is scapular retraction, not just arm pulling.",
      },
      {
        name: "Dead Bug",
        muscles: "Transverse Abdominis (deep core)",
        secondary: "Hip Flexors, Lower Back Stabilisers",
        equipment: "Bodyweight — mat",
        sets: "3",
        reps: "8 per side",
        how: "Lie on your back with arms straight toward the ceiling and knees bent at 90°. Press your lower back firmly into the mat (critical). Simultaneously lower the opposite arm and leg toward the floor on an inhale — stop before the lower back lifts. Return under control and switch sides.",
        mistakes: "Lower back arching off the floor, holding the breath, moving too fast.",
        visual: "Ask a trainer to place one hand under your lower back so you feel when the core bracing breaks.",
      },
    ],
  },
  {
    level: 2,
    badge: "Beginner+",
    title: "Full-Body Conditioning",
    phase: "Phase 1",
    frequency: "3× / week",
    goal: "Increase work capacity, coordination, and load tolerance. Add basic compound lifts.",
    notes: "Increase load by 2.5–5% when you can complete all reps with perfect form across all sets for 2 consecutive sessions. Rest 60–90 sec.",
    exercises: [
      {
        name: "Dumbbell Split Squat",
        muscles: "Quadriceps, Glutes",
        secondary: "Hamstrings, Core, Calves",
        equipment: "Dumbbells (optional) + clear floor space",
        sets: "3",
        reps: "10 per leg",
        how: "Set one foot roughly 70–80 cm in front of the other. Keep your torso upright and your front shin vertical. Lower straight down by bending both knees simultaneously until the back knee hovers just above the floor. Press through the front heel and middle foot to return. Add dumbbells at your sides when bodyweight is easy.",
        mistakes: "Leaning far forward, front heel rising, dropping too fast without control.",
        visual: "Use a split squat stride-length diagram. Ask a Dotfit trainer to mark the correct foot position on the floor for you.",
      },
      {
        name: "Single-Arm Dumbbell Row",
        muscles: "Latissimus Dorsi, Rhomboids",
        secondary: "Rear Deltoid, Biceps, Core",
        equipment: "Dumbbell + bench",
        sets: "3 per side",
        reps: "10–12",
        how: "Place one knee and hand on a bench, torso parallel to the floor, spine neutral. Let the dumbbell hang from the working arm. Pull it toward your hip (not your shoulder) by driving the elbow straight back — imagine putting the dumbbell in your back pocket. Pause at the top, then lower under control.",
        mistakes: "Rotating the torso to assist the lift (cheating), rowing toward the shoulder instead of the hip, rushing the eccentric.",
        visual: "Study a back anatomy diagram showing scapular depression and retraction. Ask your trainer to check torso rotation.",
      },
      {
        name: "Dumbbell Overhead Press",
        muscles: "Anterior and Medial Deltoids",
        secondary: "Triceps, Upper Chest, Core Stabilisers",
        equipment: "Dumbbells",
        sets: "3",
        reps: "10–12",
        how: "Sit or stand holding dumbbells at shoulder height, palms facing forward. Brace your core and pull your ribs down (do not over-arch). Press straight overhead until biceps are near your ears. Lower under control over 2–3 seconds. Never press with a hyper-extended lower back.",
        mistakes: "Over-arching the lumbar spine, pressing the weight forward rather than overhead, shrugging the traps at the top.",
        visual: "Check an overhead press mechanics diagram — rib position and ear alignment are the key checkpoints.",
      },
      {
        name: "Dumbbell Bent-Over Row",
        muscles: "Lats, Mid-Traps, Rhomboids",
        secondary: "Biceps, Posterior Chain",
        equipment: "Dumbbells (pair)",
        sets: "3",
        reps: "10",
        how: "Hinge to roughly 45°, dumbbells hanging below shoulders, neutral grip. Brace the core hard. Row both dumbbells toward your lower ribs by driving elbows back and squeezing shoulder blades together. Control the descent. Keep the hinge angle constant — do not stand up to assist the row.",
        mistakes: "Swinging the torso, standing up during the row, letting the dumbbells drift wide.",
        visual: "Ask a trainer to observe your back position from the side — the spine should be in one straight line throughout.",
      },
      {
        name: "Glute Bridge",
        muscles: "Glutes (gluteus maximus)",
        secondary: "Hamstrings, Core, Hip Flexors (stretch)",
        equipment: "Bodyweight — mat",
        sets: "3",
        reps: "15",
        how: "Lie on your back, knees bent at ~90°, feet flat and hip-width apart. Press your arms into the floor, brace your core, then drive your heels down and squeeze your glutes to raise your hips until you form a straight line from knees to shoulders. Pause 2 seconds at the top squeezing hard. Lower slowly.",
        mistakes: "Only raising the hips partway, not squeezing the glutes at the top, flaring the knees outward.",
        visual: "Check a glute activation diagram — many beginners activate hamstrings more than glutes. Ask a trainer to cue the correct feel.",
      },
    ],
  },
  {
    level: 3,
    badge: "Intermediate",
    title: "Upper / Lower Split",
    phase: "Phase 2",
    frequency: "4× / week (2 upper + 2 lower)",
    goal: "Introduce split training with targeted volume for hypertrophy and strength.",
    notes: "Rest 60–90 sec for isolation, 2–3 min for compound lifts. Track weights in a notebook or app every session.",
    splits: [
      {
        group: "Upper Body",
        exercises: [
          {
            name: "Barbell Bench Press",
            muscles: "Chest (pectoralis major)",
            secondary: "Triceps, Anterior Deltoids",
            equipment: "Barbell + bench",
            sets: "4",
            reps: "8–10",
            how: "Set up with shoulder blades squeezed and upper back slightly arched (not the lower back). Feet flat on the floor. Grip just outside shoulder width. Lower the bar in a slight arc to your mid-chest over 3 seconds. Press explosively, keeping forearms vertical throughout.",
            mistakes: "Bouncing the bar off the chest, feet leaving the floor, losing upper back tension, elbows flaring at 90°.",
            visual: "Study a bench press muscle map and ask a senior trainer at Dotfit for a setup check before loading the barbell.",
          },
          {
            name: "Lat Pulldown",
            muscles: "Latissimus Dorsi",
            secondary: "Biceps, Rear Deltoids, Rhomboids",
            equipment: "Cable machine / lat pulldown machine",
            sets: "4",
            reps: "10–12",
            how: "Grip the bar slightly wider than shoulder width. Lean back 10–15°, pull shoulder blades down first (depress the scapula), then drive elbows toward the floor and pull the bar to your upper chest. Control the bar back to full arm extension — do not let it snap up.",
            mistakes: "Leaning back excessively to turn it into a row, pulling behind the neck, using momentum.",
            visual: "Ask the trainer to show you scapular depression with just bodyweight before you use the cable machine.",
          },
          {
            name: "Seated Dumbbell Shoulder Press",
            muscles: "Anterior and Medial Deltoids",
            secondary: "Triceps, Upper Trapezius",
            equipment: "Dumbbells + adjustable bench (90°)",
            sets: "3",
            reps: "10–12",
            how: "Set the bench fully upright. Start with dumbbells at ear height, palms facing forward or rotating to face inward at the top. Press in a controlled arc until arms are almost fully extended. Lower under control over 2–3 seconds.",
            mistakes: "Arching the back heavily off the seat, pressing forward rather than directly overhead.",
            visual: "Check a shoulder anatomy diagram and confirm the press path from ear-level to overhead with a trainer.",
          },
          {
            name: "Cable Tricep Pushdown",
            muscles: "Triceps (all three heads)",
            secondary: "Anconeus, Forearms",
            equipment: "Cable machine + straight bar or rope",
            sets: "3",
            reps: "12–15",
            how: "Stand close to the cable stack, grip the bar with palms down (or rope with palms facing each other). Tuck your elbows firmly into your sides and keep them there. Push down until arms are fully extended, spreading the rope slightly if using one. Control the return slowly to 90°.",
            mistakes: "Letting the elbows drift forward and backward, leaning over the cable, not fully extending at the bottom.",
            visual: "Use a tricep anatomy diagram — the key is keeping the humerus fixed and only the forearm moving.",
          },
          {
            name: "Dumbbell Bicep Curl",
            muscles: "Biceps Brachii (long and short head)",
            secondary: "Brachialis, Brachioradialis",
            equipment: "Dumbbells",
            sets: "3",
            reps: "12",
            how: "Stand with dumbbells at your sides, palms forward. Keep your elbows pinned to your sides and curl by supinating (rotating palms up) as you lift. Squeeze at the top for 1 second. Lower over 2–3 seconds — the eccentric is where most growth happens.",
            mistakes: "Swinging the body, using momentum, letting elbows drift forward, not completing the full range of motion.",
            visual: "Ask a trainer to place a foam roller between your arms and ribs — if it falls, your elbows are drifting.",
          },
        ],
      },
      {
        group: "Lower Body",
        exercises: [
          {
            name: "Leg Press",
            muscles: "Quadriceps, Glutes",
            secondary: "Hamstrings, Calves",
            equipment: "Leg press machine",
            sets: "4",
            reps: "10–12",
            how: "Set the seat so your knees are at 90° when the foot plate is in. Place feet hip-width, mid-plate. Lower the platform slowly until your thighs are near parallel to the platform — no further if your lower back rounds. Drive through the entire foot to extend. Do not lock out the knees.",
            mistakes: "Allowing the lower back to round off the seat, pressing only with the toes, locking the knees hard.",
            visual: "Review the machine setup poster and ask a trainer to confirm your foot position and ROM depth.",
          },
          {
            name: "Leg Curl (Lying or Seated)",
            muscles: "Hamstrings (biceps femoris, semimembranosus, semitendinosus)",
            secondary: "Gastrocnemius, Popliteus",
            equipment: "Lying or seated leg curl machine",
            sets: "3",
            reps: "12–15",
            how: "Position the pad just above the Achilles tendon. Drive the heels toward your glutes as far as the machine allows. Pause at peak contraction, then control the eccentric for 2–3 seconds. Keep hips pressed into the bench throughout.",
            mistakes: "Hips rising off the bench, using momentum, partial range of motion.",
            visual: "Ask the trainer to set up the machine correctly — pad height and seat position vary significantly by machine model.",
          },
          {
            name: "Leg Extension",
            muscles: "Quadriceps (rectus femoris, vastus group)",
            secondary: "None significant",
            equipment: "Leg extension machine",
            sets: "3",
            reps: "15",
            how: "Adjust the seat so your knee is aligned with the machine pivot point and the pad rests on the lower shin. Extend both legs until near-straight, hold 1 second at the top, then lower over 2–3 seconds. Never let the weight stack crash.",
            mistakes: "Using too much weight with a partial range, the weight plate crashing down on each rep.",
            visual: "Check the machine alignment diagram — knee-to-pivot alignment is critical to avoid discomfort.",
          },
          {
            name: "Romanian Deadlift (Barbell)",
            muscles: "Hamstrings, Glutes",
            secondary: "Erector Spinae, Grip",
            equipment: "Barbell",
            sets: "3",
            reps: "10",
            how: "Hold the barbell with a double overhand grip just outside your hips. Keep a neutral spine. Push your hips straight back, dragging the bar down your thighs until you feel a strong hamstring stretch. Drive the hips forward powerfully to return, squeezing the glutes at the top.",
            mistakes: "Rounding the upper or lower back, bending the knees too much, letting the bar drift from the legs.",
            visual: "Have a trainer watch from the side — the bar should stay within 2 cm of your thighs through the entire movement.",
          },
          {
            name: "Standing Calf Raise",
            muscles: "Gastrocnemius",
            secondary: "Soleus",
            equipment: "Calf raise machine or Smith machine / bodyweight on a step",
            sets: "4",
            reps: "15–20",
            how: "Place the balls of your feet on an elevated edge. Start with heels hanging below the platform. Rise up as high as possible onto your toes, pause 1 second, then lower until you feel a full stretch in the calf. Do not bounce at the bottom.",
            mistakes: "Partial range (not fully stretching at the bottom), excessive bouncing, moving too fast.",
            visual: "Check a calf anatomy diagram — the full stretch position at the bottom activates more muscle fibres.",
          },
        ],
      },
    ],
  },
  {
    level: 4,
    badge: "Intermediate+",
    title: "Push / Pull / Legs Split",
    phase: "Phase 2",
    frequency: "5× / week (Push · Pull · Legs · repeat)",
    goal: "Higher training frequency per muscle group with targeted volume for hypertrophy.",
    notes: "Track progressive overload weekly. Prioritise sleep and protein (1.6–2.2g/kg/day) for recovery. Use a training log.",
    splits: [
      {
        group: "Push (Chest · Shoulders · Triceps)",
        exercises: [
          {
            name: "Incline Dumbbell Press",
            muscles: "Upper Chest (clavicular head of pectoralis major)",
            secondary: "Anterior Deltoids, Triceps",
            equipment: "Dumbbells + incline bench (30–45°)",
            sets: "4",
            reps: "8–12",
            how: "Retract and depress shoulder blades into the bench. Start with dumbbells at shoulder level, elbows at ~75° from your torso. Lower under control to the upper chest line, then press in a slight arc until dumbbells are nearly touching above your clavicle. Do not bang them together — maintain tension.",
            mistakes: "Flaring elbows to 90° (shoulder impingement risk), over-arching the lower back off the bench, lowering too fast.",
            visual: "Check an upper-chest anatomy diagram. Compare the incline press muscle map to flat press to understand why the angle matters.",
          },
          {
            name: "Cable Chest Fly",
            muscles: "Chest (pectoralis major — stretch emphasis)",
            secondary: "Anterior Deltoids, Serratus Anterior",
            equipment: "Cable machine (dual cable or crossover station)",
            sets: "3",
            reps: "12–15",
            how: "Set cables at shoulder height. Stand in the middle, slight forward lean, soft elbows with a slight bend that never changes. Bring handles together in a wide hugging arc in front of the chest. Squeeze the pecs hard at the meeting point, then open slowly with full control. Think of hugging a tree.",
            mistakes: "Turning it into a press by extending the elbows, using too much weight and losing the arc, cables set too high or too low.",
            visual: "Ask a trainer to demonstrate the constant-elbow-angle principle — this is the most common error with cable flyes.",
          },
          {
            name: "Lateral Raise",
            muscles: "Medial Deltoids",
            secondary: "Supraspinatus, Upper Traps",
            equipment: "Dumbbells or cable machine",
            sets: "4",
            reps: "15–20",
            how: "Hold dumbbells at your sides, slight bend in elbows. Lead with your elbows and raise arms out to the side to shoulder height. Pinky finger slightly higher than thumb (external rotation). Lower over 3 seconds. For cables: unilateral raises allow a constant resistance curve.",
            mistakes: "Shrugging the traps to help lift, using momentum and swinging, going above shoulder height.",
            visual: "Study a shoulder anatomy diagram — the key is medial delt isolation without trap involvement.",
          },
          {
            name: "Cable Tricep Rope Pushdown",
            muscles: "Triceps (lateral head emphasis)",
            secondary: "Anconeus",
            equipment: "Cable machine + rope attachment",
            sets: "3",
            reps: "12–15",
            how: "Grip the rope with palms facing inward, set cable high. Tuck elbows to sides. Push down and spread the rope ends apart at the bottom to maximise tricep peak contraction. Resist the return slowly.",
            mistakes: "Letting elbows drift forward, not spreading the rope at the bottom, locking out too forcefully.",
            visual: "Ask a trainer to demonstrate the rope spread — this increases lat head and long head activation.",
          },
          {
            name: "Overhead Dumbbell Tricep Extension",
            muscles: "Triceps (long head emphasis)",
            secondary: "Anconeus",
            equipment: "Single dumbbell (both hands) or pair",
            sets: "3",
            reps: "12",
            how: "Hold one dumbbell with both hands overhead in a diamond grip under the inner plate. Elbows point toward the ceiling. Lower the dumbbell behind your head by bending only at the elbows — upper arms stay fixed vertical. Extend back to the top.",
            mistakes: "Letting elbows flare out wide, moving the upper arms, using too heavy a weight that causes back arching.",
            visual: "Check a long-head tricep anatomy diagram — overhead extension is the only exercise that fully stretches this head.",
          },
        ],
      },
      {
        group: "Pull (Back · Biceps)",
        exercises: [
          {
            name: "Pull-Up / Assisted Pull-Up",
            muscles: "Latissimus Dorsi (wide, flared back)",
            secondary: "Biceps, Rear Delts, Rhomboids, Lower Traps",
            equipment: "Pull-up bar or assisted pull-up machine",
            sets: "4",
            reps: "6–10 (add assistance if needed)",
            how: "Grip just outside shoulder width, palms away. Start from a dead hang with arms fully extended. Initiate by depressing the shoulder blades (pulling the shoulders down), then drive elbows toward the floor, pulling chin above the bar. Lower with full control over 3 seconds.",
            mistakes: "Kipping/using momentum, shrugging up to start (not depressing first), partial range (not reaching full hang).",
            visual: "Watch the scapular depression initiation in slow-motion trainer videos — this phase is skipped by 90% of beginners.",
          },
          {
            name: "Seated Cable Row",
            muscles: "Middle Traps, Rhomboids, Lats",
            secondary: "Rear Deltoids, Biceps, Erectors",
            equipment: "Cable machine + V-bar or wide grip",
            sets: "4",
            reps: "10–12",
            how: "Sit tall with knees slightly bent. Start by pulling the shoulder blades back and down before you begin bending the elbows. Pull the handle to your lower sternum, elbows hugging the ribs. Hold 1 second at full contraction. Extend your arms fully on the return without letting the torso rock forward.",
            mistakes: "Rocking the torso back and forward, not retracting scapulae, elbows flaring wide.",
            visual: "Check a mid-back anatomy diagram. Ask a trainer to put a hand between your shoulder blades to feel the retraction.",
          },
          {
            name: "Cable Face Pull",
            muscles: "Rear Deltoids, External Rotators (infraspinatus, teres minor)",
            secondary: "Lower Traps, Rhomboids",
            equipment: "Cable machine + rope attachment",
            sets: "3",
            reps: "15–20",
            how: "Set cable at upper-chest or eye level. Grip the rope with palms down. Step back and pull toward your face — elbows must be at or above shoulder height. At the end, rotate your hands so thumbs point behind you. This external rotation is what makes the exercise effective for shoulder health.",
            mistakes: "Elbows dropping below shoulders, turning it into a row by pulling to the chest, using too much weight.",
            visual: "This is primarily a shoulder health exercise. Ask a Dotfit trainer to demonstrate the external rotation component.",
          },
          {
            name: "Barbell Bicep Curl",
            muscles: "Biceps Brachii",
            secondary: "Brachialis, Brachioradialis",
            equipment: "Barbell or EZ-curl bar",
            sets: "3",
            reps: "10",
            how: "Stand with barbell in an underhand grip, shoulder width. Lock the elbows against the ribs. Curl up in a controlled arc, rotating the wrists slightly outward at the top. Squeeze hard at the top, then lower in 3 seconds. Use a grip that doesn't strain the wrists — EZ bar is often more comfortable.",
            mistakes: "Rocking the body backward to initiate, rushing the eccentric (lowering phase), not using full ROM.",
            visual: "Check a bicep anatomy diagram. The supination (wrist rotation) at the top significantly increases bicep peak activation.",
          },
          {
            name: "Hammer Curl",
            muscles: "Brachialis (underneath the bicep)",
            secondary: "Biceps Brachii, Brachioradialis",
            equipment: "Dumbbells",
            sets: "3",
            reps: "12",
            how: "Hold dumbbells with neutral grip (palms facing each other) throughout — no wrist rotation. Curl up, keeping elbows pinned to your sides. The neutral grip shifts emphasis to the brachialis which pushes the bicep up from underneath, adding arm thickness.",
            mistakes: "Rotating the wrists (turns it into a regular curl), swinging, partial range of motion.",
            visual: "Compare hammer curl vs standard curl diagrams — the brachialis is the key differentiator.",
          },
        ],
      },
      {
        group: "Legs (Quads · Hamstrings · Glutes · Calves)",
        exercises: [
          {
            name: "Barbell Back Squat",
            muscles: "Quadriceps, Glutes",
            secondary: "Hamstrings, Core, Adductors, Erectors",
            equipment: "Barbell + squat rack",
            sets: "4",
            reps: "6–10",
            how: "Bar rests on upper traps (high bar) or rear delts (low bar). Brace deeply with a big inhale (Valsalva). Break at the hips and knees simultaneously. Descend until thighs are at or below parallel (if mobility allows). Drive the floor away with full-body tension to stand. Exhale at the top.",
            mistakes: "Caving knees inward, forward torso lean, losing brace at the bottom, partial squat depth.",
            visual: "Ask a Dotfit trainer for a pre-loaded bar safety orientation before squatting. Watch a slow-motion squat video showing foot, knee, and hip path.",
          },
          {
            name: "Barbell Hip Thrust",
            muscles: "Glutes (gluteus maximus)",
            secondary: "Hamstrings, Core",
            equipment: "Barbell + bench + barbell pad",
            sets: "4",
            reps: "10–12",
            how: "Set a bench against a wall and sit with your upper back on it. Roll the barbell over your lap (use a thick pad). Plant feet flat, hip-width. Brace and drive hips up by squeezing your glutes until thighs are parallel to the floor. Hold 2 seconds at the top. Lower until hips are just off the floor.",
            mistakes: "Hyperextending the lower back at the top (posterior pelvic tilt not maintained), feet too far or too close.",
            visual: "Use a glute activation diagram and check hip extension mechanics before loading the barbell.",
          },
          {
            name: "Walking Lunge",
            muscles: "Glutes, Quadriceps",
            secondary: "Hamstrings, Core, Calves",
            equipment: "Dumbbells or bodyweight",
            sets: "3",
            reps: "10 per leg",
            how: "Step forward into a long lunge — front foot flat, back knee drops straight down below the hip (not forward). Push through the entire front foot and step through into the next rep. Keep the torso upright, not leaning. Hold dumbbells at your sides when ready to add load.",
            mistakes: "Short stride causing the front knee to drift far over the toes, torso collapsing forward, stepping too narrow (balance issue).",
            visual: "Ask a trainer to mark a stride-length guideline on the floor for your leg length.",
          },
          {
            name: "Seated Leg Curl",
            muscles: "Hamstrings",
            secondary: "Gastrocnemius",
            equipment: "Seated leg curl machine",
            sets: "3",
            reps: "12–15",
            how: "Adjust the machine so the upper pad rests on your thighs and the lower pad is at the ankle. Curl by driving heels toward your glutes as far as the machine permits. Pause at full contraction, then slowly extend back to the start. The seated position slightly increases hamstring stretch and activation vs. lying curl.",
            mistakes: "Hips rising off the seat, rushing the eccentric, using a weight that prevents full ROM.",
            visual: "Compare seated vs lying curl anatomy — the knee flexion angle at the hip changes how the hamstrings are loaded.",
          },
          {
            name: "Seated Calf Raise",
            muscles: "Soleus (deeper calf muscle)",
            secondary: "Gastrocnemius",
            equipment: "Seated calf raise machine",
            sets: "4",
            reps: "15",
            how: "The seated position bends the knee, which takes the gastrocnemius (two-joint muscle) mostly out of play, isolating the soleus. Place the pad on your thighs above the knees. Lower heels to a full stretch, then drive up to peak contraction. Hold 1 second at the top.",
            mistakes: "Partial range of motion (not reaching full stretch), using too heavy a load that prevents full ROM.",
            visual: "Ask a trainer to compare the standing vs seated calf raise muscle maps to understand why both are needed.",
          },
        ],
      },
    ],
  },
  {
    level: 5,
    badge: "Advanced",
    title: "5-Day Advanced Split + Conditioning",
    phase: "Phase 2–3",
    frequency: "5× / week + 1–2 conditioning sessions",
    goal: "Maximise strength, size, and athletic conditioning with a dedicated muscle-group day approach.",
    notes: "Prioritise compound lifts first each session. Add 2.5–5% load every 1–2 weeks. Track all lifts. Sleep 7–9 hours. Protein 2.0–2.2g/kg/day. Use Dotfit's nutrition consultation.",
    splits: [
      {
        group: "Day 1 — Chest",
        exercises: [
          {
            name: "Barbell Bench Press",
            muscles: "Chest (pectoralis major)",
            secondary: "Triceps, Anterior Deltoids",
            equipment: "Barbell + bench",
            sets: "4",
            reps: "6–8 (heavy)",
            how: "Use the setup from Level 3. At this stage, add a 1–2 rep max test every 4–6 weeks. Warm up thoroughly with 2–3 progressively heavier sets. Use a spotter for working sets.",
            mistakes: "Skipping the warm-up sets, neglecting scapular retraction under heavy load.",
            visual: "Video yourself from the side to review bar path and elbow position. Review with a trainer monthly.",
          },
          {
            name: "Incline Dumbbell Press",
            muscles: "Upper Chest",
            secondary: "Front Deltoids, Triceps",
            equipment: "Dumbbells + incline bench",
            sets: "4",
            reps: "8–12",
            how: "Follow Level 4 technique. At this volume, focus on a 3-second eccentric and brief pause at the chest for max hypertrophy stimulus.",
            mistakes: "Rushing the eccentric to use more weight.",
            visual: "Use slow-motion recording to check elbow flare and the depth of the lowering position.",
          },
          {
            name: "Cable Crossover / Chest Fly",
            muscles: "Chest (pectoralis major — adduction)",
            secondary: "Anterior Deltoids, Serratus Anterior",
            equipment: "Cable machine",
            sets: "3",
            reps: "12–15",
            how: "Set pulleys high for lower chest emphasis or low for upper. Maintain a constant elbow bend. Drive handles together in a converging arc and hold the squeeze 2 seconds. The cable provides constant resistance through the full range, unlike dumbbells.",
            mistakes: "Collapsing elbows (turning into a press), pulling too quickly with no pause at the contraction point.",
            visual: "Compare cable vs dumbbell fly resistance curves — cables provide peak load at mid-range (peak contraction) while dumbbells load the stretched position.",
          },
          {
            name: "Chest Dips",
            muscles: "Lower Chest, Triceps",
            secondary: "Front Deltoids",
            equipment: "Parallel bars / dip station",
            sets: "3",
            reps: "10–12",
            how: "Lean slightly forward (30°) to shift emphasis to chest over triceps. Lower until shoulders are below elbows. Do not bounce at the bottom. Press back up to near-lockout. Add weight with a dip belt when bodyweight is easy.",
            mistakes: "No forward lean (becomes a tricep dip), partial range of motion, bouncing at the bottom.",
            visual: "Ask a trainer to show you the chest dip vs tricep dip posture difference side by side.",
          },
        ],
      },
      {
        group: "Day 2 — Back",
        exercises: [
          {
            name: "Barbell Row (Pendlay or Bent-Over)",
            muscles: "Lats, Rhomboids, Middle Traps",
            secondary: "Biceps, Erectors, Core",
            equipment: "Barbell",
            sets: "4",
            reps: "6–8",
            how: "Start with the bar on the floor (Pendlay) or use the bent-over variation. Hinge to ~45–70° torso angle, bar directly under the scapulae. Brace hard and pull the bar to the lower sternum/upper navel. Keep the pulling path horizontal. Lower under control (or reset the bar on the floor for Pendlay).",
            mistakes: "Standing up to assist, pulling to the lower navel (reduces upper-back involvement), bouncing the plates off the floor.",
            visual: "Barbell row has many technical checkpoints — ask a Dotfit trainer to observe and cue your torso angle and elbow path.",
          },
          {
            name: "Pull-Up (Weighted)",
            muscles: "Latissimus Dorsi",
            secondary: "Biceps, Rear Delts, Lower Traps",
            equipment: "Pull-up bar + dip belt for added weight",
            sets: "4",
            reps: "6–8",
            how: "Add weight via a dip belt when bodyweight pull-ups are easy for 10+ reps. Focus on a slow 3-second descent each rep. Keep shoulder blades depressed and retracted even under load.",
            mistakes: "Kipping under heavy load (injury risk), not achieving full range of motion with added weight.",
            visual: "Record your pull-ups from the front to see whether the scapulae are truly depressing at the initiation.",
          },
          {
            name: "Single-Arm Dumbbell Row (Heavy)",
            muscles: "Lats, Rhomboids",
            secondary: "Rear Delts, Biceps",
            equipment: "Dumbbell + bench",
            sets: "3",
            reps: "10–12",
            how: "Use a heavier load than earlier levels. Pause 1 second at the top of every rep to maximise peak contraction. Add a slight shoulder retraction at the top.",
            mistakes: "Losing the torso brace under heavy load, rotating to assist.",
            visual: "Check your highest rep on video — form often breaks at the 8th–10th rep; this is the training zone to monitor.",
          },
          {
            name: "Cable Face Pull (Shoulder Health Emphasis)",
            muscles: "Rear Deltoids, External Rotators",
            secondary: "Lower Traps, Rhomboids",
            equipment: "Cable machine + rope",
            sets: "4",
            reps: "15–20",
            how: "Include in every back session as shoulder health maintenance. Use a lighter, controlled weight and focus on the external rotation cue at the end of the pull.",
            mistakes: "Treating it as an ego exercise and over-loading it.",
            visual: "This exercise is best learned from a physiotherapist or sports trainer — ask at the Dotfit front desk for a referral.",
          },
        ],
      },
      {
        group: "Day 3 — Arms (Biceps + Triceps)",
        exercises: [
          {
            name: "Barbell Curl",
            muscles: "Biceps Brachii",
            secondary: "Brachialis, Brachioradialis",
            equipment: "Barbell or EZ-curl bar",
            sets: "4",
            reps: "8",
            how: "Use a heavier load than dumbbell curls allow. Focus on a full range of motion and a 3-second eccentric — this is where the most hypertrophy stimulus occurs for biceps.",
            mistakes: "Cheating every rep with body swing — occasional slight lean at the top is acceptable under max loads, not every rep.",
            visual: "EZ-bar curl anatomy diagrams show slightly reduced peak activation vs straight bar — choose based on wrist comfort.",
          },
          {
            name: "Preacher Curl",
            muscles: "Biceps (short head emphasis at stretched position)",
            secondary: "Brachialis",
            equipment: "EZ-curl bar + preacher bench or cable preacher",
            sets: "3",
            reps: "10–12",
            how: "The preacher bench locks the upper arm, eliminating cheating entirely. Lower to a full stretch at the bottom (critical for long-head activation). Curl smoothly. Do not hyper-extend at the bottom under load.",
            mistakes: "Resting the upper arm on the pad past the flat section, slamming down at the bottom.",
            visual: "Check preacher curl mechanics — the angle of the pad determines the resistance curve.",
          },
          {
            name: "Cable Curl",
            muscles: "Biceps Brachii",
            secondary: "Brachialis",
            equipment: "Cable machine + straight bar or rope",
            sets: "3",
            reps: "12–15",
            how: "Set the cable low and perform curls in a standing or kneeling position. The cable provides constant resistance through the full ROM, unlike free weights (which have a weaker loading at the top and bottom).",
            mistakes: "Same errors as dumbbell curl. The advantage of cables is eliminated if you use momentum.",
            visual: "Compare cable curl vs free weight resistance curves — cables have equal load throughout while dumbbells front-load the mid-range.",
          },
          {
            name: "Close-Grip Bench Press",
            muscles: "Triceps (all heads)",
            secondary: "Chest, Anterior Deltoids",
            equipment: "Barbell + bench",
            sets: "4",
            reps: "8",
            how: "Set up identically to the bench press but use a shoulder-width grip. This shifts the workload toward the triceps. Lower the bar to the lower chest/upper abdomen area (higher than regular bench press). Drive up powerfully.",
            mistakes: "Using an excessively narrow grip (wrist pain risk), flaring elbows wide (negates the close-grip benefit).",
            visual: "Check a close-grip vs standard bench press diagram — the difference is in the elbow path and bar landing position.",
          },
          {
            name: "Skull Crusher (Lying Tricep Extension)",
            muscles: "Triceps (long head)",
            secondary: "Anconeus",
            equipment: "EZ-curl bar or barbell + bench",
            sets: "3",
            reps: "10–12",
            how: "Lie on a flat bench with an EZ-bar held directly over your face. Upper arms point vertical. Lower the bar toward your forehead (or slightly behind it, toward the top of your head) by bending only the elbows. Extend back up. The name describes the error — never lose control of the bar.",
            mistakes: "Upper arms moving forward or backward (should stay fixed vertical), rushing down.",
            visual: "Teach yourself this movement with a light barbell before loading. Always use collars. Have a spotter at first.",
          },
          {
            name: "Dips (Tricep-Focused)",
            muscles: "Triceps (all heads)",
            secondary: "Lower Chest, Anterior Deltoids",
            equipment: "Parallel bars / dip station",
            sets: "3",
            reps: "10",
            how: "Keep the torso upright (vertical), elbows tucked in close. Lower until elbows reach 90°. Press back up. Upright torso = tricep focus; leaned torso = chest focus.",
            mistakes: "Swinging the legs for momentum, going too deep past 90° if you have shoulder impingement.",
            visual: "Ask a trainer to show you the torso-angle difference between a chest dip and a tricep dip.",
          },
        ],
      },
      {
        group: "Day 4 — Shoulders",
        exercises: [
          {
            name: "Barbell Overhead Press (OHP)",
            muscles: "Anterior and Medial Deltoids",
            secondary: "Triceps, Upper Traps, Core Stabilisers",
            equipment: "Barbell",
            sets: "4",
            reps: "6–8",
            how: "Hold the bar just outside shoulder width, wrists stacked over elbows. Brace your entire core before pressing. Press straight up — slightly back behind the ears at lockout so the bar is directly over the shoulder joint. Lower with control.",
            mistakes: "Excessive back arch, pressing in front of the head instead of behind the ears at lockout, flared wrists.",
            visual: "The OHP is technically demanding — ask a trainer to check your bar path and wrist/elbow alignment before loading.",
          },
          {
            name: "Arnold Press",
            muscles: "All three deltoid heads",
            secondary: "Triceps, Upper Traps",
            equipment: "Dumbbells",
            sets: "3",
            reps: "10–12",
            how: "Start with palms facing you (as at the top of a bicep curl). As you press overhead, rotate the palms away from you, ending with palms facing forward at the top. Reverse on the way down. This rotation recruits front, middle, and rear delts across the ROM.",
            mistakes: "Rushing the rotation and losing the tempo, using too much weight that prevents full rotation.",
            visual: "Watch an Arnold press slow-motion demo to understand the rotation timing at each phase of the press.",
          },
          {
            name: "Lateral Raise (Cable — Unilateral)",
            muscles: "Medial Deltoids",
            secondary: "Supraspinatus",
            equipment: "Cable machine (low pulley)",
            sets: "4",
            reps: "15–20 per arm",
            how: "Set the cable low, stand with your non-working side nearest the stack. Raise the arm in a wide arc to shoulder height, pinky leading. The cable provides a better resistance curve than dumbbells for this movement. Control the descent.",
            mistakes: "Shrugging the traps, raising above shoulder level, momentum swings.",
            visual: "Compare unilateral cable raise resistance curve to dumbbell raises — the cable provides higher load at the most difficult portion.",
          },
          {
            name: "Rear Delt Fly (Cables or Reverse Pec Dec)",
            muscles: "Rear Deltoids",
            secondary: "Rhomboids, Lower Traps, External Rotators",
            equipment: "Cable machine or reverse pec-dec machine",
            sets: "4",
            reps: "15",
            how: "Set cables at face height and cross arms to grab the opposite handle. Keep arms wide and horizontal and pull the cable handles outward in a wide arc. Or use the reverse pec-dec (facing the machine). The rear delt is chronically under-trained and critical for posture and shoulder health.",
            mistakes: "Using traps instead of rear delts, over-loading and losing form.",
            visual: "Request a rear-delt activation tutorial from a Dotfit trainer — the correct movement pattern is easy to miss without cueing.",
          },
          {
            name: "Face Pull",
            muscles: "Rear Deltoids, External Rotators",
            secondary: "Lower Traps",
            equipment: "Cable machine + rope",
            sets: "3",
            reps: "15",
            how: "As per Level 4 instructions. Include in every shoulder session as an injury-prevention superset or finisher.",
            mistakes: "Skipping this exercise because it feels easy — its value is long-term shoulder joint health.",
            visual: "Ask a Dotfit physiotherapist or senior trainer for an annual shoulder mobility screen.",
          },
        ],
      },
      {
        group: "Day 5 — Legs (Complete)",
        exercises: [
          {
            name: "Barbell Back Squat (Heavy)",
            muscles: "Quadriceps, Glutes, Adductors",
            secondary: "Hamstrings, Core, Erectors",
            equipment: "Barbell + squat rack",
            sets: "4",
            reps: "5–6 (strength focus)",
            how: "Follow Level 4 technique. At Level 5, prioritise depth, brace, and bar placement over load increases. Consider a 5/3/1 or linear periodisation programme with your trainer.",
            mistakes: "Ego-loading the bar — squatting technique breakdown under heavy load is the primary injury cause.",
            visual: "Film every heavy squat session from the side and front. Review with your trainer monthly.",
          },
          {
            name: "Romanian Deadlift (Heavy)",
            muscles: "Hamstrings, Glutes",
            secondary: "Erectors, Grip",
            equipment: "Barbell",
            sets: "4",
            reps: "8",
            how: "Follow Level 3 technique. At heavier loads, consider a lifting belt for sets above 80% of max. Hook grip or mixed grip may be needed for grip strength.",
            mistakes: "Neglecting the eccentric phase under heavy load.",
            visual: "Ask a trainer to confirm spinal position under heavy loading — the lower back tends to round under fatigue.",
          },
          {
            name: "Leg Press (High Volume)",
            muscles: "Quads, Glutes",
            secondary: "Hamstrings",
            equipment: "Leg press machine",
            sets: "4",
            reps: "12–15",
            how: "After heavy squats, the leg press allows high quad volume without spinal compression. Use as a metabolic finisher with moderate weight.",
            mistakes: "Locking out the knees forcefully under heavy load.",
            visual: "Vary foot placement between sets — high foot = more glute/hamstring; low foot = more quad.",
          },
          {
            name: "Walking Lunge (Weighted)",
            muscles: "Glutes, Quads",
            secondary: "Hamstrings, Calves, Core",
            equipment: "Dumbbells or barbell",
            sets: "3",
            reps: "12 per leg",
            how: "Follow Level 4 technique with added load. Barbell lunges (on traps) increase spinal load significantly — only use if squat technique is solid.",
            mistakes: "Using barbell lunges before developing adequate stability and squat patterning.",
            visual: "Compare lunge variations (walking, reverse, lateral) — each changes the muscle emphasis.",
          },
          {
            name: "Kettlebell Swing",
            muscles: "Glutes, Hamstrings (hip hinge power)",
            secondary: "Core, Grip, Conditioning",
            equipment: "Kettlebell",
            sets: "4",
            reps: "15–20",
            how: "Start in a slight squat with the bell between your knees. Hike the bell back, snap the hips forward powerfully — the bell floats to chest height from hip momentum, not shoulder lifting. Let gravity bring it back down and reload the hinge. This is a hip hinge, not a squat.",
            mistakes: "Squatting the swing (using knees instead of hips), lifting with the arms, not snapping the hips at the top.",
            visual: "The hip snap is the hardest skill to learn — ask for a kettlebell fundamentals tutorial from a Dotfit trainer before using this in a session.",
          },
        ],
      },
      {
        group: "Cardio / Conditioning",
        exercises: [
          {
            name: "Treadmill Interval Sprints (HIIT)",
            muscles: "Full cardiovascular system, lower body",
            secondary: "Core, Lungs, Heart",
            equipment: "Treadmill",
            sets: "8–10 intervals",
            reps: "20 sec sprint / 40 sec walk",
            how: "Warm up at a walk for 3 min. Set a challenging sprint speed (7–12 km/h depending on fitness level). Sprint for 20 seconds, step off or slow to walk for 40 seconds. Repeat 8–10 times. Cool down 3–5 min. Total: ~15–18 min. Far more fat-burning than steady-state cardio in the same time period.",
            mistakes: "Going too fast without holding the side rails (injury risk), skipping the warm-up and cool-down.",
            visual: "Ask a trainer to help set the treadmill speed for your current level — max speed should allow good running form, not a desperate scramble.",
          },
          {
            name: "Stationary Bike Sprint Protocol",
            muscles: "Quads, Glutes, Cardiovascular System",
            secondary: "Hamstrings, Calves",
            equipment: "Stationary bike / spin bike",
            sets: "8–12 intervals",
            reps: "30 sec all-out / 90 sec easy",
            how: "Adjust the seat so legs are almost fully extended at the bottom of the pedal stroke. Sprint at maximum resistance and RPM for 30 seconds, then reduce resistance and pedal easily for 90 seconds. This 4:1 work-to-rest ratio is the Tabata-inspired protocol proven for VO2max improvement.",
            mistakes: "Not actually going maximum effort in the sprint phase — you should not be able to hold a conversation.",
            visual: "Look for a spin bike setup guide — incorrect seat height is the primary cause of knee discomfort.",
          },
          {
            name: "Jump Rope (Skipping)",
            muscles: "Calves, Cardiovascular System",
            secondary: "Coordination, Shoulders, Core",
            equipment: "Jump rope",
            sets: "5 rounds",
            reps: "60–90 sec",
            how: "Keep jumps minimal — just enough to clear the rope (~2–4 cm). Land softly on the balls of your feet. Start with basic single-unders before attempting double-unders. Great warm-up or conditioning finisher.",
            mistakes: "Jumping too high on each revolution (wastes energy), landing on heels, handles held too wide.",
            visual: "Ask a Dotfit trainer for a jump rope basics tutorial — most beginners trip frequently due to incorrect rope length or jump height.",
          },
          {
            name: "Battle Ropes",
            muscles: "Shoulders, Arms, Core",
            secondary: "Full-body cardiovascular conditioning",
            equipment: "Battle ropes (anchored)",
            sets: "5–8 rounds",
            reps: "30–45 sec",
            how: "Stand in a slight squat stance, holding a rope end in each hand. Alternate arms creating waves from hands to the anchor. Maintain continuous rope movement and keep the core braced. Variations: double waves, lateral whips, slams.",
            mistakes: "Standing upright with straight legs (loses power base), stopping between rope waves.",
            visual: "Ask a trainer to demonstrate the wave pattern — consistent wave amplitude is more important than speed.",
          },
          {
            name: "Sled Push / Pull",
            muscles: "Glutes, Quads, Core, Cardiovascular System",
            secondary: "Shoulders, Hamstrings",
            equipment: "Weighted sled",
            sets: "4–6 lengths",
            reps: "15–20 metres per length",
            how: "Load the sled to a weight that allows continuous movement for the set distance. Push with hands on the handles and drive powerfully with the legs, staying low. For pulls: attach a rope and walk backward. This is excellent low-impact conditioning that doesn't compromise muscle recovery.",
            mistakes: "Over-loading so the sled stops mid-length, not driving through the legs (just pushing with the arms).",
            visual: "Ask the Dotfit floor manager about sled availability and loading guidance for your current fitness level.",
          },
        ],
      },
    ],
  },
];

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function ExerciseCard({ ex, index }: { ex: Exercise; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="border border-gray-200 bg-white overflow-hidden"
    >
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f8fbf3] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-primary font-black text-xs">{index + 1}</span>
          </div>
          <div>
            <h4 className="font-black text-gray-900 text-base leading-tight">{ex.name}</h4>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5">
                {ex.muscles}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5">
                {ex.equipment}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-2 py-0.5">
                {ex.sets} × {ex.reps}
              </span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 ml-4" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Target Muscles</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed"><span className="font-black text-gray-900">Primary:</span> {ex.muscles}</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed mt-1"><span className="font-black text-gray-900">Secondary:</span> {ex.secondary}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Equipment</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{ex.equipment}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Execution Guide</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{ex.how}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Common Mistakes</p>
                <p className="text-sm text-red-500 font-medium leading-relaxed">{ex.mistakes}</p>
              </div>
              <div className="md:col-span-2 bg-[#f8fbf3] border border-primary/15 p-4 flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Visual Learning Reference</p>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">{ex.visual}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Guide Page ─────────────────────────────────────────────────────── */
export default function GuidePage() {
  const [activeLevel, setActiveLevel] = useState(1);
  const level = LEVELS.find(l => l.level === activeLevel)!;

  const phaseColors: Record<string, string> = {
    "Phase 1": "bg-blue-600",
    "Phase 2": "bg-primary",
    "Phase 2–3": "bg-amber-500",
  };

  const levelBadgeColors: Record<string, string> = {
    "Beginner": "bg-blue-50 text-blue-700 border-blue-200",
    "Beginner+": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Intermediate": "bg-primary/10 text-primary border-primary/30",
    "Intermediate+": "bg-amber-50 text-amber-700 border-amber-200",
    "Advanced": "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dotfit Fitness
        </a>
        <div className="flex items-center gap-2">
          <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-black text-[#25D366] hover:text-[#25D366]/80 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Trainer
          </a>
          <span className="text-white/20">·</span>
          <a href="tel:+919527237213" className="flex items-center gap-1.5 text-xs font-black text-white/50 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5" /> +91 95272 37213
          </a>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-white" />
                </div>
                <span className="text-primary font-black text-xs uppercase tracking-widest">Dotfit Fitness · Baner, Pune</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-4">
                Member<br /><span className="text-primary">Progression</span><br />Guide
              </h1>
              <p className="text-white/60 font-medium text-lg max-w-xl leading-relaxed">
                A structured five-level roadmap from foundational movement to advanced split training — designed by Dotfit's K11-certified coaches.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              {[
                { icon: <Layers className="w-4 h-4" />, label: "5 Levels" },
                { icon: <Activity className="w-4 h-4" />, label: "40+ Exercises" },
                { icon: <Target className="w-4 h-4" />, label: "Full Encyclopedia" },
                { icon: <Shield className="w-4 h-4" />, label: "K11 Certified" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 text-sm font-bold text-white/60">
                  <span className="text-primary">{s.icon}</span> {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Level Tabs ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {LEVELS.map(l => (
              <button
                key={l.level}
                onClick={() => setActiveLevel(l.level)}
                className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                  activeLevel === l.level
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                <span>Level {l.level}</span>
                <span className={`hidden sm:block text-[10px] px-1.5 py-0.5 border ${activeLevel === l.level ? "bg-white/20 border-white/30 text-white" : levelBadgeColors[l.badge]}`}>
                  {l.badge}
                </span>
              </button>
            ))}
            <div className="ml-auto shrink-0 pl-4">
              <a href="/#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-950 hover:bg-gray-900 text-white font-black text-xs uppercase tracking-widest whitespace-nowrap transition-colors">
                Book Trial <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Level Content ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {/* Level header */}
          <div className="border-b border-gray-100 bg-[#f8fbf3]">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${phaseColors[level.phase] ?? "bg-primary"} flex items-center justify-center shrink-0`}>
                    <span className="font-display font-black text-white text-xl">{level.level}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{level.phase}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border ${levelBadgeColors[level.badge]}`}>{level.badge}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5">{level.frequency}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-gray-900">{level.title}</h2>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 font-medium mt-4 text-sm leading-relaxed">{level.goal}</p>
              <div className="mt-3 flex items-start gap-2 bg-white border border-amber-200 px-4 py-3 text-sm text-amber-700 font-medium max-w-2xl">
                <Zap className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                {level.notes}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 md:px-6 max-w-5xl py-10">

            {/* Full-body exercises (Levels 1 & 2) */}
            {level.exercises && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gray-100" />
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Exercise Encyclopedia</h3>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
                <div className="space-y-3">
                  {level.exercises.map((ex, i) => (
                    <ExerciseCard key={ex.name} ex={ex} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Split exercises (Levels 3–5) */}
            {level.splits && (
              <div className="space-y-10">
                {level.splits.map((split) => (
                  <div key={split.group}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-px flex-1 bg-gray-100" />
                      <h3 className="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">{split.group}</h3>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <div className="space-y-3">
                      {split.exercises.map((ex, i) => (
                        <ExerciseCard key={ex.name} ex={ex} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-14 bg-gray-950 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-primary font-black text-xs uppercase tracking-widest mb-2">Ready to Start?</p>
                <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight">Your First Session Is Free</h3>
                <p className="text-white/50 font-medium text-sm mt-2 max-w-sm">Visit Dotfit Fitness, Baner, Pune. Our K11-certified trainers will place you at the right level and build your plan.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm transition-colors">
                  Book Free Trial <ArrowRight className="w-4 h-4" />
                </a>
                <a href="https://wa.me/919527237213?text=Hi%20Dotfit%20Fitness!%20I%27d%20like%20to%20book%20a%20free%20trial%20session." target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#22c55e] text-white font-black uppercase tracking-widest text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
