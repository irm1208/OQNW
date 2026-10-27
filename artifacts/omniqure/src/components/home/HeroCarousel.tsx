import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "wouter";

/*
 * Sunburst studio heroes. Each slide has its own desktop (16:9), tablet (4:3)
 * and phone (4:5) composition. On desktop the copy sits in the empty right
 * half of the photograph; on tablets and phones the frames are tight around
 * the products, so the copy sits in a caption directly beneath the image
 * instead of covering them.
 *
 * Copy: one benefit-led headline, one specific supporting line, one action.
 */
type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  /** Desktop copy colour: light text on the navy wall, dark on chalk. */
  tone: "light" | "dark";
  /** Desktop copy: vertical position, and where it starts (% of the page width). */
  place: "upper" | "middle";
  copyStart: number;
  /** "inset": on desktop the photo is scaled down to the left and fades into its
      own background, for compositions with no empty right half. */
  fit?: "inset";
  alt: string;
};

const SLIDES: Slide[] = [
  {
    image: "sb-range",
    eyebrow: "Independently tested",
    title: "Purity you can check.",
    body: "99%+ HPLC purity, with the Janoshik lab report for every batch one click from the product.",
    cta: { label: "Shop peptides", href: "/all-peptides" },
    tone: "light",
    place: "upper",
    copyStart: 64,
    alt: "OmniQure BPC-157, Ipamorelin, GHK-Cu and Epitalon research vials on a stone surface",
  },
  {
    image: "sb-bundle",
    eyebrow: "Bundle & save",
    title: "Eight vials, your choice.",
    body: "Mix any compounds. Free BAC water from 3 vials, a free peptide at 5 and two at 10.",
    cta: { label: "Build a bundle", href: "/bundle-and-save" },
    tone: "dark",
    place: "middle",
    copyStart: 64,
    fit: "inset",
    alt: "OmniQure build-your-own-bundle box holding eight research vials",
  },
  {
    image: "sb-retatrutide",
    eyebrow: "Retatrutide",
    title: "Six strengths, one standard.",
    body: "10mg to 60mg, lyophilised and labelled with lot, CAS and storage, each backed by a lab report.",
    cta: { label: "Shop Retatrutide", href: "/product/retatrutide-40mg" },
    tone: "dark",
    place: "middle",
    copyStart: 54,
    alt: "OmniQure Retatrutide 40mg carton and vial",
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
              className="hero-slide min-w-0 shrink-0 grow-0 basis-full"
              data-tone={slide.tone}
              data-place={slide.place}
              data-fit={slide.fit}
              style={{ "--copy-start": `${slide.copyStart}%` } as React.CSSProperties}
            >
              <div className="hero-slide__media">
                <picture>
                  <source media="(max-width: 639px)" srcSet={`/hero/${slide.image}-mobile.webp`} width={1080} height={1350} />
                  <source media="(max-width: 1023px)" srcSet={`/hero/${slide.image}-tablet.webp`} width={1600} height={1200} />
                  <img
                    src={`/hero/${slide.image}-desktop.webp`}
                    alt={slide.alt}
                    width={1920}
                    height={1080}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </picture>
              </div>
              <div className="hero-slide__copy">
                <div className="hero-slide__copy-inner">
                  <p className="hero-slide__eyebrow">{slide.eyebrow}</p>
                  <h2 className="hero-slide__title">{slide.title}</h2>
                  <p className="hero-slide__body">{slide.body}</p>
                  <Link href={slide.cta.href} tabIndex={selected === index ? 0 : -1} className="hero-slide__cta">
                    {slide.cta.label} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <p className="hero-slide__ruo">For research use only · Not for human or veterinary use</p>
                </div>
              </div>
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
