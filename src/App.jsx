import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring
} from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  Users,
  Menu,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  X,
  Code2,
  Laptop,
  Target,
  Search,
  MapPin,
  Clock,
  Building2,
  Plus,
  Send,
  Filter,
  Star,
  ShieldCheck,
  Quote,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UserRound,
  ChevronDown,
  Rocket,
  BadgeCheck,
  Zap
} from "lucide-react";

// Automatically handles both localhost and GitHub Pages.
const logoSrc = `${import.meta.env.BASE_URL}vyom-logo.png`;

/* ==================================================
   A. WEBSITE DATA  (edit texts and lists here)
================================================== */

const programs = [
  {
    icon: BrainCircuit,
    title: "Artificial Intelligence",
    description:
      "Explore AI fundamentals and understand how intelligent systems are transforming industries."
  },
  {
    icon: Laptop,
    title: "Generative AI",
    description:
      "Discover LLMs, AI tools, prompt engineering and practical generative AI applications."
  },
  {
    icon: Code2,
    title: "Machine Learning",
    description:
      "Learn algorithms, data-driven models and the technology behind intelligent predictions."
  }
];

const navItems = [
  ["Home", "#home"],
  ["Programs", "#programs"],
  ["Jobs & Careers", "#jobs"],
  ["About Us", "#about"],
  ["Feedback", "#feedback"]
];

/* Trust strip shown under the hero buttons.
   Update these with real numbers (learners trained, ratings, partners)
   once you have them - only publish figures you can stand behind. */
const trustPoints = [
  { icon: BrainCircuit, label: "3 AI learning pathways" },
  { icon: Zap, label: "Practical, hands-on approach" },
  { icon: BadgeCheck, label: "Beginner friendly" }
];

/* Floating chips around the hero logo card */
const heroChips = [
  {
    icon: BrainCircuit,
    label: "AI Skills",
    position: "-left-3 top-10 md:-left-5 xl:-left-10",
    float: "animate-float-slow"
  },
  {
    icon: Rocket,
    label: "Career Ready",
    position: "-right-3 top-1/2 md:-right-4 xl:-right-8",
    float: "animate-float-delay"
  },
  {
    icon: Users,
    label: "Expert Mentors",
    position: "-bottom-4 left-6 sm:left-2",
    float: "animate-float"
  }
];

/* Stagger helper for the hero entrance animation */
const heroItem = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" }
});

const emptyJobForm = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  experience: "",
  description: "",
  applyUrl: ""
};

/* Shared input / label styles (used by the forms below) */
const labelCls = "mb-2 block text-sm font-semibold text-[#102B50]";
const jobInputCls =
  "w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#B28A36]";
const feedbackInputCls =
  "w-full rounded-lg border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#B28A36]";
const authInputCls =
  "w-full rounded-xl border border-slate-200 py-3.5 pl-11 text-sm outline-none transition focus:border-[#B28A36] focus:ring-2 focus:ring-[#D7B45A]/15";

/* ==================================================
   B. SITE-WIDE EFFECTS
================================================== */

/* B1. SITE BACKGROUND
   One fixed layer behind the WHOLE page (same effect as the old hero):
   moving gradient, gliding grid, drifting gold/orange/blue orbs, a sweeping
   light beam, a mouse spotlight, and a network of dots that drift, react to
   the cursor, shift slightly when you scroll, and send tiny gold signals
   along their lines. All the CSS is in index.css (section 2). */
function SiteBackground() {
  const canvasRef = useRef(null);
  const spotRef = useRef(null);
  const orbsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const LINK_DISTANCE = 140;
    const MOUSE_DISTANCE = 180;

    let width = 0;
    let height = 0;
    let nodes = [];
    let pulses = [];
    let frameId = 0;
    let scrollY = window.scrollY;
    let lastPulse = 0;
    const mouse = { x: 0, y: 0, active: false };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(110, Math.round((width * height) / 14000));

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.4 + 0.8,
        z: Math.random() * 0.7 + 0.3, // depth: deeper dots shift less on scroll
        gold: Math.random() < 0.22
      }));
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      // Move the dots and work out where each one is drawn
      const pts = nodes.map((n) => {
        const py =
          (((n.y - scrollY * 0.1 * n.z) % height) + height) % height;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MOUSE_DISTANCE && dist > 1) {
            const push = (1 - dist / MOUSE_DISTANCE) * 0.9;
            n.x += (dx / dist) * push;
            n.y += (dy / dist) * push;
          }
        }

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;

        return { x: n.x, y: py, n };
      });

      // Lines between nearby dots
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.28;
            ctx.strokeStyle =
              a.n.gold || b.n.gold
                ? `rgba(215,180,90,${alpha})`
                : `rgba(147,180,255,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Gold lines reaching toward the cursor
      if (mouse.active) {
        for (const p of pts) {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);

          if (dist < MOUSE_DISTANCE) {
            ctx.strokeStyle = `rgba(233,205,131,${(1 - dist / MOUSE_DISTANCE) * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Small gold signals that travel along the lines
      if (time - lastPulse > 700 && pts.length > 1) {
        lastPulse = time;
        const a = pts[Math.floor(Math.random() * pts.length)];
        let best = null;
        let bestDist = LINK_DISTANCE;

        for (const b of pts) {
          if (b === a) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < bestDist) {
            bestDist = d;
            best = b;
          }
        }

        if (best) pulses.push({ a: a.n, b: best.n, t: 0 });
      }

      pulses = pulses.filter((p) => p.t < 1);
      for (const p of pulses) {
        p.t += 0.025;
        const ax = p.a.x;
        const ay = (((p.a.y - scrollY * 0.1 * p.a.z) % height) + height) % height;
        const bx = p.b.x;
        const by = (((p.b.y - scrollY * 0.1 * p.b.z) % height) + height) % height;
        const x = ax + (bx - ax) * p.t;
        const y = ay + (by - ay) * p.t;

        ctx.fillStyle = "rgba(255,210,120,0.95)";
        ctx.shadowColor = "rgba(255,170,60,0.9)";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // The dots
      for (const p of pts) {
        ctx.fillStyle = p.n.gold
          ? "rgba(233,205,131,0.9)"
          : "rgba(190,210,255,0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(time) {
      if (!document.hidden) draw(time);
      frameId = requestAnimationFrame(loop);
    }

    function onPointerMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      const spot = spotRef.current;
      if (spot) {
        spot.style.setProperty("--mx", `${e.clientX}px`);
        spot.style.setProperty("--my", `${e.clientY}px`);
        spot.classList.add("is-active");
      }
    }

    function onPointerOut(e) {
      if (!e.relatedTarget) {
        mouse.active = false;
        spotRef.current?.classList.remove("is-active");
      }
    }

    function onScroll() {
      scrollY = window.scrollY;
      orbsRef.current?.style.setProperty("--sy", scrollY);
    }

    resize();
    onScroll();
    draw(0);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!reduceMotion) {
      frameId = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("mouseout", onPointerOut);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseout", onPointerOut);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="site-gradient absolute inset-0" />
      <div className="site-grid absolute inset-0" />

      <div ref={orbsRef} className="site-orbs absolute inset-0">
        <div className="site-orb site-orb-gold" />
        <div className="site-orb site-orb-orange" />
        <div className="site-orb site-orb-blue" />
      </div>

      <div className="site-beam absolute inset-0" />
      <div ref={spotRef} className="site-spot absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* B2. CURSOR GLOW
   A small gold dot plus a trailing ring that follows the mouse across the
   whole page and grows over links and buttons.
   Only shown on devices with a real mouse; the normal cursor stays visible. */
function CursorGlow() {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [onTarget, setOnTarget] = useState(false);
  const [shown, setShown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return undefined;

    function onMove(e) {
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
      setOnTarget(
        Boolean(
          e.target instanceof Element &&
            e.target.closest(
              "a, button, input, select, textarea, label, [role='button']"
            )
        )
      );
    }

    function onLeaveWindow(e) {
      if (!e.relatedTarget) setShown(false);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onLeaveWindow);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-[#D7B45A] bg-[#D7B45A]/10"
        style={{ x: ringX, y: ringY, marginLeft: -18, marginTop: -18 }}
        animate={{ scale: onTarget ? 1.7 : 1, opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[#D7B45A]"
        style={{ x, y, marginLeft: -4, marginTop: -4 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

/* B3. TILT CARD
   Tilts its children in 3D toward the mouse, then springs back. */
function TiltCard({ children, className = "" }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 14 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 14 });

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    rotateY.set(px * 16);
    rotateX.set(-py * 16);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ==================================================
   C. SHARED PIECES
================================================== */

/* C1. FLOATING WHITE BOX
   Slides up when scrolled into view, lifts on hover.
   Style (white, orange top edge, gold glow) is `.float-box` in index.css.
   Set lift={false} for big boxes that hold forms. */
function FloatBox({ children, className = "", delay = 0, lift = true }) {
  return (
    <motion.div
      className={`float-box ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay }}
      whileHover={lift ? { y: -6, transition: { duration: 0.25 } } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* C2. SECTION HEADING for text that sits directly on the dark background */
function SectionHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : ""}>
      <span className="text-xs font-bold tracking-[3px] text-[#D7B45A]">
        {eyebrow}
      </span>

      <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
        {title}
      </h2>

      {text && (
        <p className="mt-5 max-w-xl leading-7 text-blue-100/80 md:mx-0">
          {text}
        </p>
      )}
    </div>
  );
}

/* ==================================================
   D. JOB BOARD
================================================== */

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All types");
  const [postOpen, setPostOpen] = useState(false);
  const [form, setForm] = useState(emptyJobForm);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      `${job.title} ${job.company} ${job.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesLocation = job.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesType = type === "All types" || job.type === type;

    return matchesSearch && matchesLocation && matchesType;
  });

  function handlePost(e) {
    e.preventDefault();

    setJobs((previous) => [
      { ...form, id: Date.now() },
      ...previous
    ]);

    setForm(emptyJobForm);
    setPostOpen(false);
  }

  return (
    <section id="jobs" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* D1. heading + Post a Job button */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="YOUR NEXT OPPORTUNITY"
            title="Discover. Apply. Grow."
            text="Explore career opportunities, internships and professional openings across industries."
          />

          <button
            onClick={() => setPostOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D7B45A] px-6 py-4 font-bold text-[#102B50] shadow-lg shadow-[#D7B45A]/30 transition hover:-translate-y-0.5 hover:bg-[#E9CD83]"
          >
            <Plus size={19} />
            Post a Job
          </button>
        </div>

        {/* D2. floating white box holding the filters and listings */}
        <FloatBox lift={false} className="mt-12 p-5 md:p-8">

          {/* SEARCH AND FILTERS */}
          <div className="rounded-2xl border border-slate-200 bg-[#F4F7FC] p-5 md:p-7">
            <div className="mb-5 flex items-center gap-2 font-bold text-[#102B50]">
              <Filter size={19} className="text-[#B28A36]" />
              Find Your Opportunity
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title or company"
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm outline-none focus:border-[#B28A36]"
                />
              </div>

              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or location"
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm outline-none focus:border-[#B28A36]"
                />
              </div>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none focus:border-[#B28A36]"
              >
                <option>All types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Search available listings using the filters above.
              </span>

              <button
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setType("All types");
                }}
                className="text-sm font-semibold text-[#B28A36] hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>

          {/* JOB LISTINGS */}
          <div className="mt-10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#102B50]">
              Available Opportunities
            </h3>

            <span className="text-sm text-slate-500">
              {filteredJobs.length} listing(s)
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFD] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102B50] text-[#D7B45A]">
                <BriefcaseBusiness size={29} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#102B50]">
                {jobs.length === 0
                  ? "No active job listings yet"
                  : "No matching opportunities found"}
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                {jobs.length === 0
                  ? "New opportunities will appear here when genuine job listings are added."
                  : "Try changing your search terms or clearing your filters."}
              </p>

              {jobs.length === 0 && (
                <button
                  onClick={() => setPostOpen(true)}
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#102B50] px-6 py-3 font-semibold text-white hover:bg-[#1C416E]"
                >
                  Post the First Opportunity
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#102B50] text-[#D7B45A]">
                        <Building2 size={23} />
                      </div>

                      <div>
                        <h4 className="font-bold text-[#102B50]">
                          {job.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                      Preview only
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness size={15} /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} /> {job.experience}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {job.description}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <span className="text-xs font-medium text-amber-700">
                      Local browser preview — not publicly published
                    </span>

                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex items-center gap-2 font-bold text-[#102B50] hover:text-[#B28A36]"
                      >
                        Open application link <ArrowRight size={17} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </FloatBox>
      </div>

      {/* D3. POST JOB MODAL */}
      <AnimatePresence>
        {postOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#09182D]/75 p-4 backdrop-blur-sm"
            onClick={() => setPostOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-9"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold tracking-[2px] text-[#B28A36]">
                    EMPLOYER CORNER
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold text-[#102B50]">
                    Post an Opportunity
                  </h3>
                </div>

                <button
                  onClick={() => setPostOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close job form"
                >
                  <X size={22} />
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Add genuine opportunity details. This frontend preview
                does not publish vacancies to the public internet.
              </p>

              <form onSubmit={handlePost} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Job title *</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. AI Engineer"
                      className={jobInputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Company name *</label>
                    <input
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Company name"
                      className={jobInputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Location *</label>
                    <input
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Dehradun / Remote"
                      className={jobInputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Employment type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className={`${jobInputCls} bg-white`}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Experience required *</label>
                  <input
                    required
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. Fresher / 2 years"
                    className={jobInputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Job description *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the role and responsibilities..."
                    className={`${jobInputCls} resize-y`}
                  />
                </div>

                <div>
                  <label className={labelCls}>Application URL</label>
                  <input
                    type="url"
                    value={form.applyUrl}
                    onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
                    placeholder="https://company.com/careers"
                    className={jobInputCls}
                  />
                </div>

                <div className="rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                  Preview mode: this listing exists only in the current
                  browser session. Authentication, moderation and database
                  publishing will be implemented later.
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPostOpen(false)}
                    className="rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#102B50] px-6 py-3 font-semibold text-white hover:bg-[#1C416E]"
                  >
                    <Send size={17} /> Add Preview Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ==================================================
   E. STUDENT FEEDBACK SYSTEM
================================================== */

function FeedbackSection() {
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    name: "",
    course: "",
    rating: 5,
    message: "",
    consent: false
  });

  function handleFeedbackSubmit(e) {
    e.preventDefault();

    const review = {
      id: Date.now(),
      name: form.name.trim(),
      course: form.course,
      rating: form.rating,
      message: form.message.trim(),
      date: new Date().toLocaleDateString("en-IN")
    };

    setReviews((previous) => [review, ...previous]);

    setForm({
      name: "",
      course: "",
      rating: 5,
      message: "",
      consent: false
    });
  }

  return (
    <section id="feedback" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* E1. heading */}
        <div className="mx-auto max-w-3xl text-center">
          <MessageSquare
            className="mx-auto mb-5 text-[#D7B45A]"
            size={36}
          />

          <span className="text-xs font-bold tracking-[3px] text-[#D7B45A]">
            YOUR VOICE MATTERS
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
            Real Experiences. Honest Feedback.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100/80">
            Your experience helps us improve. Share your thoughts about
            your learning journey at Vyom Academy.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-2">

          {/* E2. FEEDBACK FORM (floating white box) */}
          <FloatBox lift={false} className="p-7 md:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#102B50] text-[#D7B45A]">
                <MessageSquare size={23} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#102B50]">
                  Share Your Feedback
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Tell us about your learning experience
                </p>
              </div>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="mt-8 space-y-6">
              <div>
                <label className={labelCls}>Your Name *</label>
                <input
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className={feedbackInputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Course / Program *</label>
                <select
                  required
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className={`${feedbackInputCls} bg-white`}
                >
                  <option value="">Select your program</option>
                  <option>Artificial Intelligence</option>
                  <option>Generative AI</option>
                  <option>Machine Learning</option>
                  <option>Data Science</option>
                  <option>Python Programming</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-[#102B50]">
                  Rate Your Experience *
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} out of 5`}
                      aria-pressed={form.rating === star}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="rounded-md p-1 transition hover:scale-110"
                    >
                      <Star
                        size={31}
                        fill={star <= form.rating ? "#D7B45A" : "transparent"}
                        color={star <= form.rating ? "#B28A36" : "#CBD5E1"}
                      />
                    </button>
                  ))}

                  <span className="ml-2 text-sm font-semibold text-[#102B50]">
                    {form.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className={labelCls}>Your Feedback *</label>

                <textarea
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you liked and what we could improve..."
                  className={`${feedbackInputCls} resize-y leading-6`}
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.message.length}/1000 characters
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#F4F7FC] p-4">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-[#102B50]"
                />

                <span className="text-xs leading-6 text-slate-600">
                  I agree that my submitted feedback may be displayed
                  with my name and selected course after review.
                </span>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#102B50] px-6 py-4 font-bold text-white shadow-lg transition hover:bg-[#1C416E]"
              >
                Submit Feedback
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Your feedback will be treated as a submission for review,
                not automatically as a verified testimonial.
              </p>
            </form>
          </FloatBox>

          {/* E3. FEEDBACK DISPLAY */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Learner Feedback
                </h3>

                <p className="mt-1 text-sm text-blue-100/70">
                  Experiences submitted by learners
                </p>
              </div>

              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                {reviews.length} submission(s)
              </span>
            </div>

            {reviews.length === 0 ? (
              <FloatBox lift={false} className="mt-6 px-6 py-16 text-center">
                <Quote
                  size={38}
                  className="mx-auto mb-5 text-[#B28A36]"
                />

                <h4 className="text-lg font-bold text-[#102B50]">
                  Your feedback belongs here
                </h4>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  We don't display invented reviews. Learner submissions
                  will appear here after they are provided and reviewed.
                </p>
              </FloatBox>
            ) : (
              <div className="mt-6 space-y-5">
                <AnimatePresence>
                  {reviews.map((review) => (
                    <motion.article
                      key={review.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="float-box p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-[#102B50]">
                            {review.name}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500">
                            {review.course}
                          </p>
                        </div>

                        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-800">
                          Pending moderation
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= review.rating ? "#D7B45A" : "transparent"}
                            color={star <= review.rating ? "#B28A36" : "#CBD5E1"}
                          />
                        ))}

                        <span className="ml-2 text-xs text-slate-500">
                          {review.date}
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {review.message}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-amber-800">
                        <ShieldCheck size={15} />
                        Submitted locally · not independently verified
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E8D6A5] bg-[#FFF9E9] p-4">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[#B28A36]"
                size={20}
              />

              <p className="text-xs leading-6 text-slate-600">
                Submissions require review before they can be approved
                as public testimonials. Ratings shown here are individual
                submissions, not an overall academy rating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================
   F. STUDENT AND TRAINER AUTHENTICATION UI
================================================== */

function AuthModal({ role, onClose, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    interest: "",
    terms: false
  });

  const isStudent = role === "Student";
  const isRegister = mode === "register";

  const roleDescription = isStudent
    ? "Your learning journey starts here. Access courses, discover new skills and work towards your goals."
    : "Share your expertise, connect with learners and contribute to the next generation of technology professionals.";

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (isRegister && form.password !== form.confirmPassword) {
      setStatus("Your passwords do not match. Please check and try again.");
      return;
    }

    if (isRegister && !form.terms) {
      setStatus("Please accept the terms to continue.");
      return;
    }

    setStatus(
      "This is a frontend demonstration. Real account creation and sign-in will be enabled after secure authentication is connected."
    );
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setStatus("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-[#07172B]/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-slate-100"
          aria-label="Close portal"
        >
          <X size={21} />
        </button>

        <div className="grid md:grid-cols-[0.85fr_1.15fr]">

          {/* LEFT BRAND PANEL */}
          <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#102B50] p-10 text-white md:flex">
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full border border-[#D7B45A]/20" />
            <div className="absolute bottom-20 right-8 h-40 w-40 rounded-full bg-[#D7B45A]/10 blur-3xl" />

            <div className="relative">
              <img
                src={logoSrc}
                alt="Vyom Academy logo"
                className="h-24 w-24 rounded-2xl bg-white p-2 object-contain"
              />

              <h2 className="mt-7 text-2xl font-extrabold tracking-wide">
                VYOM ACADEMY
              </h2>

              <p className="mt-2 text-[10px] font-bold tracking-[3px] text-[#D7B45A]">
                LEARN • INNOVATE • EXCEL
              </p>
            </div>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D7B45A]/30 bg-[#D7B45A]/10 px-4 py-2 text-xs font-semibold text-[#E8CA7A]">
                {isStudent ? (
                  <GraduationCap size={15} />
                ) : (
                  <Users size={15} />
                )}
                {isStudent ? "STUDENT PORTAL" : "TRAINER PORTAL"}
              </span>

              <h3 className="mt-6 text-3xl font-extrabold leading-tight">
                {isStudent
                  ? "Learn without limits. Grow with confidence."
                  : "Teach what you know. Inspire what comes next."}
              </h3>

              <p className="mt-5 text-sm leading-7 text-blue-100/70">
                {roleDescription}
              </p>

              <div className="mt-9 space-y-4">
                {(isStudent
                  ? [
                      "Explore learning opportunities",
                      "Build practical AI skills",
                      "Work towards career goals"
                    ]
                  : [
                      "Share knowledge and experience",
                      "Connect with learners",
                      "Contribute to future-ready education"
                    ]
                ).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-blue-50"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#D7B45A]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="relative text-xs text-blue-100/50">
              © {new Date().getFullYear()} Vyom Academy
            </p>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="px-6 py-10 sm:px-10 md:px-12 md:py-14">

            <div className="mb-8 flex items-center gap-3 md:hidden">
              <img
                src={logoSrc}
                alt="Vyom Academy logo"
                className="h-14 w-14 object-contain"
              />

              <div>
                <h2 className="font-extrabold tracking-wide text-[#102B50]">
                  VYOM ACADEMY
                </h2>
                <p className="text-[9px] font-bold tracking-[2px] text-[#B28A36]">
                  LEARN • INNOVATE • EXCEL
                </p>
              </div>
            </div>

            <div className="mb-7">
              <span className="text-xs font-bold tracking-[3px] text-[#B28A36]">
                {isStudent ? "STUDENT ACCESS" : "TRAINER ACCESS"}
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-[#102B50]">
                {isRegister ? "Create your account" : "Welcome back"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {isRegister
                  ? `Create your ${role.toLowerCase()} account to get started with Vyom Academy.`
                  : `Sign in to continue to the Vyom Academy ${role.toLowerCase()} portal.`}
              </p>
            </div>

            {/* MODE SWITCH */}
            <div className="mb-8 grid grid-cols-2 rounded-xl bg-[#F1F4F9] p-1">
              <button
                onClick={() => changeMode("signin")}
                className={`rounded-lg py-3 text-sm font-semibold transition ${
                  !isRegister
                    ? "bg-white text-[#102B50] shadow-sm"
                    : "text-slate-500 hover:text-[#102B50]"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => changeMode("register")}
                className={`rounded-lg py-3 text-sm font-semibold transition ${
                  isRegister
                    ? "bg-white text-[#102B50] shadow-sm"
                    : "text-slate-500 hover:text-[#102B50]"
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FULL NAME */}
              {isRegister && (
                <div>
                  <label className={labelCls}>Full Name *</label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      maxLength={100}
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className={`${authInputCls} pr-4`}
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className={labelCls}>Email Address *</label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className={`${authInputCls} pr-4`}
                  />
                </div>
              </div>

              {/* COURSE OR EXPERTISE */}
              {isRegister && (
                <div>
                  <label className={labelCls}>
                    {isStudent ? "Course Interest *" : "Area of Expertise *"}
                  </label>

                  <select
                    required
                    value={form.interest}
                    onChange={(e) =>
                      setForm({ ...form, interest: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#B28A36]"
                  >
                    <option value="">
                      {isStudent
                        ? "Select your course interest"
                        : "Select your expertise"}
                    </option>
                    <option>Artificial Intelligence</option>
                    <option>Generative AI</option>
                    <option>Machine Learning</option>
                    <option>Data Science</option>
                    <option>Python Programming</option>
                    <option>Other</option>
                    {isStudent && <option>Not decided yet</option>}
                  </select>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-semibold text-[#102B50]">
                    Password *
                  </label>

                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() =>
                        setStatus(
                          "Password recovery will be available after the authentication service is connected."
                        )
                      }
                      className="text-xs font-semibold text-[#B28A36] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    minLength={8}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="At least 8 characters"
                    className={`${authInputCls} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#102B50]"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              {isRegister && (
                <div>
                  <label className={labelCls}>Confirm Password *</label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          confirmPassword: e.target.value
                        })
                      }
                      placeholder="Re-enter your password"
                      className={`${authInputCls} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#102B50]"
                    >
                      {showConfirmPassword
                        ? <EyeOff size={19} />
                        : <Eye size={19} />}
                    </button>
                  </div>
                </div>
              )}

              {/* TERMS */}
              {isRegister && (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#F4F7FC] p-4">
                  <input
                    type="checkbox"
                    required
                    checked={form.terms}
                    onChange={(e) =>
                      setForm({ ...form, terms: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 accent-[#102B50]"
                  />

                  <span className="text-xs leading-6 text-slate-600">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
              )}

              {/* STATUS */}
              {status && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-[#E8D6A5] bg-[#FFF9E9] p-4 text-xs leading-6 text-amber-900"
                >
                  {status}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#102B50] px-6 py-4 font-bold text-white shadow-lg shadow-blue-950/10 transition hover:bg-[#1C416E]"
              >
                {isRegister ? "Create Account" : "Sign In"}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              {isRegister
                ? "Already have an account?"
                : "New to Vyom Academy?"}

              <button
                onClick={() => changeMode(isRegister ? "signin" : "register")}
                className="ml-2 font-bold text-[#B28A36] hover:underline"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </p>

            <div className="mt-7 flex items-start gap-2 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-400">
              <ShieldCheck size={17} className="mt-0.5 shrink-0" />

              <p>
                Demo interface only. No password or account details are
                transmitted, stored or authenticated by a backend yet.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ==================================================
   G. MAIN WEBSITE  (page order is at the bottom of this function)
================================================== */

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeLogin, setActiveLogin] = useState("");
  const [authMode, setAuthMode] = useState("signin");
  const [scrolled, setScrolled] = useState(false);

  function openAuth(role, mode = "signin") {
    setAuthMode(mode);
    setActiveLogin(role);
  }

  // Adds a soft shadow to the sticky nav once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* NOTE: this wrapper uses overflow-x-clip (NOT overflow-x-hidden).
     overflow-x-hidden silently breaks `position: sticky`, which is why the
     header did not stay on screen before. It also has NO background colour,
     so the site-wide background shows through. */
  return (
    <div className="min-h-screen overflow-x-clip text-slate-900">

      {/* G1. site-wide animated background + cursor ring */}
      <SiteBackground />
      <CursorGlow />

      {/* G2. NAVIGATION (sticky) */}
      <header
        className={`sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-slate-900/10" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">

          <a
            href="#home"
            onClick={() => setMobileMenu(false)}
            className="flex items-center gap-3"
          >
            <img
              src={logoSrc}
              alt="Vyom Academy logo"
              className="h-14 w-14 object-contain"
            />

            <div>
              <h1 className="flex flex-wrap items-baseline gap-x-2 text-lg font-extrabold tracking-wide text-[#102B50] sm:text-xl">
                VYOM ACADEMY
                <span className="hidden text-xs font-semibold tracking-normal text-slate-500 sm:inline">
                  | By DN Marketing
                </span>
              </h1>

              <p className="text-[9px] font-bold tracking-[2.5px] text-[#B28A36]">
                LEARN • INNOVATE • EXCEL
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-7 xl:flex">
            {navItems.map(([label, link]) => (
              <a
                key={label}
                href={link}
                className="group relative text-sm font-medium text-slate-600 transition hover:text-[#B28A36]"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#D7B45A] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <button
              onClick={() => openAuth("Trainer")}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-[#102B50] transition hover:bg-slate-100"
            >
              Trainer Login
            </button>

            <button
              onClick={() => openAuth("Student")}
              className="rounded-lg border border-[#102B50]/20 px-4 py-3 text-sm font-semibold text-[#102B50] transition hover:border-[#102B50] hover:bg-slate-50"
            >
              Student Login
            </button>

            <button
              onClick={() => openAuth("Student", "register")}
              className="rounded-lg bg-[#D7B45A] px-5 py-3 text-sm font-bold text-[#102B50] shadow-lg shadow-[#D7B45A]/30 transition hover:-translate-y-0.5 hover:bg-[#E9CD83]"
            >
              Enroll Now
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg border border-slate-200 p-2 text-[#102B50] xl:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* MOBILE NAVIGATION */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-200 bg-white xl:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-5">
                {navItems.map(([label, link]) => (
                  <a
                    key={label}
                    href={link}
                    onClick={() => setMobileMenu(false)}
                    className="rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {label}
                  </a>
                ))}

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    openAuth("Student", "register");
                  }}
                  className="mt-3 rounded-lg bg-[#D7B45A] px-4 py-3 font-bold text-[#102B50]"
                >
                  Enroll Now
                </button>

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    openAuth("Trainer");
                  }}
                  className="rounded-lg border border-[#102B50] px-4 py-3 font-semibold text-[#102B50]"
                >
                  Trainer Login
                </button>

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    openAuth("Student");
                  }}
                  className="rounded-lg bg-[#102B50] px-4 py-3 font-semibold text-white"
                >
                  Student Login
                </button>

                <p className="pt-3 text-center text-xs font-medium text-slate-400">
                  Vyom Academy | By DN Marketing
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* G3. HERO (transparent now: the site-wide background shows through) */}
      <section
        id="home"
        className="relative isolate overflow-hidden text-white"
      >
        {/* Hero-only decoration: grid and rings */}
        <div className="hero-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -right-48 -top-48 -z-10 h-[600px] w-[600px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[380px] w-[380px] rounded-full border border-[#D7B45A]/20" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 md:grid-cols-2 md:px-8 md:pb-36 md:pt-24">

          <div>
            {/* Badge */}
            <motion.div
              {...heroItem(0)}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#D7B45A]/30 bg-[#D7B45A]/10 px-4 py-2 text-[13px] font-semibold tracking-wider text-[#E8CA7A]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D7B45A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D7B45A]" />
              </span>
              <Sparkles size={15} />
              EDUCATION FOR THE FUTURE
            </motion.div>

            {/* Headline */}
            <h2 className="font-extrabold leading-[1.12] tracking-tight">
              <motion.span
                {...heroItem(0.15)}
                className="block text-[clamp(2.5rem,5.2vw,4.25rem)]"
              >
                Learn Today.
              </motion.span>

              <motion.span
                {...heroItem(0.3)}
                className="gold-shimmer mt-2 block whitespace-normal pb-2 text-[clamp(2.5rem,5.2vw,4.25rem)] sm:whitespace-nowrap"
              >
                Lead Tomorrow.
              </motion.span>
            </h2>

            {/* Intro copy */}
            <motion.p
              {...heroItem(0.45)}
              className="mt-6 max-w-xl text-base leading-8 text-blue-100/90 md:text-lg"
            >
              Discover the power of Artificial Intelligence. Build
              practical, industry-relevant skills in AI, Generative AI
              and Machine Learning, learn from experts, and prepare
              yourself for the opportunities of tomorrow.
            </motion.p>

            {/* Call to action buttons */}
            <motion.div
              {...heroItem(0.6)}
              className="mt-9 flex flex-wrap gap-4"
            >
              <a
                href="#programs"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#D7B45A] px-7 py-4 font-bold text-[#102B50] shadow-lg shadow-[#D7B45A]/25 transition duration-300 hover:-translate-y-1 hover:bg-[#E9CD83] hover:shadow-xl hover:shadow-[#D7B45A]/40"
              >
                Start Learning
                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </a>

              <a
                href="#jobs"
                className="rounded-lg border border-white/30 px-7 py-4 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#D7B45A]/60 hover:bg-white/10"
              >
                Explore Careers
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.ul
              {...heroItem(0.75)}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6"
            >
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <li
                    key={point.label}
                    className="flex items-center gap-2 text-sm font-medium text-blue-50/90"
                  >
                    <Icon size={18} className="shrink-0 text-[#D7B45A]" />
                    {point.label}
                  </li>
                );
              })}
            </motion.ul>

            {/* Quote */}
            <motion.div
              {...heroItem(0.9)}
              className="mt-8 border-l-2 border-[#D7B45A] pl-5"
            >
              <p className="max-w-lg text-sm italic leading-7 text-blue-100/75">
                "The future belongs to those who learn, adapt, and build with intelligence."
              </p>
            </motion.div>
          </div>

          {/* LOGO CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Pulsing gold halo */}
            <div className="animate-glow absolute -inset-6 rounded-[2.5rem] bg-[#D7B45A]/25 blur-[70px]" />

            {/* Floating logo card: floats up/down, tilts toward the mouse,
                and the logo itself wiggles (faster on hover) */}
            <div className="animate-float relative">
              <TiltCard className="relative overflow-hidden rounded-3xl border border-[#D7B45A]/40 bg-white px-5 py-5 shadow-[0_30px_80px_-20px_rgba(215,180,90,0.45)] ring-1 ring-white/20 sm:px-8 sm:py-7">
                <img
                  src={logoSrc}
                  alt="Vyom Academy original logo"
                  className="animate-wiggle h-72 w-full scale-110 cursor-pointer object-contain md:h-[390px]"
                />

                <div className="mt-3 border-t border-slate-200 pt-5 text-center">
                  <h3 className="text-2xl font-extrabold tracking-wide text-[#102B50]">
                    VYOM ACADEMY
                  </h3>

                  <p className="mt-2 text-xs font-bold tracking-[3px] text-[#B28A36]">
                    LEARN • INNOVATE • EXCEL
                  </p>

                  <p className="mt-3 text-[11px] font-semibold tracking-wide text-slate-400">
                    By DN Marketing
                  </p>
                </div>
              </TiltCard>
            </div>

            {/* Floating chips */}
            {heroChips.map((chip) => {
              const Icon = chip.icon;

              return (
                <div
                  key={chip.label}
                  className={`absolute z-10 ${chip.position} ${chip.float}`}
                >
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-[#0B1F3A]/85 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur">
                    <Icon size={16} className="text-[#D7B45A]" />
                    {chip.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* SCROLL CUE */}
        <motion.a
          href="#explore"
          aria-label="Scroll to explore"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute inset-x-0 bottom-6 hidden justify-center md:flex"
        >
          <span className="animate-nudge flex flex-col items-center gap-1 text-[10px] font-semibold tracking-[3px] text-blue-100/60 transition hover:text-[#D7B45A]">
            SCROLL TO EXPLORE
            <ChevronDown size={20} />
          </span>
        </motion.a>
      </section>

      {/* G4. AUDIENCE (floating white box) */}
      <section id="explore" className="px-6 py-10">
        <FloatBox className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-7 text-center sm:grid-cols-3">
            {[
              { icon: GraduationCap, title: "For Students" },
              { icon: BriefcaseBusiness, title: "For Professionals" },
              { icon: Users, title: "For Trainers" }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center justify-center gap-3"
                >
                  <Icon className="text-[#B28A36]" size={24} />
                  <span className="font-semibold text-[#102B50]">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </FloatBox>
      </section>

      {/* G5. INTRODUCTION (floating white box) */}
      <section className="px-6 py-16">
        <FloatBox lift={false} className="mx-auto max-w-4xl px-6 py-14 text-center md:px-16">
          <span className="text-xs font-bold tracking-[3px] text-[#B28A36]">
            WELCOME TO VYOM
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#102B50] md:text-5xl">
            Education Beyond Boundaries
          </h2>

          <p className="mt-6 leading-8 text-slate-500">
            We envision a learning environment where students,
            working professionals and curious minds can explore
            emerging technologies and develop skills for a changing world.
          </p>
        </FloatBox>
      </section>

      {/* G6. PROGRAMS (three floating white cards) */}
      <section id="programs" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-xs font-bold tracking-[3px] text-[#D7B45A]">
                WHAT YOU CAN LEARN
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                Explore Learning Pathways
              </h2>
            </div>

            <a
              href="#programs"
              className="flex items-center gap-2 font-semibold text-white transition hover:text-[#D7B45A]"
            >
              Explore all <ArrowRight size={17} />
            </a>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {programs.map((program, index) => {
              const Icon = program.icon;

              return (
                <FloatBox key={program.title} delay={index * 0.12} className="p-8">
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-[#102B50] text-[#D7B45A]">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-[#102B50]">
                    {program.title}
                  </h3>

                  <p className="mt-4 min-h-20 text-sm leading-7 text-slate-500">
                    {program.description}
                  </p>

                  <a
                    href="#about"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#B28A36] transition hover:text-[#FF7A1A]"
                  >
                    Learn More
                    <ChevronRight size={17} />
                  </a>
                </FloatBox>
              );
            })}
          </div>
        </div>
      </section>

      {/* G7. JOB BOARD */}
      <JobBoard />

      {/* G8. ABOUT (floating white box) */}
      <section id="about" className="px-6 py-20">
        <FloatBox lift={false} className="mx-auto max-w-7xl p-8 md:p-14">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <span className="text-xs font-bold tracking-[3px] text-[#B28A36]">
                ABOUT VYOM ACADEMY
              </span>

              <h2 className="mt-5 text-4xl font-extrabold leading-tight text-[#102B50] md:text-5xl">
                Empowering Minds for an Intelligent Future.
              </h2>
            </div>

            <div>
              <p className="leading-8 text-slate-600">
                Vyom Academy aims to bridge the gap between education
                and emerging technology. Our vision is to make modern
                technology learning accessible to students, professionals
                and lifelong learners.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Practical and technology-focused learning",
                  "Opportunities for continuous skill development",
                  "A learning community for curious minds"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      className="shrink-0 text-[#B28A36]"
                      size={20}
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FloatBox>
      </section>

      {/* G9. FEEDBACK */}
      <FeedbackSection />

      {/* G10. CALL TO ACTION (dark banner with a gold glow) */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#D7B45A]/50 bg-gradient-to-br from-[#0B1F3A] to-[#14306E] px-7 py-14 text-center text-white shadow-[0_0_80px_-10px_rgba(215,180,90,0.35)] md:px-16">
          <Target className="mx-auto mb-5 text-[#D7B45A]" size={38} />

          <h2 className="text-3xl font-extrabold md:text-4xl">
            Your Future Starts with Learning.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100/70">
            Take the first step towards understanding the technology
            that is shaping tomorrow.
          </p>

          <a
            href="#programs"
            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#D7B45A] px-7 py-4 font-bold text-[#102B50] transition hover:-translate-y-0.5 hover:bg-[#E9CD83]"
          >
            Start Exploring
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* G11. FOOTER */}
      <footer className="bg-[#09182D] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <h2 className="text-2xl font-extrabold tracking-wide">
                VYOM ACADEMY
              </h2>

              <p className="mt-3 text-sm text-blue-100/50">
                Learn. Innovate. Excel.
              </p>

              <p className="mt-2 text-sm font-semibold text-[#D7B45A]">
                Vyom Academy | By DN Marketing
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-blue-100/70">
              {navItems.map(([label, link]) => (
                <a
                  key={label}
                  href={link}
                  className="transition hover:text-[#D7B45A]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-blue-100/40">
            © {new Date().getFullYear()} Vyom Academy | By DN Marketing. All rights reserved.
          </div>
        </div>
      </footer>

      {/* G12. STUDENT / TRAINER AUTHENTICATION */}
      <AnimatePresence>
        {activeLogin && (
          <AuthModal
            key={`${activeLogin}-${authMode}`}
            role={activeLogin}
            initialMode={authMode}
            onClose={() => setActiveLogin("")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;