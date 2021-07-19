import { useEffect, useState } from 'react';

export const useInViewport = (element: Element | null) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {});

    element && observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return isVisible;
};
