import React, { useEffect, useRef } from 'react';

interface Props {
  onViewportEnter?: () => void;
  children?: React.ReactNode;
}

export const InViewport = ({
  children,
  onViewportEnter,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onViewportEnter?.();
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [onViewportEnter]);

  return <div ref={ref}>{children}</div>;
};
