"use client";
import { motion, useInView, useMotionValue, useTransform, useReducedMotion, animate } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({ to, decimals = 0, suffix = "", duration = 1.6, className = "" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
    return `${n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduce) { mv.set(to); return; }
    const controls = animate(mv, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, duration, mv, reduce]);

  return <motion.span ref={ref} className={className} aria-label={`${to}${suffix}`}>{rounded}</motion.span>;
}
