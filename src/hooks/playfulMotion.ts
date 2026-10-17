import { gsap } from "gsap";

/** Created inside the owning useGSAP context; explicit listeners are released here. */
export function setupPlayfulMotion(root: HTMLElement) {
  const mm = gsap.matchMedia();
  const select = gsap.utils.selector(root);

  gsap.from(".kinetic-word", {
    xPercent: (i) => (i % 2 ? 22 : -22),
    rotation: (i) => (i % 2 ? -5 : 5),
    opacity: 0.18,
    stagger: 0.08,
    ease: "none",
    scrollTrigger: {
      trigger: ".kinetic-statement",
      start: "top 88%",
      end: "top 22%",
      scrub: 0.8,
    },
  });
  gsap.to(".about-orbit", {
    rotation: 100,
    ease: "none",
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.from(".about-copy", {
    y: 70,
    opacity: 0.2,
    ease: "none",
    scrollTrigger: {
      trigger: ".about-copy",
      start: "top 90%",
      end: "top 40%",
      scrub: 0.7,
    },
  });
  gsap.from(".stats > div", {
    y: 55,
    scale: 0.8,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: "back.out(1.7)",
    scrollTrigger: { trigger: ".stats", start: "top 88%", once: true },
  });

  const cards = select(".project") as HTMLElement[];
  cards.forEach((card) => {
    gsap.from(card.querySelector(".project-visual"), {
      clipPath: "inset(15% 10% 15% 10% round 30px)",
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%", once: true },
    });
    gsap.from(card.querySelector(".project-information"), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: { trigger: card, start: "top 82%", once: true },
    });
  });

  gsap.from(".skill-groups details", {
    x: 35,
    opacity: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: { trigger: ".skill-groups", start: "top 85%", once: true },
  });
  gsap.from(".career-progress i", {
    scaleY: 0,
    transformOrigin: "top",
    ease: "none",
    scrollTrigger: {
      trigger: ".career-list",
      start: "top 60%",
      end: "bottom 65%",
      scrub: true,
    },
  });
  (select(".career-row") as HTMLElement[]).forEach((row, i) => {
    gsap.from(row.querySelector(".career-content"), {
      x: i % 2 ? 45 : -45,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: row,
        start: "top 85%",
        end: "top 45%",
        scrub: 0.6,
      },
    });
    gsap.from(row.querySelector(".career-year"), {
      y: 30,
      color: "#323c2d",
      ease: "none",
      scrollTrigger: {
        trigger: row,
        start: "top 85%",
        end: "top 40%",
        scrub: 0.6,
      },
    });
  });
  gsap.from(".domain-rows > div", {
    clipPath: "inset(0 100% 0 0)",
    x: -20,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".domain-rows", start: "top 85%", once: true },
  });
  gsap.from(".contact-line", {
    xPercent: (i) => (i ? 12 : -12),
    rotationX: 60,
    opacity: 0.15,
    transformOrigin: "center bottom",
    stagger: 0.12,
    ease: "none",
    scrollTrigger: {
      trigger: ".contact-title",
      start: "top 95%",
      end: "top 45%",
      scrub: 0.7,
    },
  });
  gsap.to(".contact-orbit", {
    rotation: 130,
    ease: "none",
    scrollTrigger: {
      trigger: ".contact",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.from(".footer-wordmark", {
    yPercent: 65,
    rotation: -4,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".footer",
      start: "top bottom",
      end: "top 55%",
      scrub: 0.8,
    },
  });

  mm.add("(min-width: 1000px)", () => {
    cards.slice(0, -1).forEach((card, i) => {
      gsap.to(card, {
        scale: 0.93,
        rotation: i % 2 ? 2 : -2,
        opacity: 0.4,
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top 75%",
          end: "top 120px",
          scrub: 0.6,
        },
      });
    });
    gsap.from(".dual-panel", {
      xPercent: (i) => (i ? 12 : -12),
      rotation: (i) => (i ? 5 : -5),
      scale: 0.9,
      ease: "none",
      scrollTrigger: {
        trigger: ".dual-section",
        start: "top 90%",
        end: "top 20%",
        scrub: 0.8,
      },
    });
    gsap.from(".lab-stage", {
      rotationY: -20,
      rotationZ: 4,
      scale: 0.9,
      ease: "none",
      scrollTrigger: {
        trigger: ".lab",
        start: "top 85%",
        end: "top 25%",
        scrub: 0.8,
      },
    });
  });

  mm.add("(hover: hover) and (pointer: fine)", () => {
    const cleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const visual = card.querySelector<HTMLElement>(".project-visual");
      const cursor = card.querySelector<HTMLElement>(".project-cursor");
      if (!visual || !cursor) return;
      const rx = gsap.quickTo(visual, "rotationX", {
        duration: 0.6,
        ease: "power3.out",
      });
      const ry = gsap.quickTo(visual, "rotationY", {
        duration: 0.6,
        ease: "power3.out",
      });
      const cx = gsap.quickTo(cursor, "x", { duration: 0.25 });
      const cy = gsap.quickTo(cursor, "y", { duration: 0.25 });
      const move = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        const x = event.clientX - bounds.left,
          y = event.clientY - bounds.top;
        rx((y / bounds.height - 0.5) * -9);
        ry((x / bounds.width - 0.5) * 12);
        cx(x);
        cy(y);
        visual.style.setProperty("--light-x", `${(x / bounds.width) * 100}%`);
        visual.style.setProperty("--light-y", `${(y / bounds.height) * 100}%`);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
        visual.style.removeProperty("--light-x");
        visual.style.removeProperty("--light-y");
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  });
  return () => mm.revert();
}
