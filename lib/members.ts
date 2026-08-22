// Sample profiles, not real people. Enough of a directory to show the
// matching working end to end.

export interface MemberPost {
  title: string;
  body: string;
  posted: string;
}

export interface Member {
  id: string;
  name: string;
  headline: string;
  location: string;
  openTo: string;
  skills: string[];
  domains: string[];
  posts: MemberPost[];
}

export const MEMBERS: Member[] = [
  {
    id: "m-amara",
    name: "Amara Okonjo",
    headline: "Accessibility researcher, works with blind and low-vision users",
    location: "Manchester",
    openTo: "Open to joining a mission",
    skills: ["Accessibility research", "User interviews", "Assistive tech", "Inclusive design", "Screen readers"],
    domains: ["accessibility", "community"],
    posts: [
      {
        title: "Most assistive tools fail in month two",
        body: "People try them, then quietly stop. I keep asking teams to run a four-week diary study before they commit to a form factor.",
        posted: "4 days ago",
      },
    ],
  },
  {
    id: "m-tobias",
    name: "Tobias Lindqvist",
    headline: "Embedded engineer, ten years of small battery-powered devices",
    location: "Gothenburg",
    openTo: "Open to advising",
    skills: ["Embedded C", "Sensor fusion", "Power management", "PCB design", "Firmware"],
    domains: ["hardware", "navigation"],
    posts: [
      {
        title: "Battery life decides your form factor",
        body: "Every wearable project I've joined underestimated power. Pick your battery first and design backwards from it.",
        posted: "1 week ago",
      },
    ],
  },
  {
    id: "m-priya",
    name: "Priya Raghunathan",
    headline: "Computer vision engineer, on-device models",
    location: "Bengaluru",
    openTo: "Looking for a project",
    skills: ["Computer vision", "Model optimisation", "PyTorch", "Edge inference", "Dataset design"],
    domains: ["perception", "hardware", "data"],
    posts: [
      {
        title: "Your demo dataset is lying to you",
        body: "Clean, well-lit test images make everything look solved. I collect the ugly cases first now, and it changes what we build.",
        posted: "2 days ago",
      },
    ],
  },
  {
    id: "m-daniel",
    name: "Daniel Weiss",
    headline: "Spatial computing, indoor mapping and wayfinding",
    location: "Berlin",
    openTo: "Open to joining a mission",
    skills: ["Indoor positioning", "SLAM", "Sensor calibration", "Mapping", "Route planning"],
    domains: ["navigation", "perception"],
    posts: [
      {
        title: "Ask whether you need absolute position at all",
        body: "Half the indoor navigation projects I've seen could have shipped with relative guidance and saved a year of work.",
        posted: "3 weeks ago",
      },
    ],
  },
  {
    id: "m-lucia",
    name: "Lucía Fernández",
    headline: "Learning designer, secondary maths and science",
    location: "Valencia",
    openTo: "Available evenings",
    skills: ["Curriculum design", "Formative assessment", "Maths pedagogy", "Classroom testing", "Explainer writing"],
    domains: ["education"],
    posts: [
      {
        title: "Teach one misconception, not one topic",
        body: "The tools that work pick a single place students get stuck and go deep. The ones that fail try to cover a syllabus.",
        posted: "5 days ago",
      },
    ],
  },
  {
    id: "m-kwame",
    name: "Kwame Mensah",
    headline: "Sustainability analyst, waste and circular systems",
    location: "Accra",
    openTo: "Open to advising",
    skills: ["Impact measurement", "Waste audits", "Lifecycle analysis", "Baseline studies", "Reporting"],
    domains: ["climate", "data"],
    posts: [
      {
        title: "Measure before you launch, not after",
        body: "Without a baseline you can't tell progress from wishful thinking, and you can't go back and collect last month.",
        posted: "1 week ago",
      },
    ],
  },
  {
    id: "m-sofia",
    name: "Sofia Marchetti",
    headline: "Operations lead, ran a regional food marketplace",
    location: "Bologna",
    openTo: "Looking for a project",
    skills: ["Marketplace operations", "Supplier onboarding", "Logistics", "Pricing", "Manual matching"],
    domains: ["marketplace", "agriculture"],
    posts: [
      {
        title: "We matched the first 200 orders by phone",
        body: "The spreadsheet years taught us the rules the software eventually encoded. Skipping that would have meant guessing.",
        posted: "6 days ago",
      },
    ],
  },
  {
    id: "m-james",
    name: "James Ferreira",
    headline: "Agronomist working with smallholder growers",
    location: "Porto Alegre",
    openTo: "Open to joining a mission",
    skills: ["Crop planning", "Post-harvest handling", "Grower relations", "Seasonal forecasting", "Field trials"],
    domains: ["agriculture", "climate"],
    posts: [
      {
        title: "Surplus is a timing problem",
        body: "Growers know exactly what will spoil. What they lack is a buyer reachable in the 48 hours that matter.",
        posted: "2 weeks ago",
      },
    ],
  },
  {
    id: "m-hana",
    name: "Hana Sato",
    headline: "Clinical advisor, hospital workflow and patient safety",
    location: "Osaka",
    openTo: "Open to advising",
    skills: ["Clinical workflow", "Patient safety", "Care pathways", "Regulatory basics", "Staff training"],
    domains: ["health"],
    posts: [
      {
        title: "If it adds a click, it won't get used",
        body: "Clinicians are not resisting change. They are out of time. Build into the workflow, not beside it.",
        posted: "9 days ago",
      },
    ],
  },
  {
    id: "m-marcus",
    name: "Marcus Bell",
    headline: "Community organiser, tenant and neighbourhood programmes",
    location: "Leeds",
    openTo: "Available weekends",
    skills: ["Community organising", "Participation design", "Local partnerships", "Volunteer coordination", "Outreach"],
    domains: ["community", "climate"],
    posts: [
      {
        title: "Every building has three reliable people",
        body: "Find them and the scheme runs. Design for the other ninety and you'll be chasing participation forever.",
        posted: "3 days ago",
      },
    ],
  },
  {
    id: "m-elena",
    name: "Elena Petrova",
    headline: "Full-stack engineer, ships small products end to end",
    location: "Lisbon",
    openTo: "Looking for a project",
    skills: ["TypeScript", "React", "APIs", "Payments", "Rapid prototyping"],
    domains: ["software", "marketplace"],
    posts: [
      {
        title: "Build the screen that carries the value first",
        body: "Not sign-up, not settings. If the core screen doesn't land, the rest is scaffolding around nothing.",
        posted: "yesterday",
      },
    ],
  },
  {
    id: "m-ravi",
    name: "Ravi Chandran",
    headline: "Data engineer, pipelines and measurement",
    location: "Singapore",
    openTo: "Open to advising",
    skills: ["Data pipelines", "Instrumentation", "SQL", "Evaluation metrics", "Dashboards"],
    domains: ["data", "perception"],
    posts: [
      {
        title: "Start from the decision, not the dashboard",
        body: "Write the sentence someone should say after looking at it. Then work backwards to what you need to collect.",
        posted: "1 week ago",
      },
    ],
  },
  {
    id: "m-nadia",
    name: "Nadia Haddad",
    headline: "Product designer, interfaces for high-stakes moments",
    location: "Montreal",
    openTo: "Open to joining a mission",
    skills: ["Interaction design", "Prototyping", "Usability testing", "Information hierarchy", "Design systems"],
    domains: ["software", "accessibility", "health"],
    posts: [
      {
        title: "Restraint is the whole job",
        body: "When someone is moving, stressed, or scared, the design question is what to leave out.",
        posted: "4 days ago",
      },
    ],
  },
  {
    id: "m-oskar",
    name: "Oskar Nowak",
    headline: "Industrial designer and hardware prototyper",
    location: "Kraków",
    openTo: "Available weekends",
    skills: ["3D printing", "CAD", "Enclosure design", "Materials", "Fast prototyping"],
    domains: ["hardware"],
    posts: [
      {
        title: "Ten rough versions beat one refined guess",
        body: "I'd rather print six bad enclosures this week than argue about the right one for a month.",
        posted: "5 days ago",
      },
    ],
  },
];

export const MEMBERS_BY_ID = new Map(MEMBERS.map((member) => [member.id, member]));

// kept terse: this goes into every prompt
export function directoryForPrompt(): string {
  return MEMBERS.map(
    (member) =>
      `${member.id} | ${member.name} | ${member.headline} | skills: ${member.skills.join(", ")}`,
  ).join("\n");
}
