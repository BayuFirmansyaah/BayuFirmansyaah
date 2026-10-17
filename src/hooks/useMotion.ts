import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { setupPlayfulMotion } from "./playfulMotion";
gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.ticker.lagSmoothing(0);
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  return reduced;
}
export function useMotion(ready: boolean, enabled = true) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (!ready || reduced || !enabled) return;
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        anchors: { offset: 0 },
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(
          ".hero-media",
          { clipPath: "inset(12% 8% 12% 8%)", duration: 1.5 },
          0,
        )
        .from(
          ".hero-word",
          { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.12 },
          0.12,
        )
        .from(
          ".hero-reveal",
          { y: 25, opacity: 0, duration: 0.85, stagger: 0.1 },
          0.45,
        );
      gsap.utils
        .toArray<HTMLElement>(
          "[data-reveal]:not(.about-copy):not(.project):not(.career-row):not(.stats)",
        )
        .forEach((el) => {
          gsap.from(el, {
            y: 45,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
      const mm = gsap.matchMedia();
      mm.add("(min-width: 761px)", () => {
        const journey = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        journey
          .to(
            ".hero-title",
            { yPercent: -28, opacity: 0, duration: 0.38, ease: "power1.in" },
            0,
          )
          .to(
            ".hero-top, .hero-bottom, .hero-interaction-hint",
            { opacity: 0, y: -20, duration: 0.25 },
            0,
          )
          .to(".hero-shade", { opacity: 0, duration: 0.4 }, 0)
          .to(
            ".hero-media",
            {
              scale: 0.48,
              borderRadius: "8px",
              duration: 0.85,
              ease: "power2.inOut",
            },
            0.08,
          )
          .to(".hero-scroll-story", { opacity: 1, duration: 0.3 }, 0.22)
          .fromTo(
            ".story-line-one",
            { xPercent: -22 },
            { xPercent: 5, duration: 0.85, ease: "none" },
            0.15,
          )
          .fromTo(
            ".story-line-two",
            { xPercent: 15 },
            { xPercent: -18, duration: 0.85, ease: "none" },
            0.15,
          )
          .to(".hero-glyph", { opacity: 1, scale: 1, duration: 0.3 }, 0.65)
          .fromTo(
            ".hero-glyph path",
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.35 },
            0.65,
          )
          .to(
            ".hero-scroll-meter i",
            { scaleX: 1, duration: 1, ease: "none" },
            0,
          );
      });
      mm.add("(max-width: 760px)", () => {
        gsap.to(".hero-parallax", {
          y: 65,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
        gsap.to(".hero-title", {
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const hero = scope.current?.querySelector<HTMLElement>(".hero");
        if (!hero) return;
        const x = gsap.quickTo(".hero-parallax", "x", {
          duration: 1,
          ease: "power3.out",
        });
        const y = gsap.quickTo(".hero-parallax", "y", {
          duration: 1,
          ease: "power3.out",
        });
        const ry = gsap.quickTo(".hero-parallax", "rotationY", {
          duration: 1,
          ease: "power3.out",
        });
        const rx = gsap.quickTo(".hero-parallax", "rotationX", {
          duration: 1,
          ease: "power3.out",
        });
        const move = (event: PointerEvent) => {
          const bounds = hero.getBoundingClientRect();
          const px = (event.clientX - bounds.left) / bounds.width - 0.5;
          const py = (event.clientY - bounds.top) / bounds.height - 0.5;
          x(px * -26);
          y(py * -20);
          ry(px * 2.5);
          rx(py * -2);
        };
        const leave = () => {
          x(0);
          y(0);
          ry(0);
          rx(0);
        };
        hero.addEventListener("pointermove", move);
        hero.addEventListener("pointerleave", leave);
        const cta = scope.current?.querySelector<HTMLElement>(".round-link");
        const magnetic = (event: PointerEvent) => {
          if (!cta) return;
          const b = cta.getBoundingClientRect();
          gsap.to(cta.querySelector(".round-arrow"), {
            x: (event.clientX - b.left - b.width / 2) * 0.2,
            y: (event.clientY - b.top - b.height / 2) * 0.2,
            duration: 0.35,
          });
        };
        const reset = () => {
          if (cta)
            gsap.to(cta.querySelector(".round-arrow"), {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1,0.4)",
            });
        };
        cta?.addEventListener("pointermove", magnetic);
        cta?.addEventListener("pointerleave", reset);
        return () => {
          hero.removeEventListener("pointermove", move);
          hero.removeEventListener("pointerleave", leave);
          cta?.removeEventListener("pointermove", magnetic);
          cta?.removeEventListener("pointerleave", reset);
        };
      });
      const cleanupPlayful = scope.current
        ? setupPlayfulMotion(scope.current)
        : undefined;
      ScrollTrigger.refresh();
      return () => {
        cleanupPlayful?.();
        mm.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    },
    { scope, dependencies: [ready, reduced, enabled], revertOnUpdate: true },
  );
  return scope;
}
