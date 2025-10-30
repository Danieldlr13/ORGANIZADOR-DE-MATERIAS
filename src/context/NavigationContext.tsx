import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type View = 'materias' | 'calendario';

interface NavigationContextType {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Custom events para sincronizar entre roots
const VIEW_CHANGE_EVENT = 'navigation:viewChange';
const SIDEBAR_TOGGLE_EVENT = 'navigation:sidebarToggle';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>('materias');
  const [isOpen, setIsOpen] = useState(true);

  // Sincronizar activeView entre roots
  useEffect(() => {
    const handleViewChange = (e: Event) => {
      const customEvent = e as CustomEvent<View>;
      setActiveView(customEvent.detail);
    };
    window.addEventListener(VIEW_CHANGE_EVENT, handleViewChange);
    return () => window.removeEventListener(VIEW_CHANGE_EVENT, handleViewChange);
  }, []);

  // Sincronizar isOpen entre roots
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsOpen(customEvent.detail);
    };
    window.addEventListener(SIDEBAR_TOGGLE_EVENT, handleToggle);
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, handleToggle);
  }, []);

  const handleSetActiveView = (view: View) => {
    setActiveView(view);
    window.dispatchEvent(new CustomEvent(VIEW_CHANGE_EVENT, { detail: view }));
  };

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    window.dispatchEvent(new CustomEvent(SIDEBAR_TOGGLE_EVENT, { detail: open }));
  };

  return (
    <NavigationContext.Provider value={{ 
      activeView, 
      setActiveView: handleSetActiveView, 
      isOpen, 
      setIsOpen: handleSetIsOpen 
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation debe usarse dentro de NavigationProvider');
  }
  return context;
}
