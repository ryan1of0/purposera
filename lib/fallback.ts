import type {
  Capability,
  Importance,
  MissionAnalysis,
  NextStep,
  Priority,
  Relationship,
  Role,
  IconName,
} from "./types";
import { slugify } from "./normalize";
import { matchMembers } from "./match";

interface SeedCapability {
  name: string;
  description: string;
  why: string;
  importance: Importance;
  icon: IconName;
}

interface SeedRole {
  name: string;
  description: string;
  why: string;
  priority: Priority;
  covers: string[];
}

interface SeedStep {
  title: string;
  detail: string;
}

interface Domain {
  id: string;
  label: string;
  keywords: string[];
  /** Slots into "the hard part is usually ___". */
  lens: string;
  user: string;
  outcome: string;
  constraints: string[];
  capabilities: SeedCapability[];
  roles: SeedRole[];
  steps: SeedStep[];
}

const DOMAINS: Domain[] = [
  {
    id: "accessibility",
    label: "accessibility",
    keywords: [
      "visually impaired", "blind", "low vision", "deaf", "hard of hearing", "disab",
      "accessib", "assistive", "wheelchair", "impair", "screen reader", "sign language",
      "neurodiver", "autis", "dyslex", "mobility aid",
    ],
    lens: "how differently people already move through the world than a designer tends to assume",
    user: "People living with the disability you're designing around, not a generalised version of them",
    outcome: "Something reliable enough that people trust it on an ordinary day, not just in a demo",
    constraints: ["Has to work for a range of abilities", "Reliability, since people will depend on it"],
    capabilities: [
      {
        name: "Accessibility Design",
        description: "Understanding how people with this disability handle the problem now, and what they've already rejected.",
        why: "This is the one I'd get right first. **Most accessibility products fail because they solve the problem the designer imagined**, not the one people actually have. Five honest conversations will change the shape of the whole thing.",
        importance: "high",
        icon: "accessibility",
      },
      {
        name: "Human-Centered Testing",
        description: "Putting rough versions in front of real users and watching where they break.",
        why: "You'll learn more from **one person using a broken prototype** than from a month of internal debate. Build the ugly version first, then let it fail in front of you.",
        importance: "high",
        icon: "flask",
      },
    ],
    roles: [
      {
        name: "Accessibility Researcher",
        description: "Someone who already works directly with the community you're building for.",
        why: "Keeps the design anchored to **real challenges rather than assumptions**. Worth involving before you commit to a form factor, because that decision is expensive to undo.",
        priority: "needed",
        covers: ["Accessibility Design"],
      },
      {
        name: "Inclusive Product Designer",
        description: "A designer who treats accessibility as the starting constraint rather than a later pass.",
        why: "The difference between usable and unusable here is often **small interaction details**, not big features.",
        priority: "recommended",
        covers: ["Accessibility Design", "Human-Centered Testing"],
      },
    ],
    steps: [
      {
        title: "Talk to three to five people who would actually use this",
        detail: "Ask what they do **today** and where it fails them. Don't pitch your idea yet, or you'll get politeness back instead of information.",
      },
      {
        title: "Find out what they've already tried and abandoned",
        detail: "There is almost always an existing tool people gave up on. **Why they quit** tells you more than any feature list will.",
      },
    ],
  },
  {
    id: "hardware",
    label: "physical hardware",
    keywords: [
      "device", "hardware", "sensor", "wearable", "embedded", "circuit", "robot",
      "drone", "battery", "physical", "manufactur", "prototype", "gadget", "iot",
    ],
    lens: "the distance between something that works on a bench and something that survives a week in a pocket",
    user: "The person who has to carry, charge and trust this thing every day",
    outcome: "A physical thing that holds up outside the lab at a price people will actually pay",
    constraints: ["Cost per unit", "Battery and power", "Durability in real conditions"],
    capabilities: [
      {
        name: "Embedded Hardware",
        description: "Building something small, power-efficient, and reliable enough to carry around.",
        why: "**Hardware punishes you for changing your mind late.** Before committing to a design, pin down size, battery life, and what the thing does when it fails, because retrofitting any of those is painful.",
        importance: "high",
        icon: "chip",
      },
      {
        name: "Rapid Prototyping",
        description: "Getting to a rough, working version fast using parts you can buy today.",
        why: "The first version shouldn't look like the product. It should **answer one question cheaply** so you find out whether the idea holds before tooling costs show up.",
        importance: "medium",
        icon: "wrench",
      },
    ],
    roles: [
      {
        name: "Embedded Systems Engineer",
        description: "Handles firmware, sensors, power, and the awkward space between them.",
        why: "Most of the real difficulty here is **integration, not invention**. Someone who has shipped a device before will save you months of avoidable rework.",
        priority: "needed",
        covers: ["Embedded Hardware"],
      },
      {
        name: "Hardware Prototyping Specialist",
        description: "Turns sketches into something you can hold within a week.",
        why: "Speed of iteration matters more than polish this early. **Ten rough versions beat one refined guess.**",
        priority: "recommended",
        covers: ["Rapid Prototyping"],
      },
    ],
    steps: [
      {
        title: "Fake the hardware before you build it",
        detail: "Strap an off-the-shelf phone or dev board together and test the core idea. **You want to be wrong on a cheap board, not on a production run.**",
      },
      {
        title: "Decide what happens when it fails",
        detail: "Dead battery, lost signal, bad reading. If people depend on this, **the failure behaviour is part of the product**, not an edge case.",
      },
    ],
  },
  {
    id: "perception",
    label: "machine perception",
    keywords: [
      "camera", "computer vision", "detect", "recogni", "image", "photo", "ai ",
      "machine learning", "model", "predict", "classif", "llm", "chatbot", "nlp",
      "voice", "speech", "audio", "artificial intelligence",
    ],
    lens: "how the system behaves on the messy inputs you didn't plan for",
    user: "Whoever has to act on what the system says, and live with it being wrong sometimes",
    outcome: "A system that's right often enough to be useful and honest when it isn't",
    constraints: ["Accuracy on real-world inputs", "Latency", "What happens when the model is wrong"],
    capabilities: [
      {
        name: "Machine Perception",
        description: "Turning raw camera, audio, or text input into something the product can act on.",
        why: "Worth being honest here. **A demo that works on clean input tells you almost nothing.** The real work is the long tail: bad lighting, accents, edge cases, and knowing when to say \"I'm not sure\".",
        importance: "high",
        icon: "vision",
      },
      {
        name: "Evaluation & Data",
        description: "Collecting real examples and measuring whether the system is actually improving.",
        why: "Without this you're tuning on vibes. **A small labelled set of hard cases** is worth more than a large easy one, and it's the thing that tells you when you're done.",
        importance: "medium",
        icon: "chart",
      },
    ],
    roles: [
      {
        name: "Machine Learning Engineer",
        description: "Builds, evaluates, and shrinks the models this depends on.",
        why: "You may not need one on day one if an off-the-shelf model gets you 80% there. **You will need one the moment accuracy becomes the bottleneck.**",
        priority: "recommended",
        covers: ["Machine Perception", "Evaluation & Data"],
      },
      {
        name: "Data Collection Lead",
        description: "Gathers realistic examples from the environment you're targeting.",
        why: "The dataset usually decides the ceiling. Someone owning **where the examples come from** matters more than model choice early on.",
        priority: "nice-to-have",
        covers: ["Evaluation & Data"],
      },
    ],
    steps: [
      {
        title: "Test the model assumption with data you already have",
        detail: "Record twenty realistic examples on a phone and run them through an existing model. **If that fails badly, the plan changes now rather than in three months.**",
      },
      {
        title: "Decide what the system does when it's unsure",
        detail: "Silence, a guess, or a request for help are three very different products. Pick one **before** you tune accuracy.",
      },
    ],
  },
  {
    id: "navigation",
    label: "navigation and positioning",
    keywords: [
      "navigat", "indoor", "position", "location", "gps", "route", "wayfind",
      "spatial", "direction", "map", "floor plan", "venue",
    ],
    lens: "whether you need to know where someone is, or only what's directly in front of them",
    user: "Someone moving through a space while doing something else",
    outcome: "Guidance a person can follow while walking, without stopping to interpret it",
    constraints: ["Works indoors where GPS doesn't", "Fast enough to follow while moving"],
    capabilities: [
      {
        name: "Indoor Positioning",
        description: "Working out where someone is inside a building, where GPS stops being useful.",
        why: "This is often **the most expensive assumption in the whole plan**. Before investing, check whether relative guidance (\"door on your left\") solves the problem without ever knowing absolute position.",
        importance: "medium",
        icon: "map",
      },
      {
        name: "Guidance Design",
        description: "Deciding what the system says, when it says it, and when it stays quiet.",
        why: "Too much information is as bad as none. **The interesting design problem is restraint**, especially when someone is moving and can't stop to think.",
        importance: "high",
        icon: "signal",
      },
    ],
    roles: [
      {
        name: "Spatial Computing Engineer",
        description: "Works with positioning, mapping, and sensor fusion.",
        why: "Bring one in **once you've confirmed you actually need absolute position**. Plenty of teams build this before checking, and it's rarely the cheapest path.",
        priority: "recommended",
        covers: ["Indoor Positioning"],
      },
      {
        name: "Interaction Designer",
        description: "Shapes how guidance is delivered moment to moment.",
        why: "Timing and phrasing decide whether this feels like help or noise. That's **a design problem more than a technical one**.",
        priority: "needed",
        covers: ["Guidance Design"],
      },
    ],
    steps: [
      {
        title: "Check whether you actually need positioning",
        detail: "Try solving it with what's immediately sensed instead. **Dropping the positioning requirement, if you can, removes most of the cost and complexity.**",
      },
      {
        title: "Pick one building and make it work there",
        detail: "A single floor of one real place. Generalising later is a known problem. **Getting it right once is the unknown one.**",
      },
    ],
  },
  {
    id: "education",
    label: "learning",
    keywords: [
      "student", "learn", "teach", "tutor", "school", "course", "curricul", "educat",
      "homework", "exam", "concept", "math", "classroom", "study", "lesson", "science experiment",
    ],
    lens: "the difference between someone following along and someone actually understanding",
    user: "The learner who is stuck, and usually the teacher standing next to them",
    outcome: "People genuinely understanding something they couldn't do before, not just finishing a module",
    constraints: ["Fits into how classes actually run", "Motivation, since nobody has to use this"],
    capabilities: [
      {
        name: "Learning Design",
        description: "Sequencing explanations, examples, and practice so understanding actually sticks.",
        why: "The content isn't the hard part. **Knowing why someone is stuck at a specific step is.** Good learning design is mostly diagnosis, and it's the difference between a tool people finish and one they abandon.",
        importance: "high",
        icon: "book",
      },
      {
        name: "Subject Expertise",
        description: "Deep knowledge of the specific topic and the misconceptions that come with it.",
        why: "Every subject has a handful of **predictable places people get stuck**. Someone who has taught it a hundred times knows them, and that knowledge is hard to reconstruct from scratch.",
        importance: "medium",
        icon: "flask",
      },
    ],
    roles: [
      {
        name: "Learning Designer",
        description: "Structures how material is introduced, practised, and reinforced.",
        why: "Keeps the tool from becoming **a nicer-looking textbook**. Worth having before you build much.",
        priority: "needed",
        covers: ["Learning Design"],
      },
      {
        name: "Practising Teacher",
        description: "Someone currently teaching this subject to this age group.",
        why: "They'll tell you in ten minutes whether it fits a real lesson. **Classroom reality kills more education products than technology does.**",
        priority: "recommended",
        covers: ["Subject Expertise", "Learning Design"],
      },
    ],
    steps: [
      {
        title: "Pick one concept people reliably get stuck on",
        detail: "Not a subject, one concept. **Fractions, or force diagrams, or recursion.** Narrow enough that you can tell whether it worked.",
      },
      {
        title: "Test the explanation before you build the product",
        detail: "Walk one learner through it by hand. If your explanation doesn't land in person, **software won't rescue it**.",
      },
    ],
  },
  {
    id: "climate",
    label: "sustainability",
    keywords: [
      "climate", "waste", "recycl", "carbon", "emission", "compost", "sustainab",
      "environment", "pollution", "energy", "water", "landfill", "reuse", "food waste",
    ],
    lens: "changing behaviour, which is usually harder than the technical part",
    user: "The people whose daily habits have to change for this to work",
    outcome: "A measurable reduction that holds up after the novelty wears off",
    constraints: ["Has to be easier than the current habit", "Measurable impact"],
    capabilities: [
      {
        name: "Behaviour Change",
        description: "Getting people to do the slightly harder thing, repeatedly, without being nagged.",
        why: "This is usually **the hardest part, and the part most plans skip**. The technology to reduce waste mostly exists. Getting a hundred households to change what they do on a Tuesday is the actual problem.",
        importance: "high",
        icon: "people",
      },
      {
        name: "Impact Measurement",
        description: "Knowing whether the thing you built actually reduced anything.",
        why: "Without a baseline you can't tell progress from wishful thinking. **Measure the current state before you launch**, because you can't go back and collect it later.",
        importance: "medium",
        icon: "chart",
      },
    ],
    roles: [
      {
        name: "Sustainability Analyst",
        description: "Quantifies the current situation and what a real reduction looks like.",
        why: "Keeps claims honest. **Overstated impact numbers are the fastest way to lose credibility** with the partners you'll need later.",
        priority: "recommended",
        covers: ["Impact Measurement"],
      },
      {
        name: "Community Organiser",
        description: "Works directly with the people whose habits have to change.",
        why: "Adoption here is a relationship problem more than a product one. **Someone trusted locally is worth more than a good app.**",
        priority: "needed",
        covers: ["Behaviour Change"],
      },
    ],
    steps: [
      {
        title: "Measure the current situation in one location",
        detail: "One building, one week, real numbers. **Everything after this depends on having a baseline** you can point at.",
      },
      {
        title: "Run the whole thing manually first",
        detail: "Coordinate it by hand with a spreadsheet and a group chat. If it doesn't work manually, **automating it won't help**.",
      },
    ],
  },
  {
    id: "marketplace",
    label: "connecting two sides of a market",
    keywords: [
      "marketplace", "sell", "buy", "seller", "buyer", "commerce", "order", "payment",
      "price", "surplus", "excess", "vendor", "listing", "supplier", "customer", "platform that connects",
    ],
    lens: "getting both sides to show up at the same time",
    user: "Both sides, and they usually want different things",
    outcome: "Enough real transactions that both sides come back without being chased",
    constraints: ["Both sides need to show up", "Trust between strangers", "Timing and freshness"],
    capabilities: [
      {
        name: "Supply-Side Recruitment",
        description: "Getting the first sellers, hosts, or suppliers on board and keeping them.",
        why: "Nearly every marketplace dies on the empty side. **Pick which side is harder and start there manually**, one relationship at a time. It doesn't scale, and that's fine at this stage.",
        importance: "high",
        icon: "megaphone",
      },
      {
        name: "Trust & Transactions",
        description: "Making it safe for two strangers to exchange something of value.",
        why: "People need a reason to believe the other side will follow through. Early on that reason can be **you, personally vouching**, rather than a ratings system.",
        importance: "medium",
        icon: "shield",
      },
    ],
    roles: [
      {
        name: "Operations Lead",
        description: "Runs the matching by hand before any of it is automated.",
        why: "The manual version teaches you the rules the software will eventually encode. **Skipping it means guessing at those rules.**",
        priority: "needed",
        covers: ["Supply-Side Recruitment"],
      },
      {
        name: "Full-Stack Engineer",
        description: "Builds listings, matching, and payments once the pattern is clear.",
        why: "Worth waiting until the manual process is working. **Software built before the pattern exists usually gets thrown away.**",
        priority: "recommended",
        covers: ["Trust & Transactions"],
      },
    ],
    steps: [
      {
        title: "Match ten transactions by hand",
        detail: "Phone calls and a spreadsheet. **If you can't make ten happen manually, a platform won't create demand that isn't there.**",
      },
      {
        title: "Work out which side is harder to get",
        detail: "One side is always scarcer. **That side sets your strategy**, and knowing which it is early saves you building for the wrong one.",
      },
    ],
  },
  {
    id: "agriculture",
    label: "food and farming",
    keywords: ["farm", "crop", "produce", "harvest", "agri", "soil", "livestock", "grower", "orchard", "greenhouse"],
    lens: "seasonality and timing, which don't wait for your roadmap",
    user: "Growers working on thin margins and tight windows",
    outcome: "More of what's grown reaching someone who wants it, at a price that works for the grower",
    constraints: ["Seasonal timing", "Thin margins", "Patchy rural connectivity"],
    capabilities: [
      {
        name: "Grower Relationships",
        description: "Understanding how farms actually plan, harvest, and sell today.",
        why: "Farming runs on **tight windows and existing relationships**. A tool that ignores either gets abandoned during the one week it's needed most.",
        importance: "high",
        icon: "leaf",
      },
      {
        name: "Logistics",
        description: "Moving perishable goods from where they are to where they're wanted, fast.",
        why: "Often the real constraint. **The produce doesn't wait**, so a great matching system with no way to move things is only half a product.",
        importance: "medium",
        icon: "box",
      },
    ],
    roles: [
      {
        name: "Agricultural Advisor",
        description: "Someone who works with growers day to day.",
        why: "Gives you the seasonal calendar and the reasons behind current habits. **That context is hard to get any other way.**",
        priority: "needed",
        covers: ["Grower Relationships"],
      },
      {
        name: "Logistics Coordinator",
        description: "Figures out the physical movement of goods.",
        why: "Worth involving early, since **transport economics often decide whether the whole idea works**.",
        priority: "recommended",
        covers: ["Logistics"],
      },
    ],
    steps: [
      {
        title: "Sit with two growers through one selling decision",
        detail: "Watch what they do with surplus today. **The workaround they already use is your real competition.**",
      },
      {
        title: "Cost out moving one batch",
        detail: "Fuel, time, spoilage. If the margin isn't there for one batch, **it won't appear at scale**.",
      },
    ],
  },
  {
    id: "health",
    label: "health and care",
    keywords: [
      "health", "medical", "patient", "clinic", "doctor", "nurse", "mental", "therapy",
      "diagnos", "caregiv", "wellness", "medicine", "hospital", "treatment",
    ],
    lens: "safety and trust, which set the pace whether you like it or not",
    user: "The person receiving care, and often the person providing it",
    outcome: "A better outcome for someone, without introducing new risk",
    constraints: ["Safety", "Privacy and data handling", "Regulatory requirements"],
    capabilities: [
      {
        name: "Clinical Grounding",
        description: "Making sure what you're building matches how care is actually delivered.",
        why: "Health products fail on **workflow more than science**. If it adds a step for an already-overloaded clinician, it won't be used, however good the idea is.",
        importance: "high",
        icon: "heart",
      },
      {
        name: "Privacy & Compliance",
        description: "Handling health data in a way that's legal and defensible.",
        why: "Not glamorous, and **much cheaper to design in now than to retrofit**. It also determines what you're allowed to claim, which shapes the product.",
        importance: "medium",
        icon: "shield",
      },
    ],
    roles: [
      {
        name: "Clinical Advisor",
        description: "A practising clinician in the relevant area.",
        why: "Keeps you from building something that's technically correct and **clinically useless**. Also tells you what claims you can safely make.",
        priority: "needed",
        covers: ["Clinical Grounding"],
      },
      {
        name: "Privacy Engineer",
        description: "Handles data protection and the compliance path.",
        why: "Needed before you touch real patient data. **Not before that, which buys you time to test the idea.**",
        priority: "recommended",
        covers: ["Privacy & Compliance"],
      },
    ],
    steps: [
      {
        title: "Shadow the workflow you're trying to improve",
        detail: "Half a day watching. **You'll find the actual bottleneck is rarely the one described in a meeting.**",
      },
      {
        title: "Establish what you're allowed to claim",
        detail: "There's a large gap between \"helps you track\" and \"diagnoses\". **That line shapes the entire product**, so find it early.",
      },
    ],
  },
  {
    id: "community",
    label: "local community",
    keywords: [
      "community", "neighbour", "neighbor", "local", "volunteer", "resident", "apartment",
      "building", "tenant", "civic", "city", "municipal", "household", "block",
    ],
    lens: "coordination between people who didn't ask to be coordinated",
    user: "Neighbours and residents who have limited time and no obligation to participate",
    outcome: "Enough people taking part that it keeps running without you pushing it",
    constraints: ["Voluntary participation", "Low effort per person", "Local trust"],
    capabilities: [
      {
        name: "Community Coordination",
        description: "Getting a group of unrelated people to take part in the same thing regularly.",
        why: "The technical side is usually simple. **Sustained participation is the hard part**, and it tends to rest on one or two motivated people rather than a feature.",
        importance: "high",
        icon: "people",
      },
      {
        name: "Low-Friction Design",
        description: "Making the action take seconds, not minutes.",
        why: "Every extra step loses a share of participants. In voluntary systems, **friction is the main failure mode**.",
        importance: "medium",
        icon: "spark",
      },
    ],
    roles: [
      {
        name: "Community Organiser",
        description: "Someone embedded in the group you're trying to activate.",
        why: "Local trust does more for adoption than any feature. **Find the person people already listen to.**",
        priority: "needed",
        covers: ["Community Coordination"],
      },
      {
        name: "Product Designer",
        description: "Cuts the experience down to the smallest possible action.",
        why: "Worth it once you know what the action is. **Design before that is decoration.**",
        priority: "recommended",
        covers: ["Low-Friction Design"],
      },
    ],
    steps: [
      {
        title: "Run it in one building or one block",
        detail: "Small enough to know everyone's name. **Whether it survives month two** is the only signal that matters.",
      },
      {
        title: "Find out who the reliable few are",
        detail: "These things usually run on a handful of committed people. **Design for them first**, and make it easy for everyone else to join in lightly.",
      },
    ],
  },
  {
    id: "software",
    label: "software product",
    keywords: [
      "app", "website", "web", "mobile", "platform", "tool", "dashboard", "software",
      "online", "saas", "interface", "portal",
    ],
    lens: "picking the one workflow worth doing well before adding a second",
    user: "The person who'll open this on a normal, busy day",
    outcome: "One workflow that's clearly better than the spreadsheet or group chat it replaces",
    constraints: ["Has to beat the existing workaround", "Simple enough to learn without training"],
    capabilities: [
      {
        name: "Product Engineering",
        description: "Turning the separate pieces into one thing a person can actually use.",
        why: "The individual parts are rarely the challenge. **Making them feel like one product is.** This is also where most of the timeline goes, so plan for it honestly.",
        importance: "high",
        icon: "code",
      },
      {
        name: "Interface Design",
        description: "Deciding what's on screen, what's hidden, and what happens first.",
        why: "Most tools fail by **showing everything at once**. Choosing what to leave out is the work, and it's much easier before the features exist.",
        importance: "medium",
        icon: "spark",
      },
    ],
    roles: [
      {
        name: "Full-Stack Engineer",
        description: "Builds and ships the working product end to end.",
        why: "One person who can move across the whole stack **beats a specialist team at this stage**, mostly because the spec is still changing weekly.",
        priority: "needed",
        covers: ["Product Engineering"],
      },
      {
        name: "Product Designer",
        description: "Shapes the flow and cuts what isn't needed.",
        why: "Their most valuable contribution early is **removing things**, not adding screens.",
        priority: "recommended",
        covers: ["Interface Design"],
      },
    ],
    steps: [
      {
        title: "Name the one thing this replaces",
        detail: "A spreadsheet, a group chat, a phone call. **If you can't name it, the need may not be there yet.**",
      },
      {
        title: "Build the single most important screen first",
        detail: "Not the settings, not sign-up. **The screen that carries the value**, so you find out quickly whether it does.",
      },
    ],
  },
  {
    id: "data",
    label: "data and measurement",
    keywords: ["data", "analytic", "dataset", "track", "measure", "report", "insight", "statistic", "monitor"],
    lens: "whether anyone changes a decision because of what you show them",
    user: "Whoever has to make a decision from this",
    outcome: "A number someone trusts enough to act on",
    constraints: ["Data quality", "Trust in the numbers"],
    capabilities: [
      {
        name: "Data Foundations",
        description: "Getting reliable data in before worrying about what to do with it.",
        why: "Dashboards built on shaky data get quietly ignored. **Sort out where the numbers come from first**, because trust is very hard to win back once lost.",
        importance: "high",
        icon: "database",
      },
      {
        name: "Decision Design",
        description: "Working out what someone will actually do differently because of this.",
        why: "**If no decision changes, the metric is decoration.** Start from the decision and work backwards to the data you need.",
        importance: "medium",
        icon: "chart",
      },
    ],
    roles: [
      {
        name: "Data Engineer",
        description: "Builds the collection and processing that everything else sits on.",
        why: "Needed once the data is real. **Not before**, since early on a spreadsheet is genuinely enough.",
        priority: "recommended",
        covers: ["Data Foundations"],
      },
      {
        name: "Domain Analyst",
        description: "Knows what the numbers mean in this particular field.",
        why: "Context is what separates **a real signal from noise that looks meaningful**.",
        priority: "recommended",
        covers: ["Decision Design"],
      },
    ],
    steps: [
      {
        title: "Write the sentence someone should say after seeing this",
        detail: "\"We should do X because Y.\" **Work backwards from that sentence** to figure out what you actually need to collect.",
      },
      {
        title: "Collect one week of real data by hand",
        detail: "Manually, imperfectly. **It'll expose the quality problems** that would otherwise appear months into building a pipeline.",
      },
    ],
  },
];

const BASE_CAPABILITIES: SeedCapability[] = [
  {
    name: "Problem Framing",
    description: "Getting specific about which version of this problem you're solving first.",
    why: "**Broad missions stall.** The teams that ship usually pick one narrow version and go deep on it. You can widen later, and it's much easier to widen than to unpick a vague start.",
    importance: "high",
    icon: "people",
  },
  {
    name: "Product Engineering",
    description: "Turning the separate pieces into one thing a person can actually use.",
    why: "Individual components are rarely the hard part. **Making them work as one thing is**, and that integration work is where most of the schedule quietly goes.",
    importance: "medium",
    icon: "wrench",
  },
  {
    name: "Real-World Testing",
    description: "Getting a rough version in front of people early and often.",
    why: "The fastest way to find out whether this matters. **A reaction to something rough beats an opinion about something described.**",
    importance: "medium",
    icon: "flask",
  },
];

const BASE_ROLES: SeedRole[] = [
  {
    name: "Product Designer",
    description: "Shapes what this feels like to use, and cuts what isn't needed yet.",
    why: "Most useful early for **deciding what not to build**. That's a bigger lever than visual polish at this stage.",
    priority: "recommended",
    covers: ["Problem Framing"],
  },
  {
    name: "Founding Engineer",
    description: "Someone comfortable building the whole thing roughly before specialising.",
    why: "Early on you want **range over depth**. The specification will change several times, and generalists absorb that better.",
    priority: "recommended",
    covers: ["Product Engineering"],
  },
  {
    name: "Domain Advisor",
    description: "Someone who has worked in this space and can tell you what's already been tried.",
    why: "A few hours with the right person can save months. **You don't need them full-time**, which makes this one of the cheapest wins available.",
    priority: "nice-to-have",
    covers: ["Problem Framing"],
  },
];

const BASE_STEPS: SeedStep[] = [
  {
    title: "Write down the assumption this whole idea rests on",
    detail: "Every mission has one belief that sinks it if wrong. **Name it, then design the cheapest possible test for it.**",
  },
  {
    title: "Pick the narrowest version you could ship",
    detail: "One place, one group, one scenario. **A small thing that works beats a large thing still being designed.**",
  },
  {
    title: "Put something rough in front of a person this week",
    detail: "Paper, slides, a fake demo. The goal is **a reaction, not a product**.",
  },
];

const CONSTRAINT_RULES: [RegExp, string][] = [
  [/low.?cost|cheap|afford|budget|inexpensive|free to use/i, "Cost, since it has to be affordable for the people who need it"],
  [/offline|without internet|no connectivity|rural|remote area/i, "Works without a reliable connection"],
  [/privacy|private|confidential|personal data|anonym/i, "Privacy and data handling"],
  [/real.?time|instant|immediate|live |on the spot/i, "Fast enough to be useful in the moment"],
  [/scale|thousands|millions|nationwide|everywhere/i, "Has to hold up beyond a pilot"],
  [/easy to use|simple|intuitive|no training|user.?friendly/i, "Simple enough to use without training"],
  [/safe|safety|secure|reliab|depend/i, "Reliability, because people will depend on it"],
  [/regulat|complian|legal|law|certif|approval/i, "Regulatory and approval requirements"],
];

const AUDIENCE_STOP_WORDS = [
  "navigate", "find", "understand", "get", "reduce", "sell", "learn", "manage",
  "track", "avoid", "access", "use", "buy", "save", "connect", "move", "do",
  "make", "build", "identify", "discover", "share", "grow", "improve", "handle",
  "before", "when", "while", "with", "without", "through", "so that", "who are",
];

function firstSentence(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^[^.!?]{10,}?[.!?]/);
  const sentence = (match ? match[0] : trimmed).replace(/[.!?]+$/, "");
  return sentence.slice(0, 160);
}

function toTitle(input: string): string {
  const sentence = firstSentence(input);
  if (!sentence) return "Your mission";
  const capitalised = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return capitalised.length > 110 ? `${capitalised.slice(0, 107).trimEnd()}...` : capitalised;
}

function scoreDomains(text: string): Domain[] {
  const haystack = text.toLowerCase();
  return DOMAINS.map((domain) => {
    let score = 0;
    for (const keyword of domain.keywords) {
      if (haystack.includes(keyword)) score += keyword.includes(" ") ? 3 : 2;
    }
    return { domain, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.domain);
}

function deriveUser(text: string, domains: Domain[]): string {
  const match = text.match(
    /\b(?:for|helps?|helping|support(?:s|ing)?|serving|serve|aimed at|assist(?:s|ing)?|enable(?:s|ing)?)\s+([^.,;:]{4,80})/i,
  );

  if (match) {
    let phrase = match[1].trim();
    const lower = phrase.toLowerCase();
    let cutIndex = phrase.length;
    for (const stop of AUDIENCE_STOP_WORDS) {
      const index = lower.indexOf(` ${stop} `);
      if (index > 3 && index < cutIndex) cutIndex = index;
    }
    phrase = phrase.slice(0, cutIndex).trim().replace(/^(?:the|a|an)\s+/i, "");
    if (phrase.length > 3) {
      return phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }
  }

  return domains[0]?.user ?? "The people closest to this problem right now";
}

function deriveConstraints(text: string, domains: Domain[]): string[] {
  const found = new Set<string>();
  for (const [pattern, constraint] of CONSTRAINT_RULES) {
    if (pattern.test(text)) found.add(constraint);
  }
  for (const domain of domains) {
    for (const constraint of domain.constraints) found.add(constraint);
  }
  if (found.size === 0) {
    found.add("Time and attention, since early momentum matters more than completeness");
  }
  return Array.from(found).slice(0, 5);
}

function dedupeByName<T extends { name: string }>(items: T[], limit: number): T[] {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const item of items) {
    const key = item.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
    if (output.length >= limit) break;
  }
  return output;
}

/** Interleave one entry per domain per pass, so the top domain leads. */
function interleave<T>(groups: T[][]): T[] {
  const output: T[] = [];
  const depth = Math.max(0, ...groups.map((group) => group.length));
  for (let index = 0; index < depth; index += 1) {
    for (const group of groups) {
      if (group[index] !== undefined) output.push(group[index]);
    }
  }
  return output;
}

function buildSummary(domains: Domain[]): string {
  if (domains.length >= 2) {
    return `This reads like a mix of **${domains[0].label}** and **${domains[1].label}** work. In our experience the hard part sits where those two meet, rather than inside either one.`;
  }
  if (domains.length === 1) {
    return `This reads mostly like a **${domains[0].label}** problem, with the usual product and testing work around it.`;
  }
  return "This looks like an early-stage mission. The most useful move now is **narrowing it to one version you can test quickly**.";
}

function buildProblem(input: string, domains: Domain[]): string {
  const core = firstSentence(input);
  const lens = domains[0]?.lens ?? "the distance between the idea and the first working version";
  return `**${core}** is the version we're working from. In practice the hard part is usually ${lens}.`;
}

/**
 * A keyword-driven map of the mission. Used when Gemini is unavailable or
 * returns something we can't trust, so the page still says something useful.
 */
export function buildFallbackAnalysis(input: string, degraded: boolean): MissionAnalysis {
  const domains = scoreDomains(input);

  const capabilities = dedupeByName(
    [...interleave(domains.map((domain) => domain.capabilities)), ...BASE_CAPABILITIES],
    6,
  ).map<Capability>((seed, index) => ({
    id: slugify(seed.name, `capability-${index}`),
    name: seed.name,
    description: seed.description,
    why: seed.why,
    importance: seed.importance,
    icon: seed.icon,
  }));

  const capabilityNames = new Set(capabilities.map((capability) => capability.name));

  const roles = dedupeByName(
    [...interleave(domains.map((domain) => domain.roles)), ...BASE_ROLES],
    5,
  ).map<Role>((seed, index) => ({
    id: slugify(seed.name, `role-${index}`),
    name: seed.name,
    description: seed.description,
    why: seed.why,
    priority: seed.priority,
    covers: seed.covers.filter((name) => capabilityNames.has(name)),
  }));

  const stepSeeds = [
    ...interleave(domains.slice(0, 2).map((domain) => domain.steps)),
    ...BASE_STEPS,
  ];
  const nextSteps: NextStep[] = [];
  const seenSteps = new Set<string>();
  for (const seed of stepSeeds) {
    const key = seed.title.toLowerCase();
    if (seenSteps.has(key)) continue;
    seenSteps.add(key);
    nextSteps.push({
      id: slugify(seed.title, `step-${nextSteps.length}`),
      title: seed.title,
      detail: seed.detail,
    });
    if (nextSteps.length >= 5) break;
  }

  const relationships: Relationship[] = [];
  for (const capability of capabilities) {
    relationships.push({ source: "mission", target: capability.name, relationship: "needs" });
  }
  for (const role of roles) {
    for (const name of role.covers) {
      relationships.push({ source: name, target: role.name, relationship: "covered by" });
    }
  }

  return {
    input,
    mission: {
      title: toTitle(input),
      summary: buildSummary(domains),
      problem: buildProblem(input, domains),
      user: deriveUser(input, domains),
      outcome: domains[0]?.outcome ?? "Something real enough that people can react to it, rather than a plan on paper",
      constraints: deriveConstraints(input, domains),
    },
    capabilities,
    roles,
    nextSteps,
    relationships,
    matches: matchMembers(input, capabilities, 4),
    meta: {
      source: "fallback",
      generatedAt: new Date().toISOString(),
      degraded,
    },
  };
}
