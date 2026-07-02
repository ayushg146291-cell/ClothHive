import { useSpring, animated, SpringValue } from '@react-spring/web';
import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: string;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  onLetterAnimationComplete?: () => void;
}

export function SplitText({
  text,
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'easeOutCubic',
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const words = text.split(' ').map(word => word.split(''));
  const letters = words.flat();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSpring({
    from: animationFrom,
    to: inView
      ? async (next) => {
        await next(animationTo);
        animatedCount.current += 1;
        if (animatedCount.current === letters.length && onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      }
      : animationFrom,
    delay,
    config: { easing: (t) => t }, // custom easing can be passed or parsed here, simplified for demo
  });

  return (
    <p
      ref={ref}
      className={`SplitText inline-block overflow-hidden ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.map((letter, letterIndex) => {
            const index = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + letterIndex;

            return (
              <motion.span
                key={index}
                initial={animationFrom}
                animate={inView ? animationTo : animationFrom}
                transition={{
                  duration: 0.6,
                  delay: index * 0.03 + (delay / 1000),
                  ease: [0.22, 1, 0.36, 1] // cubic bezier for fluid luxury
                }}
                className="inline-block"
                style={{ willChange: 'transform, opacity' }}
              >
                {letter}
              </motion.span>
            );
          })}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </p>
  );
}
