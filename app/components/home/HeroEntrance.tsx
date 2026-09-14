"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroEntrance({ children }: { children: React.ReactNode }) {
  const heroTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }
  }, []);

  return (
    <div ref={heroTextRef} className="lg:col-span-7 flex flex-col items-start text-left">
      {children}
    </div>
  );
}
