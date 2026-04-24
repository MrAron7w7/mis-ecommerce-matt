'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from './AuthModal';

type ModalAction = 'login' | 'logout';

type ModalContextType = {
  openAuthModal: (action: ModalAction) => void;
  closeAuthModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authAction, setAuthAction] = useState<ModalAction>('login');

  const openAuthModal = (action: ModalAction) => {
    setAuthAction(action);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal open={isAuthModalOpen} setOpen={setIsAuthModalOpen} action={authAction} />
    </ModalContext.Provider>
  );
}
