const OFFLINE_KNOWLEDGE = {
  identity:
    "I'm Dotfit AI Coach — your gym-side fitness assistant for training, nutrition, equipment selection, and safe progress.",
  gym:
    "Dotfit Fitness is the Baner, Pune gym shown on this site. Use the website for gym timing, location, trial, and contact details.",
  amenities:
    "Dotfit has 2 cleaners for the male and female locker rooms, plus a water machine with cold, normal, and hot drinking water.",
  policies:
    "Membership transfer fee is ₹1,500–₹2,000. If an existing member refers a new client who joins a 6–12 month membership, the existing member gets a 1 month extension.",
  classes:
    "All classes are free to join and work on a first-come, first-served basis when space is available.",
  staff:
    "The front desk is helpful for gym inquiries, holiday or closure updates, and general information. Trainers are also approachable and ready to help with what to do next.",
  training:
    "For muscle gain: prioritize progressive overload, 10-20 hard sets per muscle per week, 1-3 RIR on key lifts, and track performance weekly.",
  nutrition:
    "For fat loss: keep protein high, build meals around lean protein + fiber + produce, and create a modest calorie deficit you can sustain.",
  equipment:
    "Free weights build stability and strength; selectorized machines isolate safely; cables are great for constant tension and angle changes; functional tools help conditioning and core work.",
  safety:
    "If a movement causes sharp pain, reduce range of motion, lower load, switch variation, or stop and seek a qualified trainer or clinician.",
} as const;

export function getOfflineReply(userText: string): string {
  const text = userText.toLowerCase();
  if (text.includes("dotfit") || text.includes("gym timing") || text.includes("timings")) {
    return `${OFFLINE_KNOWLEDGE.identity}\n\n${OFFLINE_KNOWLEDGE.gym}\n${OFFLINE_KNOWLEDGE.amenities}\n${OFFLINE_KNOWLEDGE.policies}\n${OFFLINE_KNOWLEDGE.classes}\n${OFFLINE_KNOWLEDGE.staff}\n\nFor exact membership, timing, or location details, the website contact section is the safest source.`;
  }
  if (
    text.includes("squat") ||
    text.includes("deadlift") ||
    text.includes("bench") ||
    text.includes("workout") ||
    text.includes("program") ||
    text.includes("split")
  ) {
    return `${OFFLINE_KNOWLEDGE.identity}\n\n${OFFLINE_KNOWLEDGE.training}\n\n${OFFLINE_KNOWLEDGE.safety}`;
  }
  if (
    text.includes("meal") ||
    text.includes("protein") ||
    text.includes("diet") ||
    text.includes("nutrition") ||
    text.includes("calorie")
  ) {
    return `${OFFLINE_KNOWLEDGE.identity}\n\n${OFFLINE_KNOWLEDGE.nutrition}\n\n${OFFLINE_KNOWLEDGE.safety}`;
  }
  if (
    text.includes("machine") ||
    text.includes("cable") ||
    text.includes("dumbbell") ||
    text.includes("barbell") ||
    text.includes("equipment")
  ) {
    return `${OFFLINE_KNOWLEDGE.identity}\n\n${OFFLINE_KNOWLEDGE.equipment}\n\nAt Dotfit, a smart approach is to match the tool to the goal: free weights for skill + strength, machines for stable overload, cables for angles and tension.`;
  }
  return `${OFFLINE_KNOWLEDGE.identity}\n\n${OFFLINE_KNOWLEDGE.training}\n${OFFLINE_KNOWLEDGE.nutrition}\n${OFFLINE_KNOWLEDGE.equipment}\n\n${OFFLINE_KNOWLEDGE.safety}`;
}
