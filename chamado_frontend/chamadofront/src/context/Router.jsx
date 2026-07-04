import { useState, useCallback, useEffect, useRef } from 'react';

// Objeto estável de módulo — a propriedade .current é mutada, mas o objeto
// em si nunca é reatribuído, então o React Refresh não reclama.
const navigateRef = { current: null };

// eslint-disable-next-line react-refresh/only-export-components
export const navigate = (path) => navigateRef.current && navigateRef.current(path);

export function Router({ children }) {
  const getPath = () => {
    const hash = window.location.hash.slice(1);
    return hash || '/';
  };

  const [path, setPath] = useState(getPath);

  const handleNavigate = useCallback((to) => {
    if (window.location.hash === `#${to}`) {
      
      setPath(to);
    } else {
      window.location.hash = to;
      
    }
  }, []);

  
  const handleNavigateRef = useRef(handleNavigate);
  useEffect(() => {
    handleNavigateRef.current = handleNavigate;
  }, [handleNavigate]);

  useEffect(() => {
    
    navigateRef.current = (...args) => handleNavigateRef.current(...args);

    const onHashChange = () => setPath(getPath());
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      navigateRef.current = null;
    };
  }, []); 

  return children(path);
}
