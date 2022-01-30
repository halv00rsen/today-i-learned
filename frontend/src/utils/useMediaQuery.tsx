import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
  const [match, setMatch] = useState(
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setMatch(matches);
    };

    const matchMedia = window.matchMedia(query);
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return match;
};
