import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SystemConfigContextProps {
  isSystemConfigOpen: boolean;
  setIsSystemConfigOpen: (isOpen: boolean) => void;
}

const SystemConfigContext = createContext<SystemConfigContextProps | undefined>(undefined);

export const SystemConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSystemConfigOpen, setIsSystemConfigOpen] = useState(false);

  return (
    <SystemConfigContext.Provider value={{ isSystemConfigOpen, setIsSystemConfigOpen }}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = () => {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error('useSystemConfig must be used within a SystemConfigProvider');
  }
  return context;
};
