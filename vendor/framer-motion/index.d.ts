import * as React from 'react';

export type MotionValue<T = any> = {
  get(): T;
  set(value: T): void;
  on(event: 'change' | string, listener: (value: T) => void): () => void;
};

export const motion: Record<string, React.ForwardRefExoticComponent<any>>;

export function AnimatePresence(props: { children?: React.ReactNode; [key: string]: any }): JSX.Element;

export function useMotionValue<T>(initial: T): MotionValue<T>;
export function useSpring<T>(value: MotionValue<T> | T, config?: any): MotionValue<T>;

export function useTransform<T, U>(
  source: MotionValue<T>,
  input: ((value: T) => U) | T[],
  output?: U[]
): MotionValue<U>;

export function useScroll(config?: any): { scrollYProgress: MotionValue<number> };

export function useMotionValueEvent<T>(
  value: MotionValue<T>,
  event: 'change' | string,
  callback: (latest: T) => void
): void;
