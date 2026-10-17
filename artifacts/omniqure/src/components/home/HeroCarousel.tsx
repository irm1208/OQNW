import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "wouter";

const SLIDES = [
  {
    image: "eight-vials",
    title: "Eight vials, chosen by you",
    description: "Build your own bundle. Pick any eight compounds from the range and get them together in one box. For research use only.",
    href: "/bundle-and-save",
  },
  {
    image: "families",
    title: "135 compounds, six families",
    description: "Each family has its own colour, on the cap, the label and the box. For research use only.",
    href: "/all-peptides",
  },
  {
    image: "four-compounds",
    title: "Four compounds, one spray format",
    description: "Semax, Selank, Oxytocin and PT-141, 10 mg in 15 ml. For research use only.",
    href: "/all-peptides",
  },
  {
    image: "research-peps",
    title: "Research peptides, clearly labelled",
    description: "Every vial carries its lot, expiry date, storage information and a QR code. For research use only.",
    href: "/all-peptides",
  },
];

const controlClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--ink)] hover:bg-[var(--ice)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cobalt)]";

export default function HeroCarousel() {
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      setPlaying(!preference.matches);
    };
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!carousel) return;
    const updateSelected = () => setSelected(carousel.selectedScrollSnap());
    const stopOnDrag = () => setPlaying(false);
    updateSelected();
    carousel.on("select", updateSelected).on("pointerDown", stopOnDrag);
    return () => {
      carousel.off("select", updateSelected).off("pointerDown", stopOnDrag);
    };
  }, [carousel]);

  const rotating = playing && !hovered && !focused && pageVisible;
  useEffect(() => {
    if (!carousel || !rotating) return;
    const timer = window.setInterval(() => carousel.scrollNext(reducedMotion), 8000);
    return () => window.clearInterval(timer);
  }, [carousel, rotating, reducedMotion, selected]);

  function goTo(index: number) {
    setPlaying(false);
    carousel?.scrollTo(index, reducedMotion);
  }

  return (
    <section
      aria-label="OmniQure featured range"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setPlaying(false);
          if (event.key === "ArrowLeft") carousel?.scrollPrev(true);
          else carousel?.scrollNext(true);
        }
      }}
      className="border-b bg-white"
      style={{ borderColor: "var(--hairline)" }}
    >
      <h1 className="sr-only">OmniQure — research-grade peptides for laboratory research</h1>
      <div ref={viewportRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${SLIDES.length}: ${slide.title}`}
              aria-hidden={selected !== index}
              className="min-w-0 shrink-0 grow-0 basis-full"
            >
              <Link href={slide.href} tabIndex={selected === index ? 0 : -1} className="block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[var(--cobalt)]">
                <picture>
                  <source media="(max-width: 767px)" srcSet={`/hero/${slide.image}-mobile.webp`} width={1080} height={1350} />
                  <img
                    src={`/hero/${slide.image}-desktop.webp`}
                    alt={`${slide.title}. ${slide.description}`}
                    width={2400}
                    height={1000}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="block aspect-[4/5] w-full object-cover [@media(max-height:700px)]:aspect-[16/13] sm:aspect-[12/5] lg:aspect-[8/3]"
                    draggable={false}
                  />
                </picture>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-0 px-1 py-1 sm:gap-1 sm:px-3">
        <button type="button" aria-label="Previous banner" onClick={() => goTo((selected + SLIDES.length - 1) % SLIDES.length)} className={controlClass}><ChevronLeft size={18} /></button>
        <div className="flex" aria-label="Choose a banner">
          {SLIDES.map((slide, index) => (
            <button key={slide.image} type="button" aria-label={`Show banner ${index + 1}: ${slide.title}`} aria-pressed={selected === index} onClick={() => goTo(index)} className={controlClass}>
              <span className={`h-1.5 rounded-full ${selected === index ? "w-5 bg-[var(--ink)]" : "w-1.5 bg-[var(--graphite)] opacity-40"}`} />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Next banner" onClick={() => goTo((selected + 1) % SLIDES.length)} className={controlClass}><ChevronRight size={18} /></button>
        <button type="button" aria-label={playing ? "Pause banner rotation" : "Start banner rotation"} onClick={() => setPlaying(!playing)} className={controlClass}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        <span className="sr-only" aria-live={rotating ? "off" : "polite"}>{SLIDES[selected].title}</span>
      </div>
    </section>
  );
}
