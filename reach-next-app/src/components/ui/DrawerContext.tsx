import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  selectedDataSource: string;
  setSelectedDataSource: (dataSource: string) => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('');

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen, selectedDataSource, setSelectedDataSource }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};