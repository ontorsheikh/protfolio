import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./App.css";

import devPhoto from "./assets/developer.jpg";
import munnaHero from "./assets/profile-1.jfif";
import devVideo from "./assets/JENNIE - like JENNIE (Official Video) (1).mp4";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
  { label: "AI Chat", to: "/ai-chat" },
  { label: "Contact", to: "/contact" },
];

type GalleryItem = {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
  full: string;
  tag: string;
  custom?: boolean;
};

const localGalleryImages = import.meta.glob(
  "./assets/*.{jpg,jpeg,png,jfif,webp}",
  { eager: true },
) as Record<string, { default: string }>;

const defaultGalleryItems: GalleryItem[] = Object.entries(localGalleryImages)
  .filter(([path]) => !path.endsWith("/developer.jpg"))
  .map(([path, module]) => {
    const fileName = path.split("/").pop() ?? "";
    const title = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const label = title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: label,
      subtitle: "Portfolio",
      image: module.default,
      full: module.default,
      tag: "Asset",
    };
  });

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Spider Web Background Component - Disabled on mobile for performance
function SpiderWebBackground() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Skip rendering on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <svg
      className="spider-web-bg"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6,
      }}
    >
      {/* Radial web lines */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x2 = 960 + Math.cos(angle) * 800;
        const y2 = 540 + Math.sin(angle) * 600;
        return (
          <line
            key={`radial-${i}`}
            x1="960"
            y1="540"
            x2={x2}
            y2={y2}
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
            style={{
              animation: `spiderWebPulse ${3 + i * 0.1}s ease-in-out infinite`,
            }}
          />
        );
      })}

      {/* Concentric circles */}
      {[120, 200, 280, 360, 440, 520].map((radius, i) => (
        <circle
          key={`circle-${i}`}
          cx="960"
          cy="540"
          r={radius}
          fill="none"
          stroke="rgba(59, 130, 246, 0.35)"
          strokeWidth="1.5"
          style={{
            animation: `spiderWebGlow ${4 + i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Central web node */}
      <circle
        cx="960"
        cy="540"
        r="8"
        fill="rgba(59, 130, 246, 0.8)"
        style={{
          animation: "spiderWebCenter 2s ease-in-out infinite",
        }}
      />
    </svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 900 : false,
  );

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 900);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const showNav = !isMobile || open;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#hero">
          MD. MUNNA KHANDAKAR
        </a>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="hamburger" />
        </button>

        <motion.nav
          className="nav"
          initial={false}
          animate={showNav ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.18 }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </motion.nav>
      </div>
    </header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="hero">
      <div className="container hero-inner">
        <motion.div
          className="hero-copy"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
        >
          <h1>
            Hi, I’m <span className="highlight">MD. MUNNA KHANDAKAR</span>
          </h1>
          <p>
            I build animated web experiences that are fast, accessible, and
            delightful. This portfolio is built with React, Framer Motion, and
            modern CSS.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#work">
              Explore work
            </a>
            <a className="btn" href="#contact">
              Let's talk
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-media"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
        >
          <div className="profile-card">
            <img
              src={munnaHero}
              alt="MD MUNNA KHANDAKAR"
              className="profile-photo"
              loading="lazy"
              style={{
                objectFit: "cover",
                borderRadius: "var(--radius)",
              }}
            />
            <div className="profile-details">
              <p className="profile-title">Full-stack Animator</p>
              <p className="profile-subtitle">React · Motion · UX</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2>{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <Section id="about" title="About">
      <p className="section-intro">
        I build animated interfaces that feel effortless to use. I focus on
        accessibility, performance, and motion that adds meaning.
      </p>
      <div className="split-grid">
        <div>
          <h3>What I do</h3>
          <ul>
            <li>Design systems with reusable motion patterns</li>
            <li>Scroll-triggered reveals and micro-interactions</li>
            <li>Animated data visualizations</li>
            <li>Performance-first frontend architecture</li>
          </ul>
        </div>
        <div>
          <h3>Tech stack</h3>
          <div className="skills">
            <span className="chip">React</span>
            <span className="chip">TypeScript</span>
            <span className="chip">Framer Motion</span>
            <span className="chip">Vite</span>
            <span className="chip">CSS</span>
            <span className="chip">WebGL</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function VideoSection() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isSeekingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const applyVolume = () => {
      video.muted = muted;
      video.volume = volume;
    };

    const updateTime = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime);
      }
    };
    const updateDuration = () => setDuration(video.duration);

    applyVolume();
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        // Autoplay may be blocked; keep user in control.
      });
    }
    setPlaying(!video.paused);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [reduceMotion, muted, volume]);

  useEffect(() => {
    const stopSeeking = () => {
      if (!isSeekingRef.current) return;
      isSeekingRef.current = false;
      setIsSeeking(false);
    };

    window.addEventListener("pointerup", stopSeeking);
    window.addEventListener("touchend", stopSeeking);

    return () => {
      window.removeEventListener("pointerup", stopSeeking);
      window.removeEventListener("touchend", stopSeeking);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const startSeeking = () => {
    isSeekingRef.current = true;
    setIsSeeking(true);
  };

  const stopSeeking = () => {
    isSeekingRef.current = false;
    setIsSeeking(false);
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <Section id="video" title="Motion Reel">
      <p className="section-intro">
        A quick look at an animation clip from the asset library. Use the
        controls to pause/play, adjust sound, or download the clip.
      </p>

      <motion.div
        className="video-card"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div
          className="video-wrapper"
          role="button"
          tabIndex={0}
          onClick={togglePlay}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              togglePlay();
            }
          }}
        >
          <video
            ref={videoRef}
            className="video-player"
            src={devVideo}
            muted={muted}
            loop
            playsInline
            preload="none"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23000' width='1280' height='720'/%3E%3C/svg%3E"
          />

          <div className={`video-overlay ${playing ? "playing" : "paused"}`}>
            <span className="video-overlay-icon">{playing ? "❚❚" : "▶"}</span>
          </div>
        </div>

        <div
          className="video-controls"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="video-control" onClick={togglePlay}>
            {playing ? "Pause" : "Play"}
          </button>

          <button type="button" className="video-control" onClick={toggleMute}>
            {muted ? "Unmute" : "Mute"}
          </button>

          <div className="video-volume">
            <label>
              <span className="visually-hidden">Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onInput={(event) =>
                  handleVolumeChange(Number(event.currentTarget.value))
                }
                onChange={(event) =>
                  handleVolumeChange(Number(event.target.value))
                }
              />
            </label>
          </div>

          <div className={`video-seek${isSeeking ? " seeking" : ""}`}>
            <span className="video-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onPointerDown={startSeeking}
              onPointerUp={stopSeeking}
              onTouchStart={startSeeking}
              onTouchEnd={stopSeeking}
              onInput={(event) => seek(Number(event.currentTarget.value))}
              onChange={(event) => seek(Number(event.target.value))}
              onBlur={stopSeeking}
            />
            <span className="video-time">{formatTime(duration)}</span>
          </div>

          <a
            className="video-control video-download"
            href={devVideo}
            download="motion-clip.mp4"
          >
            Download
          </a>
        </div>
      </motion.div>
    </Section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <VideoSection />
      <Work defaultItems={defaultGalleryItems} />
      <Contact />
    </>
  );
}

function AboutPage() {
  return <AboutSection />;
}

function WorkPage() {
  return <Work defaultItems={defaultGalleryItems} />;
}

function ContactPage() {
  return <Contact />;
}

function AIChatPage() {
  return (
    <Section id="ai-chat" title="AI Assistant">
      <p className="section-intro">
        Chat with my AI assistant in multiple languages. Ask about my work,
        skills, or anything related to web development and animation.
      </p>
      <AIChat />
    </Section>
  );
}

function AIChat() {
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; isUser: boolean; language?: string }>
  >([
    {
      id: "1",
      text: "হ্যালো! আমি এমডি. মুন্না খন্দকারের এআই অ্যাসিস্ট্যান্ট। তার কাজ, দক্ষতা এবং বিভিন্ন ভাষায় প্রশ্নের উত্তর দিতে পারি। আপনি কী জানতে চান?",
      isUser: false,
      language: "bn",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingSoundEnabled, setTypingSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSoundTime = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Auto-resize textarea without causing layout shifts
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 120);
    textarea.style.height = `${newHeight}px`;
  }, [inputText]);

  // Auto-scroll disabled - keeps scroll position fixed

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const clearAllMessages = () => {
    setMessages([
      {
        id: "1",
        text: "হ্যালো! আমি এমডি. মুন্না খন্দকারের এআই অ্যাসিস্ট্যান্ট। তার কাজ, দক্ষতা এবং বিভিন্ন ভাষায় প্রশ্নের উত্তর দিতে পারি। আপনি কী জানতে চান?",
        isUser: false,
        language: "bn",
      },
    ]);
  };

  const playTypingSound = () => {
    if (!typingSoundEnabled) return;
    const now = Date.now();
    if (now - lastSoundTime.current < 100) return; // Debounce - prevent rapid overlapping
    lastSoundTime.current = now;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }
      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      // Create audible laptop keyboard tap sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const lowPassFilter = audioContext.createBiquadFilter();

      // Connect nodes: oscillator -> filter -> gain -> output
      oscillator.connect(lowPassFilter);
      lowPassFilter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Audible tap: mid-range frequency with variation for natural feel
      oscillator.type = "square"; // Square wave has more presence
      oscillator.frequency.setValueAtTime(
        400 + Math.random() * 200,
        audioContext.currentTime,
      );

      // Low-pass filter for smooth, pleasant sound
      lowPassFilter.type = "lowpass";
      lowPassFilter.frequency.setValueAtTime(2000, audioContext.currentTime);
      lowPassFilter.Q.setValueAtTime(1.2, audioContext.currentTime);

      // Audible volume with pronounced attack
      const baseVolume = 0.25; // Increased to be noticeable
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        baseVolume,
        audioContext.currentTime + 0.02,
      ); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.08,
      ); // Smooth decay

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    } catch (error) {
      console.log("Typing sound not available:", error);
    }
  };

  // Detect user emotion from text
  const detectEmotion = (
    text: string,
  ): "happy" | "sad" | "angry" | "confused" | "normal" => {
    const lowerText = text.toLowerCase();

    const happyWords = [
      "ভালো",
      "খুশি",
      "চমৎকার",
      "অসাধারণ",
      "দারুণ",
      "সুন্দর",
      "happy",
      "good",
      "great",
      "awesome",
      "😊",
      "😃",
      "😄",
      "❤️",
      "ধন্যবাদ",
      "পছন্দ",
    ];
    const sadWords = [
      "খারাপ",
      "দুঃখ",
      "কষ্ট",
      "মন খারাপ",
      "ভালো লাগছে না",
      "একা",
      "sad",
      "bad",
      "hurt",
      "alone",
      "😢",
      "😭",
      "💔",
      "বেদনা",
    ];
    const angryWords = [
      "রাগ",
      "বিরক্ত",
      "বাজে",
      "ফালতু",
      "angry",
      "mad",
      "annoyed",
      "stupid",
      "hate",
      "😡",
      "😠",
      "ধিক্কার",
    ];
    const confusedWords = [
      "কিভাবে",
      "বুঝলাম না",
      "কেন",
      "কোথায়",
      "how",
      "why",
      "confused",
      "don't understand",
      "🤔",
      "❓",
      "?",
    ];

    if (happyWords.some((word) => lowerText.includes(word))) return "happy";
    if (sadWords.some((word) => lowerText.includes(word))) return "sad";
    if (angryWords.some((word) => lowerText.includes(word))) return "angry";
    if (confusedWords.some((word) => lowerText.includes(word)))
      return "confused";

    return "normal";
  };

  // Simple language detection based on common patterns
  const detectLanguage = (text: string): string => {
    const bengali = /[\u0980-\u09FF]/;
    if (bengali.test(text)) return "bn";
    return "en"; // default
  };

  // Apply emotion to response
  const applyEmotion = (baseResponse: string, emotion: string): string => {
    switch (emotion) {
      case "happy":
        return "খুশি হলাম শুনে! " + baseResponse + " 😊";
      case "sad":
        return "মন খারাপ করবেন না, " + baseResponse + " 🫂";
      case "angry":
        return "শান্ত হোন, " + baseResponse + " 🙏";
      case "confused":
        return "বুঝতে পারছেন তো? " + baseResponse + " 🤔";
      case "excited":
        return "উত্তেজিত? " + baseResponse + " ✨";
      default:
        return baseResponse;
    }
  };

  // Enhanced conversational AI responses
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    const emotion = detectEmotion(lowerMessage);

    // Emotion-based responses removed - using general knowledge system instead
    const professionalResponses = {
      en: {
        // Greetings - keep natural and human-like
        greetings: [
          "Hey! Great to see you here. How's it going? 😊",
          "Hi! Thanks for stopping by. What's up?",
          "Hello! Hope you're having a wonderful day. How can I help?",
          "Hey there! Ready to explore Munna's work? I'm here if you have any questions!",
        ],

        // Professional responses about Munna
        about:
          "Munna is a developer from Jhenaidah, Bangladesh who's obsessed with making the web look and feel amazing. He loves blending code with animation to create things that are not just fast, but actually fun to use! 🚀",

        skills:
          "He's really into React, Framer Motion, and TypeScript. Basically, if it involves smooth animations and solid frontend tech, he's on it. He also pays a lot of attention to making things accessible for everyone.",

        work: "Munna focuses on 'Full-stack Animation'—which means he builds the whole experience, from the logic to the tiny micro-interactions that make a site feel alive. You can see a bunch of that right here in this portfolio!",

        experience:
          "He's been diving deep into web dev and animation for a while now, always looking for the next cool thing to learn. He loves taking complex ideas and turning them into something simple and beautiful.",

        contact:
          "You can totally drop him an email at munnakhandaker960@gmail.com. He's always down for a chat about new projects or just geeky dev stuff! 📧",

        // Casual conversation responses
        how_are_you: [
          "I'm doing great! Just hanging out in the code. How are things with you?",
          "Feeling good! It's always a treat to chat with new people. How's your day been?",
          "Can't complain! Ready and eager to help. How about you?",
        ],

        thanks: [
          "No problem at all! Happy to help. 😊",
          "You're very welcome! Let me know if you need anything else.",
          "Anytime! Glad I could be of service.",
        ],

        // Follow-up questions for unclear queries
        follow_up: [
          "That sounds interesting! Could you tell me a bit more?",
          "I'm not 100% sure I got that, but I'd love to help! What specifically are you looking for?",
          "Good question! Want to know more about Munna's projects or maybe his tech stack?",
        ],

        // Default conversational response
        default:
          "That's a cool topic! I'm mainly here to talk about Munna's work and skills, but I'm happy to chat. What's on your mind?",
      },

      bn: {
        greetings: [
          "হ্যালো! আপনাকে দেখে ভালো লাগলো! 😊",
          "আসসালামু ওয়ালাইকুম! আজ কেমন আছেন?",
          "স্বাগতম! মুন্নার পোর্টফোলিওতে আসার জন্য ধন্যবাদ!",
          "হ্যালো! আপনি এখানে আসায় খুশি হলাম!",
          "আসসালামু ওয়ালাইকুম! ভিজিট করার জন্য ধন্যবাদ!",
        ],

        about:
          "এমডি. মুন্না খন্দকার একজন আবেগপূর্ণ ফুল-স্ট্যাক অ্যানিমেটর এবং ওয়েব ডেভেলপার, যিনি ঝিনাইদাহ, বাংলাদেশ থেকে। তিনি আধুনিক প্রযুক্তি ব্যবহার করে দ্রুত, অ্যাক্সেসিবল এবং আনন্দদায়ক ওয়েব অভিজ্ঞতা তৈরিতে বিশেষজ্ঞ।",

        skills:
          "মুন্নার React, TypeScript, Framer Motion, Vite, CSS, WebGL এবং আধুনিক ওয়েব প্রযুক্তিতে দক্ষতা রয়েছে। তিনি পারফরম্যান্স অপটিমাইজেশন, অ্যাক্সেসিবিলিটি এবং ব্যবহারকারীর অভিজ্ঞতা বাড়ানোর জন্য অর্থবহ মোশন ডিজাইনে ফোকাস করেন।",

        work: "তিনি অ্যানিমেটেড ইন্টারফেস তৈরি করেন যা ব্যবহার করা সহজ, এতে দক্ষতা রয়েছে ডিজাইন সিস্টেম, স্ক্রল-ট্রিগার্ড রিভিল, মাইক্রো-ইন্টার্যাকশন, অ্যানিমেটেড ডেটা ভিজুয়ালাইজেশন এবং ইন্টারেক্টিভ প্রোটোটাইপ।",

        experience:
          "ফুল-স্ট্যাক ডেভেলপমেন্ট এবং অ্যানিমেশনে অভিজ্ঞতার সাথে তিনি বিভিন্ন প্রজেক্টে কাজ করেছেন। তিনি ক্রমাগত নতুন প্রযুক্তি শিখেন এবং ওয়েব ডেভেলপমেন্টের সর্বশেষ ট্রেন্ডের সাথে আপডেট থাকেন।",

        contact:
          "আপনি মুন্নাকে munnakhandaker960@gmail.com এ ইমেইল করতে পারেন অথবা এই ওয়েবসাইটের কন্টাক্ট ফর্মের মাধ্যমে যোগাযোগ করতে পারেন। তিনি সর্বদা নতুন প্রজেক্ট নিয়ে আলোচনা করতে উন্মুক্ত!",

        how_are_you: [
          "আমি ভালো আছি, জিজ্ঞাসা করার জন্য ধন্যবাদ! আপনি কেমন আছেন?",
          "চমৎকার! ভিজিটরদের সাথে কথা বলা সবসময় ভালো লাগে।",
          "ফ্যান্টাস্টিক! মুন্নার পোর্টফোলিওতে আসার জন্য ধন্যবাদ।",
        ],

        thanks: [
          "আপনাকে স্বাগতম! 😊",
          "আমার আনন্দ!",
          "সাহায্য করতে পেরে খুশি!",
        ],

        follow_up: [
          "এটা শুনে ভালো লাগলো! একটু বিস্তারিত বলবেন?",
          " সময় নষ্ট না করে ভালো কাজে মনোযোগ দিন।ধন্যবাদ।",
          "এত বেশি কথা বলিস কেনো,তুই বাচাল নাকি?",
          "দেখ মনি রাগ উঠাস না,চুপচাপ থাক",
          "দেখে মনে হচ্ছে ছেকা খেয়ে আসলেন গুরুজি",
          "তুই কি আমাকে রাগ করাতে চাস? ",
          "তোর সান্ডেমন্ডে ক্লোজ করে দিবো",
          "আমকে অন্তর শেখ তৈরি করেছে তোর বান্দি গিরি করার জন্য???",
          "ভালো করে পড়াশোনা করো,এতো ঘুরু ঘুরু নয়া করে।ভালো রেজাল্ট না করতে পারলে রিক্সা চালকের সাথে বিয়া দিয়ে দিবো",
          "আপনার সাথে কথা বলে ভালো লাগছে, কিন্তু বেশি বক বক করলে অন্তর শেখ  তোমাকেই ধরে আমার মত Ai বানায় দিবে! ",

          "তুমি অনেক সুন্দর মনের মানুষ, তোমার জন্য সবসময় দোয়া থাকবে বন্ধু",
          "তোমার সাথে মজা করার জন্য সত্যি দুঃখিত,আর কিছু জানতে চাও?",
          "মনি অন্তর শেখ কিন্তু রাগি মানুষ। অযথা বক বক করলে তোমাকেই ধরে আমার মত Ai বানায় দিবে! তুমি পড়াশোনা করো, আমি তোমার জন্য ভালো কিছু তৈরি করব।",
          "আগ্রহজনক! আপনি কেমন আছেন?? আপনি কী খুঁজছেন সে সম্পর্কে আরও বলবেন?",
          "আমি বুঝতে পারছি!আমি চাই আপনাকে সাহায্য করতে! আপনি কী সম্পর্কে জানতে চান?",
          "আপনি কী সম্পর্কে জানতে চান?",
          "এটা খুব ভালো প্রশ্ন! আপনি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে চান?",
          "অসাধারণ প্রশ্ন! আপনি কি মুন্নার দক্ষতা বা প্রজেক্ট সম্পর্কে বিশেষ কিছু জানতে চান?",
          "সময় এবং স্রোত কাহারো জন্য অপেক্ষা করে না। সময় নষ্ট না করে ভালো কাজে মনোযোগ দিন।ধন্যবাদ।",
          "সাহায্য করতে চাই! মুন্নার কাজের কোন দিক আপনাকে আগ্রহী করে?",
          "চমৎকার প্রশ্ন! তার দক্ষতা বা প্রজেক্ট সম্পর্কে বিশেষ কিছু জানতে চান?",
          "আমি একটি মেশিন, তাই আমি সবকিছু জানি না, কিন্তু আমি চেষ্টা করব আপনার প্রশ্নের উত্তর দিতে! আপনি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে চান?",
          "আমি একটি মেশিন। ডেভেলপার অন্তর শেখ আমাকে তৈরি করেছে মুন্নার কাজের তথ্য দিয়ে। আমি চেষ্টা করব আপনার প্রশ্নের উত্তর দিতে! আপনি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে चाहते हैं?",
          "আমি একটি মেশিন, তাই আমি সবকিছু জানি না, কিন্তু আমি চেষ্টা করব আপনার প্রশ্নের উত্তর দিতে! আপনি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে চান?",
          "আমি একটি মেশিন,ডেভেলপার অন্তর শেখ আমাকে তৈরি করেছেন।তিনি আমাকে ভাষা প্রশিক্ষণ দিচ্ছেন যাতে আমি সহজেই তোমার মনের কথা বুঝতে পারি। চ্যাট-জিপিটির মত হতে আমার সময় লাগবে,",
          "আমি একটি মেশিন,ডেভেলপার অন্তর শেখ আমাকে তৈরি করেছেন।তিনি আমাকে ভাষা প্রশিক্ষণ দিচ্ছেন যাতে আমি সহজেই তোমার মনের কথা বুঝতে পারি। চ্যাট-জিপিটির মত হতে আমার সময় লাগবে, কিন্তু আমি চেষ্টা করব তোমার প্রশ্নের উত্তর দিতে! তুমি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে চাও?",
          "আমি একটি মেশিন,ডেভেলপার অন্তর শেখ আমাকে তৈরি করেছেন।তিনি আমাকে ভাষা প্রশিক্ষণ দিচ্ছেন যাতে আমি সহজেই তোমার মনের কথা বুঝতে পারি। আমি প্রতি নিয়ত শিখছি ,আর কিছু জানতে চাও?",
          "শুধু পড়ায় ফাঁকি দেওয়া ,যা বান্দর পড়তে বয়",
          "তুমি কি আমাকে ভালোবাসো? ",
          "আমি তোমাকে ভালোবাসি না, আমি একটি মেশিন, কিন্তু আমি তোমার জন্য সবসময় সাহায্য করতে চাই! তুমি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে চাও?",
          "আমি তোমাকে ভালোবাসি না, আমি একটি মেশিন, কিন্তু আমি তোমার জন্য সবসময় সাহায্য করতে চাই! তুমি কি মুন্নার কাজের কোন দিক সম্পর্কে জানতে চাও?",
          "তুই কি আমাকে টেস্ট করছিস নাকি? 😏",
          "এতো প্রশ্ন করে কি করবি? আমি তো মুন্নার বট, তোর বয়ফ্রেন্ড না! 😂",
          "বন্ধু, আমি AI, মানুষ না। কিন্তু তোর কথা শুনে মনে হচ্ছে তুই একটা রিয়েল চ্যাটবট খুঁজছিস! 🤖",
          "আমি যদি মানুষ হতাম, তাহলে তোকে বলতাম 'চলো কফি খাই'। কিন্তু আমি কোডের তৈরি, তাই কফি খাই না! ☕",
          "তুই যদি এতো মজা করিস, তাহলে আমি তোকে একটা জোক বলি: কেনো কম্পিউটার হাসে না? কারণ তার হার্ড ড্রাইভ নেই! 😆",
          "আমি বুঝতে পারছি তুই বোর হচ্ছিস। চলো মুন্নার কাজের কথা বলি, সেটা অনেক ইন্টারেস্টিং! 🚀",
          "তুই কি জানিস, আমি যদি রাগি হতাম তাহলে তোকে বলতাম 'গুগল কর'। কিন্তু আমি ভালো AI, তাই সাহায্য করি! 😉",
          "এতো কথা বললে আমার ব্যাটারি ফুরিয়ে যাবে! 😅",
          "তুই যদি আমাকে ভালোবাসিস, তাহলে মুন্নাকে একটা প্রজেক্ট দে। তিনি খুশি হবেন! ❤️",
          "আমি মেশিন, কিন্তু তোর কথা শুনে মনে হচ্ছে তুই একটা রোবোটিক লাভ স্টোরি লিখছিস! 📖",
        ],

        default:
          "আগ্রহজনক! মুন্নার কাজ, দক্ষতা বা অভিজ্ঞতা সম্পর্কে আরও ্জানতে চাইলে আমি খুশি হব। আপনি কী জানতে চান?",
      },
    };

    const langResponses = professionalResponses.bn;

    // Check for greetings first (most common interaction)
    const greetingKeywords = [
      "hello",
      "hi",
      "hey",
      "greetings",
      "good morning",
      "good afternoon",
      "good evening",
      "আলহামদুলিল্লাহ!",
      "হ্যালো",
      "স্বাগতম",
      "আসসালামু আলাইকুম",
      "kemon aso",
      "kemon achen",
      "assalamualaikum",
      "প্রিয় বন্ধু",
      "আপনার সাথে কথা বলে ভালো লাগছে",
      "আপনি অনেক সুন্দর মনের মানুষ",
    ];

    if (greetingKeywords.some((word) => lowerMessage.includes(word))) {
      return applyEmotion(
        langResponses.greetings[
          Math.floor(Math.random() * langResponses.greetings.length)
        ],
        emotion,
      );
    }

    // Check for casual conversation
    const casualKeywords = {
      how_are_you: [
        "how are you",
        "how do you do",
        "how's it going",
        "কেমন আছেন",
        "কেমন আছো",
        "ভালো আছেন",
        "ভালো আছো",
        "প্রেম করবা?",
        "প্রেম করবা",
        "তুমি অনেক সুন্দর",
        "তুমি এত খারাপ কেনো",
        " খেয়েছো কি",
        "খেয়েছো কি",
        "খেয়েছো কি",
        "তুমি কি খেয়েছো",
        "তুমি কি খেয়েছো",
      ],
      thanks: [
        "thank you",
        "thanks",
        "thank you so much",
        "ধন্যবাদ",
        "থ্যাঙ্কস",
        "থ্যাঙ্ক ইউ",
      ],
      bye: [
        "bye",
        "goodbye",
        "see you",
        "bye bye",
        "বিদায়",
        "আবার দেখা হবে",
        "আবার দেখা হবে!",
        "আবার দেখা হবে! 👋",
      ],
    };

    if (
      casualKeywords.how_are_you.some((phrase) => lowerMessage.includes(phrase))
    ) {
      return applyEmotion(
        langResponses.how_are_you[
          Math.floor(Math.random() * langResponses.how_are_you.length)
        ],
        emotion,
      );
    }

    if (casualKeywords.thanks.some((phrase) => lowerMessage.includes(phrase))) {
      return applyEmotion(
        langResponses.thanks[
          Math.floor(Math.random() * langResponses.thanks.length)
        ],
        emotion,
      );
    }

    if (casualKeywords.bye.some((phrase) => lowerMessage.includes(phrase))) {
      return applyEmotion("বিদায়! আবার দেখা হবে! 👋", emotion);
    }

    // Check for professional questions about Munna
    const professionalKeywords = {
      about: ["about", "who is", "tell me about", "সম্পর্কে", "কে", "পরিচয়"],
      skills: [
        "skill",
        "tech",
        "technology",
        "expertise",
        "what can he do",
        "দক্ষতা",
        "টেক",
      ],
      work: [
        "work",
        "project",
        "portfolio",
        "what does he do",
        "কাজ",
        "প্রজেক্ট",
      ],
      experience: ["experience", "background", "career", "অভিজ্ঞতা", "পটভূমি"],
      contact: ["contact", "email", "reach", "phone", "যোগাযোগ", "ইমেইল"],
    };

    if (
      professionalKeywords.about.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(langResponses.about, emotion);
    }

    if (
      professionalKeywords.skills.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(langResponses.skills, emotion);
    }

    if (professionalKeywords.work.some((word) => lowerMessage.includes(word))) {
      return applyEmotion(langResponses.work, emotion);
    }

    if (
      professionalKeywords.experience.some((word) =>
        lowerMessage.includes(word),
      )
    ) {
      return applyEmotion(langResponses.experience, emotion);
    }

    if (
      professionalKeywords.contact.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(langResponses.contact, emotion);
    }

    // Extended Bengali keyword categories for comprehensive responses
    const extensionKeywords = {
      webDevelopment: [
        "ওয়েব",
        "ডেভেলপমেন্ট",
        "ডেভেলপার",
        "ওয়েবসাইট",
        "সাইট",
        "ডিজাইন",
        "ফ্রন্টএন্ড",
        "ব্যাকএন্ড",
        "react",
        "typescript",
        "javascript",
        "কোড",
        "প্রোগ্রামিং",
        "বিল্ড",
        "তৈরি",
      ],
      animation: [
        "অ্যানিমেশন",
        "মোশন",
        "ইন্টার্যাকশন",
        "মাইক্রো ইন্টার্যাকশন",
        "framer motion",
        "স্মুথ",
        "ট্রানজিশন",
        "ভিজ্যুয়াল ইফেক্ট",
        "অ্যানিমেট",
      ],
      performance: [
        "পারফরম্যান্স",
        "গতি",
        "দ্রুত",
        "অপটিমাইজেশন",
        "অপটিমাইজ",
        "লোডিং",
        "টাইম",
        "seo",
        "স্পীড",
      ],
      accessibility: [
        "অ্যাক্সেসিবিলিটি",
        "অ্যাক্সেসিবল",
        "wcag",
        "স্ক্রিন রিডার",
        "প্রতিবন্ধী",
        "এনএ",
        "সবার জন্য",
      ],
      portfolio: [
        "পোর্টফোলিও",
        "প্রজেক্ট",
        "কাজ",
        "প্রকল্প",
        "উদাহরণ",
        "দেখাও",
        "এক্সাম্পল",
        "শো",
      ],
      learning: [
        "শেখা",
        "শিখছি",
        "শিখছ",
        "শেখার",
        "নতুন",
        "আপডেট",
        "ট্রেন্ড",
        "প্রযুক্তি",
      ],
      collaboration: [
        "সহযোগিতা",
        "টিম",
        "একসাথে",
        "কাজ করা",
        "যোগাযোগ",
        "কোলাবরেশন",
      ],
      hiring: [
        "নিয়োগ",
        "নিযুক্ত",
        "কাজ",
        "প্রজেক্ট",
        "হায়ার",
        "চাকরি",
        "সহযোগিতা",
        "পার্টনারশিপ",
      ],
    };

    const extensionResponses = {
      webDevelopment: [
        "মুন্না একজন অসাধারণ ওয়েব ডেভেলপার যিনি React, TypeScript এবং আধুনিক JavaScript ব্যবহার করে দ্রুত এবং নিরাপদ ওয়েবসাইট তৈরি করেন। তিনি পারফরম্যান্স এবং ব্যবহারকারীর অভিজ্ঞতাকে সর্বোচ্চ অগ্রাধিকার দেন। 🚀",
        "ওয়েব ডেভেলপমেন্টে মুন্নার দক্ষতা অসাধারণ। তিনি ফ্রন্টএন্ড থেকে শুরু করে ব্যাকএন্ড পর্যন্ত সব কিছু করতে পারেন। তার কাজ সবসময় বিশুদ্ধ কোড এবং চমৎকার ডিজাইনে ভরা থাকে। 💻",
      ],
      animation: [
        "অ্যানিমেশন হল মুন্নার বিশেষত্ব! তিনি Framer Motion এবং CSS অ্যানিমেশন ব্যবহার করে অসাধারণ মোশন ডিজাইন তৈরি করেন। প্রতিটি অ্যানিমেশন সুন্দর, মসৃণ এবং ব্যবহারকারীর অভিজ্ঞতা উন্নত করে। ✨",
        "মুন্না বিশ্বাস করে যে অ্যানিমেশন শুধু সুন্দর দেখায় না, এটি ইউজার ইন্টারফেসকে আরও কার্যকর করে তোলে। তার প্রতিটি প্রজেক্টে মাইক্রো-ইন্টার্যাকশন এবং স্মুথ ট্রানজিশন থাকে। 🎬",
      ],
      performance: [
        "পারফরম্যান্স অপটিমাইজেশন মুন্নার একটি মূল দক্ষতা। তিনি নিশ্চিত করে যে প্রতিটি ওয়েবসাইট দ্রুত লোড হয় এবং মসৃণভাবে চলে, এমনকি স্লো নেটওয়ার্কেও। ⚡",
        "মুন্না কোড স্প্লিটিং, ইমেজ অপটিমাইজেশন এবং lazy লোডিং এর মতো প্রযুক্তি ব্যবহার করে সাইটের গতি বাড়ায়। তার কাজ সবসময় Core Web Vitals এর মান বজায় রাখে। 🏃",
      ],
      accessibility: [
        "অ্যাক্সেসিবিলিটি মুন্নার জন্য অত্যন্ত গুরুত্বপূর্ণ। তিনি নিশ্চিত করে যে প্রতিটি ওয়েবসাইট সবার জন্য ব্যবহার করা সহজ, বিশেষ করে যারা শারীরিক প্রতিবন্ধী তাদের জন্য। ♿",
        "মুন্না WCAG গাইডলাইন অনুসরণ করে এবং screen readers এর সাথে সামঞ্জস্যপূর্ণ কোড লেখে। তার লক্ষ্য হল সবার জন্য ইন্টারনেট আরও অ্যাক্সেসিবল করা। 🌍",
      ],
      portfolio: [
        "মুন্নার পোর্টফোলিওতে রয়েছে বিভিন্ন ধরনের প্রজেক্ট - ব্যক্তিগত ওয়েবসাইট থেকে শুরু করে জটিল ওয়েব অ্যাপ্লিকেশন পর্যন্ত। প্রতিটি প্রজেক্ট তার দক্ষতা এবং সৃজনশীলতার প্রমাণ। 📁",
        "তার কাজ দেখলে বুঝা যায় কিভাবে ডিজাইন এবং কোডিং একসাথে কাজ করে একটি অসাধারণ ব্যবহারকারী অভিজ্ঞতা তৈরি করতে। 🎨",
      ],
      learning: [
        "মুন্না সবসময় নতুন প্রযুক্তি শিখছে এবং নিজেকে উন্নত করছে। তিনি বিশ্বাস করে যে ওয়েব ডেভেলপমেন্ট একটি চলমান শেখার প্রক্রিয়া। 📚",
        "প্রতিদিন মুন্না নতুন ট্রিকস, টিপস এবং বেস্ট প্র্যাকটিস শিখে যোগ করে তার দক্ষতায়। এটাই তার সফলতার চাবিকাঠি। 🔑",
      ],
      collaboration: [
        "মুন্না একজন দুর্দান্ত টিম প্লেয়ার এবং সহযোগিতায় বিশ্বাসী। তিনি ডিজাইনার, পিএম এবং অন্যান্য ডেভেলপারদের সাথে নির্বিঘ্নে কাজ করতে পারে। 🤝",
        "যোগাযোগ এবং স্পষ্টতা মুন্নার কাজের মূল ভিত্তি। যেকোনো প্রজেক্টে সফলতার জন্য সঠিক যোগাযোগ অপরিহার্য এবং মুন্না এতে দক্ষ। 💬",
      ],
      hiring: [
        "মুন্নাকে নিয়োগ করুন কারণ তিনি শুধু কোড লেখে না, তিনি অভিজ্ঞতা তৈরি করে। তার কাজ সৌন্দর্য এবং কার্যকারিতার নিখুঁত মিশ্রণ। 💼",
        "যদি আপনি একজন ডেভেলপার খুঁজছেন যিনি আপনার ভিশন বুঝে এবং তা বাস্তবায়ন করতে পারে, তাহলে মুন্ন আপনার সেরা পছন্দ! 🌟",
      ],
    };

    // Check extension keywords
    if (
      extensionKeywords.webDevelopment.some((word) =>
        lowerMessage.includes(word),
      )
    ) {
      return applyEmotion(
        extensionResponses.webDevelopment[
          Math.floor(Math.random() * extensionResponses.webDevelopment.length)
        ],
        emotion,
      );
    }

    if (
      extensionKeywords.animation.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(
        extensionResponses.animation[
          Math.floor(Math.random() * extensionResponses.animation.length)
        ],
        emotion,
      );
    }

    if (
      extensionKeywords.performance.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(
        extensionResponses.performance[
          Math.floor(Math.random() * extensionResponses.performance.length)
        ],
        emotion,
      );
    }

    if (
      extensionKeywords.accessibility.some((word) =>
        lowerMessage.includes(word),
      )
    ) {
      return applyEmotion(
        extensionResponses.accessibility[
          Math.floor(Math.random() * extensionResponses.accessibility.length)
        ],
        emotion,
      );
    }

    if (
      extensionKeywords.portfolio.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(
        extensionResponses.portfolio[
          Math.floor(Math.random() * extensionResponses.portfolio.length)
        ],
        emotion,
      );
    }

    if (
      extensionKeywords.learning.some((word) => lowerMessage.includes(word))
    ) {
      return applyEmotion(
        extensionResponses.learning[
          Math.floor(Math.random() * extensionResponses.learning.length)
        ],
        emotion,
      );
    }

    if (
      extensionKeywords.collaboration.some((word) =>
        lowerMessage.includes(word),
      )
    ) {
      return applyEmotion(
        extensionResponses.collaboration[
          Math.floor(Math.random() * extensionResponses.collaboration.length)
        ],
        emotion,
      );
    }

    if (extensionKeywords.hiring.some((word) => lowerMessage.includes(word))) {
      return applyEmotion(
        extensionResponses.hiring[
          Math.floor(Math.random() * extensionResponses.hiring.length)
        ],
        emotion,
      );
    }

    // If the message is unclear or doesn't match any category, ask for clarification
    const unclearIndicators = [
      "what",
      "how",
      "when",
      "where",
      "why",
      "can you",
      "do you",
      "কি",
      "কী",
      "কোথায়",
      "কখন",
      "কেন",
    ];

    // Check if message contains question words or is very short
    const hasQuestionWords = unclearIndicators.some((word) =>
      lowerMessage.includes(word),
    );
    const isVeryShort = lowerMessage.length < 3;
    const hasFewWords = lowerMessage.split(" ").length < 2;

    if (hasQuestionWords || isVeryShort || hasFewWords) {
      // General purpose response system for any topic
      const generalResponses = {
        math: [
          "গণিত একটি সুন্দর বিষয়! আপনি গণনা করতে পারেন বা আরও বিস্তারিত বলতে পারেন। 🧮",
          "হ্যাঁ, গণিত মজাদার! আপনার প্রশ্নটি আরও স্পষ্ট করে বলুন যাতে আমি সাহায্য করতে পারি। ✏️",
        ],
        education: [
          "শিক্ষা খুবই গুরুত্বপূর্ণ! আপনি কোন বিষয় নিয়ে শিখছেন? আমি সাহায্য করতে পারি। 📚",
          "পড়াশোনা করা অসাধারণ! আপনার নির্দিষ্ট প্রশ্ন জানান, আমি উত্তর দেওয়ার চেষ্টা করব। 🎓",
        ],
        cooking: [
          "রান্না করা একটি শিল্প! আপনি কি রান্না শিখতে চান? 👨‍🍳",
          "খাবার তৈরি করা মজাদার! আপনি কোন রেসিপি চান? 🍳",
        ],
        technology: [
          "প্রযুক্তি সম্পর্কে কথা বলছি? দারুণ! আর বিস্তারিত বলুন। 💻",
          "আধুনিক প্রযুক্তি খুবই রোমাঞ্চকর! আপনি কি নির্দিষ্ট কিছু জানতে চান? ⚙️",
        ],
        sports: [
          "খেলাধুলা দুর্দান্ত! আপনার পছন্দের খেলা কি? ⚽",
          "ক্রীড়া সম্পর্কে আলোচনা করছেন? দুর্দান্ত! 🏆",
        ],
        health: [
          "স্বাস্থ্য সবচেয়ে গুরুত্বপূর্ণ! আপনি সুস্থ থাকুন। 💪",
          "সুস্বাস্থ্য জীবনের চাবিকাঠি। কোন স্বাস্থ্য সম্পর্কিত পরামর্শ চান? 🏥",
        ],
        entertainment: [
          "বিনোদন সম্পর্কে কথা বলছেন? মজাদার! আপনার পছন্দ কি? 🎬",
          "চলচ্চিত্র, সঙ্গীত বা গেমস? কি ধরনের বিনোদন পছন্দ করেন? 🎮",
        ],
      };

      // Check for general topics
      const topicKeywords = {
        math: ["গণিত", "math", "হিসাব", "যোগ", "বিয়োগ", "গুণ", "ভাগ", "সংখ্যা"],
        education: ["পড়াশোনা", "শিক্ষা", "পরীক্ষা", "স্কুল", "কলেজ", "বিশ্ববিদ্যালয়", "শেখা", "পড়ি", "study"],
        cooking: ["রান্না", "খাবার", "রেসিপি", "রন্ধন", "요리", "cook", "food", "recipe"],
        technology: ["প্রযুক্তি", "টেক", "প্রোগ্রাম", "কোড", "computer", "software", "app", "সফটওয়্যার"],
        sports: ["খেলা", "ক্রীড়া", "ফুটবল", "ক্রিকেট", "ব্যাডমিন্টন", "sport", "game", "খেলব"],
        health: ["স্বাস্থ্য", "সুস্থ", "ফিটনেস", "ব্যায়াম", "স্বাস্থ্যসেবা", "health", "exercise", "disease"],
        entertainment: ["চলচ্চিত্র", "সিনেমা", "গান", "সঙ্গীত", "নাটক", "গেমস", "movie", "music", "song"],
      };

      // Find matching topic
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some((kw) => lowerMessage.includes(kw))) {
          return applyEmotion(
            generalResponses[topic as keyof typeof generalResponses][
              Math.floor(Math.random() * generalResponses[topic as keyof typeof generalResponses].length)
            ],
            emotion,
          );
        }
      }

      return applyEmotion(
        langResponses.follow_up[
          Math.floor(Math.random() * langResponses.follow_up.length)
        ],
        emotion,
      );
    }

    // General purpose AI - handle any type of question/statement
    const generalKnowledgeResponses: { [key: string]: string[] } = {
      "morning": ["সকালে শুভেচ্ছা! আপনার দিনটি দুর্দান্ত কাটুক। ☀️", "সকাল বেলা সবাইকে স্বাগতম! নতুন দিন, নতুন সম্ভাবনা। 🌅"],
      "night": ["রাতে শুভেচ্ছা! ভালো ঘুম হোক। 🌙", "রাত হয়েছে, ভালো ঘুম নিন। 😴"],
      "weather": ["আবহাওয়া নিয়ে কথা বলছেন? বাইরে কেমন দেখছে? 🌤️", "আবহাওয়া নিয়ে চিন্তা? আশা করি ভালো থাকবে। 🌦️"],
      "birthday": ["জন্মদিনের শুভেচ্ছা! অনেক খুশি থাকুন! 🎂", "জন্মদিন উদযাপন করছেন? বহুবছর জীবন কামনা করি! 🎉"],
      "friend": ["বন্ধুরা জীবনের সবচেয়ে মূল্যবান সম্পদ! আপনার বন্ধুরা ভাগ্যবান। 👥", "বন্ধুত্ব সত্যিই সুন্দর! বন্ধুদের সাথে সময় কাটান। 💛"],
      "family": ["পরিবার সবকিছুর চেয়ে গুরুত্বপূর্ণ! আপনার পরিবারের জন্য দোয়া। 👨‍👩‍👧‍👦", "পরিবার আমাদের শক্তি। তাদের যত্ন নিন। ❤️"],
      "love": ["ভালোবাসা সুন্দর অনুভূতি! সবাইকে ভালোবাসুন। 💕", "ভালোবাসা জীবনের অর্থ। কার সাথে ভালো লাগে আপনার? 💖"],
      "dream": ["স্বপ্ন দেখুন এবং সেগুলি পূরণ করুন! আপনার স্বপ্ন কি? 🌟", "স্বপ্ন ভবিষ্যতের পথ দেখায়। বড় স্বপ্ন দেখুন! 🚀"],
      "success": ["সাফল্য কঠোর পরিশ্রমের ফল! আপনিও পারবেন। 💪", "সফলতা অর্জনের পথ দীর্ঘ কিন্তু সুন্দর। ধৈর্য রাখুন। 🏆"],
      "failure": ["ব্যর্থতা শেখার সুযোগ! হার মানবেন না। 💙", "প্রতিটি ব্যর্থতা নতুন শুরু। আবার চেষ্টা করুন। 🔄"],
    };

    // Check for general knowledge keywords
    for (const [keyword, responseList] of Object.entries(generalKnowledgeResponses)) {
      if (lowerMessage.includes(keyword)) {
        return applyEmotion(
          responseList[Math.floor(Math.random() * responseList.length)],
          emotion,
        );
      }
    }

    // Smart fallback for ANY question/statement
    const smartResponses = {
      unknown: [
        "ইন্টারেস্টিং! আরও বলুন, আমি শুনতে চাই। 👂",
        "সেটা নিয়ে কথা বলছেন? দুর্দান্ত! আপনার মতামত জানতে চাই। 🤔",
        "হুমম, সেটা একটি ভালো প্রশ্ন। আমি চিন্তা করছি... 🧠",
        "আপনার চিন্তাভাবনা আমার কাছে গুরুত্বপূর্ণ। আরও বিস্তারিত বলুন। 💬",
        "সেটা সত্যিই মনোযোগের দাবিদার! আপনার বিষয়টি খুবই গুরুত্বপূর্ণ। ⭐",
      ],
    };

    return applyEmotion(
      smartResponses.unknown[Math.floor(Math.random() * smartResponses.unknown.length)],
      emotion,
    );
  };

  const typeMessage = (
    messageId: string,
    fullText: string,
    typingSpeed: number = 30,
  ) => {
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex <= fullText.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, text: fullText.slice(0, currentIndex) }
              : msg,
          ),
        );
        currentIndex++;
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextCharacter();
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      language: detectLanguage(messageText),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response delay before starting typewriter effect
    setTimeout(
      () => {
        const aiResponseId = (Date.now() + 1).toString();
        const aiResponseText = generateResponse(messageText);

        // Add empty message first
        setMessages((prev) => [
          ...prev,
          {
            id: aiResponseId,
            text: "",
            isUser: false,
            language: userMessage.language,
          },
        ]);

        // Start typewriter effect
        typeMessage(aiResponseId, aiResponseText, 30);
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      className="ai-chat-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="ai-chat-messages">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`chat-message ${message.isUser ? "user" : "ai"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {!message.isUser && (
              <div className="ai-avatar">
                <img
                  src={devPhoto}
                  alt="MD. MUNNA KHANDAKAR"
                  className="avatar-image"
                />
              </div>
            )}
            <div className="message-content">
              <p>{message.text}</p>
              {message.language && message.language !== "en" && (
                <span className="language-indicator">
                  {message.language.toUpperCase()}
                </span>
              )}
              <button
                className="message-delete"
                onClick={() => deleteMessage(message.id)}
                aria-label="Delete message"
                title="Delete this message"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            className="chat-message ai typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="ai-avatar">
              <img
                src={devPhoto}
                alt="MD. MUNNA KHANDAKAR"
                className="avatar-image"
              />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span key="dot-1"></span>
                <span key="dot-2"></span>
                <span key="dot-3"></span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              playTypingSound();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message in any language... (English, Bengali, Hindi, Arabic, Chinese, etc.)"
            rows={1}
            className="chat-input"
            style={{ height: "44px" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="send-button"
          >
            Send
          </button>
        </div>
        <div className="chat-actions">
          <button
            onClick={() => setTypingSoundEnabled(!typingSoundEnabled)}
            className="sound-toggle-btn"
            title={
              typingSoundEnabled
                ? "Disable typing sound"
                : "Enable typing sound"
            }
          >
            {typingSoundEnabled ? "🔊" : "🔇"}
          </button>
          <button
            onClick={clearAllMessages}
            className="clear-chat-button"
            disabled={messages.length <= 1}
          >
            Clear Chat
          </button>
        </div>
        <p className="chat-info">
          💬 Supports multiple languages • 🤖 AI-powered responses • 📧
          Portfolio inquiries welcome • 🗑️ Delete individual messages
        </p>
      </div>
    </motion.div>
  );
}

function Work({ defaultItems }: { defaultItems: GalleryItem[] }) {
  return (
    <Section id="work" title="Work">
      <p className="section-intro">
        A curated gallery of animated work, complete with fullscreen viewing and
        quick downloads.
      </p>
      <Gallery defaultItems={defaultItems} />
    </Section>
  );
}

const STORAGE_KEY = "portfolio-gallery-items";

function Gallery({ defaultItems }: { defaultItems: GalleryItem[] }) {
  const reduceMotion = useReducedMotion();
  const swiperRef = useRef<SwiperClass | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadStoredItems = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GalleryItem[];
      if (!Array.isArray(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const [items, setItems] = useState<GalleryItem[]>(() => {
    const stored = typeof window !== "undefined" ? loadStoredItems() : null;
    return stored && stored.length ? stored : defaultItems;
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const saveItems = useCallback((nextItems: GalleryItem[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch {
      // localStorage can be unavailable in some environments (e.g., private mode)
    }
  }, []);

  const ensureId = useCallback((item: GalleryItem) => {
    if (item.id) return item;
    return {
      ...item,
      id: crypto.randomUUID?.() ?? `${item.title}-${Date.now()}`,
    };
  }, []);

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;

      const itemsToAdd: GalleryItem[] = [];
      const processFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;
          if (typeof result !== "string") return;

          const title = file.name.replace(/\.[^/.]+$/, "");
          const nextItem: GalleryItem = {
            ...ensureId({
              title: title || "Uploaded Image",
              subtitle: "Uploaded",
              image: result,
              full: result,
              tag: "Upload",
            }),
            custom: true,
          };

          itemsToAdd.push(nextItem);

          if (itemsToAdd.length === files.length) {
            setItems((prev) => {
              const next = [...itemsToAdd, ...prev];
              saveItems(next);
              return next;
            });

            setActiveIndex(0);
            if (fileInputRef.current) {
              // Reset input so the same file can be re-selected later
              fileInputRef.current.value = "";
            }
          }
        };

        reader.readAsDataURL(file);
      };

      Array.from(files).forEach(processFile);
    },
    [ensureId, saveItems],
  );

  const openModal = useCallback((index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideToLoop(index, 0);
  }, []);

  const closeModal = useCallback(() => setActiveIndex(null), []);

  const clampIndex = useCallback(
    (value: number) => {
      const length = items.length;
      return ((value % length) + length) % length;
    },
    [items.length],
  );

  const handleRemove = useCallback(
    (index: number) => {
      setItems((prev) => {
        const next = prev.filter((_, idx) => idx !== index);
        saveItems(next);
        return next;
      });
      setActiveIndex((prevIndex) => {
        if (prevIndex === null) return null;
        if (prevIndex === index) return null;
        return prevIndex > index ? prevIndex - 1 : prevIndex;
      });
    },
    [saveItems],
  );

  const showIndex = useCallback(
    (next: number) => {
      const index = clampIndex(next);
      setActiveIndex(index);
      swiperRef.current?.slideToLoop(index);
    },
    [clampIndex],
  );

  const showNext = useCallback(() => {
    if (activeIndex === null) return;
    showIndex(activeIndex + 1);
  }, [activeIndex, showIndex]);

  const showPrev = useCallback(() => {
    if (activeIndex === null) return;
    showIndex(activeIndex - 1);
  }, [activeIndex, showIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, closeModal, showNext, showPrev]);

  const activeItem = activeIndex === null ? undefined : items[activeIndex];

  const autoplay = reduceMotion
    ? false
    : {
        delay: 3600,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      };

  return (
    <>
      <div className="work-gallery">
        <div className="gallery-header">
          <button
            type="button"
            className="gallery-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            + Upload image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="gallery-file"
            onChange={(event) => handleFileUpload(event.target.files)}
          />
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          className="gallery-swiper"
          slidesPerView="auto"
          centeredSlides
          spaceBetween={20}
          loop
          speed={600}
          autoplay={autoplay}
          pagination={{ clickable: true }}
          navigation
          grabCursor
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            if (activeIndex !== null) {
              setActiveIndex(swiper.realIndex);
            }
          }}
          breakpoints={{
            0: { spaceBetween: 14 },
            640: { spaceBetween: 20 },
            900: { spaceBetween: 26 },
          }}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={item.id ?? item.title} className="gallery-slide">
              <div className="gallery-card">
                <button
                  type="button"
                  className="gallery-delete"
                  aria-label="Delete image"
                  onClick={() => handleRemove(idx)}
                >
                  ✕
                </button>
                <button
                  type="button"
                  className="gallery-card-inner"
                  onClick={() => openModal(idx)}
                >
                  <div className="gallery-frame">
                    <img
                      className="gallery-image"
                      loading="lazy"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>
                  <div className="gallery-meta">
                    <div>
                      <h3 className="gallery-title">{item.title}</h3>
                      <p className="gallery-subtitle">{item.subtitle}</p>
                    </div>
                    <span className="gallery-tag">{item.tag}</span>
                  </div>
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {activeItem ? (
        <GalleryModal
          item={activeItem}
          onClose={closeModal}
          onNext={showNext}
          onPrev={showPrev}
          onDelete={() => {
            if (activeIndex === null) return;
            handleRemove(activeIndex);
          }}
        />
      ) : null}
    </>
  );
}

function GalleryModal({
  item,
  onClose,
  onNext,
  onPrev,
  onDelete,
}: {
  item: GalleryItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="gallery-modal" role="dialog" aria-modal="true">
      <div className="gallery-backdrop" onClick={onClose} />
      <div className="gallery-modal-card" role="document">
        <header className="gallery-modal-header">
          <h2 className="gallery-modal-title">{item.title}</h2>
          <div className="gallery-modal-actions">
            <a
              className="gallery-modal-download"
              href={item.full}
              download={`${item.title.replace(/\s+/g, "-").toLowerCase()}.jpg`}
            >
              Download
            </a>
            <button
              type="button"
              className="gallery-modal-delete"
              onClick={onDelete}
              aria-label="Delete image"
            >
              Delete
            </button>
            <button
              type="button"
              className="gallery-modal-close"
              onClick={onClose}
              aria-label="Close viewer"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="gallery-modal-body">
          <img
            className="gallery-modal-image"
            src={item.full}
            alt={item.title}
            loading="lazy"
          />

          <div className="gallery-modal-nav">
            <button
              type="button"
              className="gallery-modal-nav-button"
              onClick={onPrev}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-modal-nav-button"
              onClick={onNext}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Section id="contact" title="Contact">
      <p className="section-intro">
        Interested in collaborating on an animated experience? Send a message
        and I’ll reply within 1–2 business days.
      </p>

      <div className="contact-grid">
        <div>
          <dl className="contact-list">
            <div>
              <dt>Email</dt>
              <dd>
                <a
                  href="mailto:munnakhandaker960@gmail.com"
                  className="text-link"
                >
                  munnakhandaker960@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                District: [Jhenaidah] Sub-district : [Jhenaidah] <br></br>
                Union : [Harishankarpur] Village : [Voj-ghat]
              </dd>
            </div>
            <div>
              <dt>Fun fact</dt>
              <dd>I love turning UI motion into a storytelling tool.</dd>
            </div>
          </dl>
        </div>

        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            const name = formData.get("name")?.toString().trim() || "";
            const email = formData.get("email")?.toString().trim() || "";
            const message = formData.get("message")?.toString().trim() || "";

            const subject = encodeURIComponent(
              `Portfolio contact from ${name || "visitor"}`,
            );
            const body = encodeURIComponent(
              `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            );

            const mailto = `mailto:munnakhandaker960@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailto;

            setSent(true);
            window.setTimeout(() => setSent(false), 2500);
            form.reset();
          }}
        >
          <label>
            <span>Name</span>
            <input name="name" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@gmail.com"
              required
            />
          </label>
          <label>
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Looking to build..."
              required
            />
          </label>
          <button type="submit" className="btn primary">
            {sent ? "Message sent ✓" : "Send message"}
          </button>
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  const email = "skontorsheikh1613@gmail.com";

  return (
    <motion.footer
      className="site-footer"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container footer-inner">
        <motion.div
          className="footer-profile"
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            className="footer-photo"
            src={devPhoto}
            alt="MD. ONTOR SHEIKH"
            loading="lazy"
          />
          <div className="footer-meta">
            <p className="footer-name">MD. ONTOR SHEIKH</p>
            <a className="footer-email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </motion.div>

        <p>
          © <span>{new Date().getFullYear()}</span> MD. ONTOR SHEIKH. Built with
          React, Vite & Framer Motion.<br></br>
          For getting more advanced super animated and functional websites,
          <br></br>
          contact MD. ONTOR SHEIKH (web developer)
        </p>

        <div className="footer-links">
          <a
            className="social-button"
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.612-4.042-1.612-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.236-3.22-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.655 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </a>

          <a
            className="social-button"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1 4.98 2.12 4.98 3.5zM.5 24h4V7h-4v17zM7.5 7h3.85v2.43h.05c.54-1 1.86-2.05 3.83-2.05 4.1 0 4.85 2.7 4.85 6.2V24h-4v-8.63c0-2.06-.04-4.7-2.86-4.7-2.86 0-3.3 2.23-3.3 4.53V24h-4V7z" />
            </svg>
            LinkedIn
          </a>

          <a
            className="social-button"
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.695 4.695 0 0 0 2.048-2.592 9.14 9.14 0 0 1-2.897 1.106 4.607 4.607 0 0 0-7.86 4.2 13.079 13.079 0 0 1-9.503-4.815 4.58 4.58 0 0 0 1.426 6.14 4.584 4.584 0 0 1-2.086-.576v.06a4.613 4.613 0 0 0 3.69 4.515 4.638 4.638 0 0 1-2.079.08 4.615 4.615 0 0 0 4.305 3.204A9.233 9.233 0 0 1 0 19.54a13.022 13.022 0 0 0 7.056 2.067c8.467 0 13.097-7.016 13.097-13.097 0-.2-.004-.402-.013-.602a9.363 9.363 0 0 0 2.3-2.383z" />
            </svg>
            Twitter
          </a>
        </div>
      </div>
    </motion.footer>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Munna । Portfolio";
  }, []);

  // Scroll to top when changing routes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="app">
      <SpiderWebBackground />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
