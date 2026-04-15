export const hero = {
  eyebrow: "Doctor-led · India-wide",
  title: "Your parents deserve to age stronger — not just older.",
  subtitle:
    "Personalized programs for pain, diabetes, mobility and longevity — with family visibility built in.",
  trust: [
    { value: "1,500+", label: "families cared for" },
    { value: "4.9★", label: "avg. rating" },
    { value: "Pan-India", label: "remote + home" },
  ],
};

export const emotional = {
  lines: [
    "They say they're fine.",
    "But pain becomes routine.",
    "Energy quietly fades.",
    "And health slowly declines.",
  ],
  resolve: "Praan changes that story.",
};

export const features = [
  {
    kicker: "01",
    title: "Doctor-led assessment",
    description:
      "A 45-minute review with MBBS + physio specialists. We baseline every parent before we plan anything.",
    tag: "Within 48 hours",
  },
  {
    kicker: "02",
    title: "Personalised care plan",
    description:
      "Diet, movement, sleep and medication — designed around their real routine, not a template.",
    tag: "Built around your parent",
  },
  {
    kicker: "03",
    title: "Daily guided sessions",
    description:
      "Live and recorded sessions with coaches who actually remember your parent's name — and their knee.",
    tag: "Live + on-demand",
  },
  {
    kicker: "04",
    title: "Progress dashboard",
    description:
      "Sugar, pain score, mobility, sleep — tracked weekly. Trends replace guesswork.",
    tag: "Objective tracking",
  },
  {
    kicker: "05",
    title: "Family updates, anywhere",
    description:
      "A weekly WhatsApp digest for the family. Peace of mind without the daily check-in call.",
    tag: "Built for NRIs",
  },
];

export const whyFamilies = {
  eyebrow: "The quiet problem",
  title: "If you live away, this worry never leaves you.",
  problems: [
    "Parents skip their checkups",
    "Pain becomes their new normal",
    "Reports and refills get delayed",
    "No daily routine, no momentum",
    "You feel helpless from far away",
  ],
  resolve: {
    title: "Structured care > random advice.",
    body: "Praan replaces anxious phone calls with a plan, a team and a weekly update you can actually trust.",
  },
};

export const metrics = [
  { value: 1500, suffix: "+", label: "Families cared for" },
  { value: 50000, suffix: "+", label: "Sessions delivered" },
  { value: 92, suffix: "%", label: "Weekly consistency" },
  { value: 49, suffix: "★", label: "Average rating", decimals: 1 },
];

export const programs = [
  {
    slug: "diabetes-reversal",
    name: "Diabetes Reversal",
    blurb:
      "Lower HbA1c through guided nutrition, movement and close lab tracking.",
    accent: "brand",
  },
  {
    slug: "knee-back-pain",
    name: "Knee & Back Pain Recovery",
    blurb:
      "A physio-led return to pain-free walking, climbing and bending — in weeks, not years.",
    accent: "gold",
  },
  {
    slug: "strength-50",
    name: "Strength & Mobility 50+",
    blurb:
      "Rebuild muscle, balance and bone strength with age-appropriate training.",
    accent: "brand",
  },
  {
    slug: "longevity",
    name: "Longevity Preventive",
    blurb:
      "Get ahead of chronic disease with advanced labs, sleep, stress and nutrition protocols.",
    accent: "brand",
  },
  {
    slug: "weight",
    name: "Weight Management",
    blurb:
      "Sustainable weight loss built around Indian kitchens and real schedules.",
    accent: "gold",
  },
] as const;

export const dashboard = {
  eyebrow: "Family visibility",
  title: "See their progress — without asking them every day.",
  body: "One dashboard, one weekly digest. You see the sugar trend, the session streak and the pain score. They just keep getting better.",
  callouts: [
    { label: "HbA1c trending down", value: "8.2 → 6.4", tone: "brand" },
    { label: "Session streak", value: "28 days", tone: "gold" },
    { label: "Pain score", value: "7 → 2", tone: "brand" },
    { label: "Weekly digest", value: "Sent to family", tone: "gold" },
  ],
} as const;

export const testimonials = [
  {
    name: "Rohan K.",
    role: "Son · San Francisco",
    quote:
      "For the first time since I moved, I'm not anxious about my dad's sugar. The weekly digest is genuinely calming.",
    parent: "Father, 64 · Diabetes Reversal",
  },
  {
    name: "Aanya M.",
    role: "Daughter · Bangalore",
    quote:
      "Amma actually does her exercises now. A real coach who remembers her makes the difference.",
    parent: "Mother, 58 · Strength 50+",
  },
  {
    name: "Mr. Shah",
    role: "Member · Ahmedabad",
    quote:
      "I walked up four floors at a wedding last month. Two years ago I couldn't get through one.",
    parent: "67 · Knee Pain Recovery",
  },
  {
    name: "Priya S.",
    role: "Daughter · London",
    quote:
      "It's structured. It's honest. And my parents look forward to the sessions — that was the bit I never thought I'd get.",
    parent: "Both parents · Longevity",
  },
  {
    name: "Mrs. Iyer",
    role: "Member · Chennai",
    quote:
      "My knees, my sleep, my confidence — everything improved together. I feel like I got a decade back.",
    parent: "61 · Knee + Longevity",
  },
];

export const doctors = [
  {
    name: "Dr. Arjun Mehta",
    role: "Chief Medical Officer · MBBS, MD (Internal Medicine)",
    bio: "15 years in preventive and metabolic medicine. Leads clinical protocol at Praan.",
  },
  {
    name: "Dr. Kavya Rao",
    role: "Head of Physiotherapy · MPT (Ortho)",
    bio: "Designed the knee and back recovery programs around elderly-safe progression.",
  },
  {
    name: "Tanvi Shah, RD",
    role: "Lead Nutritionist · Certified Diabetes Educator",
    bio: "Builds diets that actually work in Indian households — not in lab notebooks.",
  },
];

export const press = [
  "YourStory",
  "Economic Times",
  "Inc42",
  "Mint",
  "Forbes India",
  "Moneycontrol",
];

export const finalCta = {
  title: "They took care of you for years.",
  subtitle: "Now it's your turn.",
  body: "Start with a free assessment. No commitments, no pressure — just a clear next step.",
};
