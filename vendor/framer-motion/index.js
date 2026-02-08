import React, { useEffect, useMemo, useRef, useState } from 'react';

class MotionValueImpl {
  constructor(initial) {
    this._value = initial;
    this._listeners = new Set();
  }

  get() {
    return this._value;
  }

  set(next) {
    this._value = next;
    this._listeners.forEach((listener) => listener(next));
  }

  on(event, listener) {
    if (event !== 'change') return () => {};
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }
}

export function useMotionValue(initial) {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = new MotionValueImpl(initial);
  }
  return ref.current;
}

export function useSpring(value) {
  const initial = value && typeof value.get === 'function' ? value.get() : value;
  const spring = useMotionValue(initial ?? 0);

  useEffect(() => {
    if (!value || typeof value.on !== 'function') return;
    return value.on('change', (next) => spring.set(next));
  }, [value, spring]);

  return spring;
}

function mapRange(input, output, value) {
  const [inMin, inMax] = input;
  const progress = inMax === inMin ? 0 : (value - inMin) / (inMax - inMin);
  const [outMin, outMax] = output;
  if (typeof outMin === 'number' && typeof outMax === 'number') {
    return outMin + (outMax - outMin) * progress;
  }
  return progress >= 1 ? outMax : outMin;
}

export function useTransform(source, input, output) {
  const compute = useMemo(() => {
    if (typeof input === 'function') {
      return input;
    }
    if (Array.isArray(input) && Array.isArray(output)) {
      return (v) => mapRange(input, output, v);
    }
    return (v) => v;
  }, [input, output]);

  const derived = useMotionValue(compute(source?.get?.() ?? 0));

  useEffect(() => {
    if (!source || typeof source.on !== 'function') return;
    derived.set(compute(source.get()));
    return source.on('change', (next) => derived.set(compute(next)));
  }, [source, derived, compute]);

  return derived;
}

export function useScroll() {
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max <= 0 ? 0 : window.scrollY / max;
      scrollYProgress.set(Math.max(0, Math.min(1, value)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [scrollYProgress]);

  return { scrollYProgress };
}

export function useMotionValueEvent(value, event, callback) {
  useEffect(() => {
    if (!value || typeof value.on !== 'function') return;
    return value.on(event, callback);
  }, [value, event, callback]);
}

export function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children);
}

const motionCache = new Map();

function createMotionComponent(tag) {
  if (motionCache.has(tag)) return motionCache.get(tag);
  const Component = React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(tag, { ref, ...props }, children)
  );
  Component.displayName = `motion.${tag}`;
  motionCache.set(tag, Component);
  return Component;
}

export const motion = new Proxy(
  {},
  {
    get(_target, prop) {
      return createMotionComponent(prop);
    },
  }
);

export const MotionValue = MotionValueImpl;
