import { useEffect, useState } from 'react';

export function useIsMounted(): () => boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Opcional: cleanup si necesitas desmontar
    return () => {
      setIsMounted(false);
    };
  }, []);

  return () => isMounted;
}
