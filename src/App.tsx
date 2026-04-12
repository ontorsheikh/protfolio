import { useCallback, useEffect, useRef, useState, ReactNode } from "react";
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
import munnaHero from "./assets/munna-1.jpeg";
import devVideo from "./assets/JENNIE - like JENNIE (Official Video) (1).mp4";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
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

// Spider Web Background Component
function SpiderWebBackground() {
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
            stroke="rgba(220, 20, 60, 0.4)"
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
          stroke="rgba(220, 20, 60, 0.35)"
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
        fill="rgba(220, 20, 60, 0.8)"
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
                <a href="mailto:munnakhandaker960@gmail.com" className="text-link">
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
          <img className="footer-photo" src={devPhoto} alt="MD Ontor Sheikh" />
          <div className="footer-meta">
            <p className="footer-name">MD ONTOR SHEIKH</p>
            <a className="footer-email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </motion.div>

        <p>
          © <span>{new Date().getFullYear()}</span> MD ONTOR SHEIKH. Built with
          React, Vite & Framer Motion.<br></br>
          For geting more advanced super animated and functional website
          <br></br>
          contact with MD ONTOR SHEIKH (web developer)
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
