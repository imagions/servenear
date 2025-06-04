import React, { createContext, useContext, useState } from 'react';
import { ThemedSnackbar } from '@/components/ThemedSnackbar';
import type { MaterialIcons } from '@expo/vector-icons';

interface SnackbarOptions {
  message: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  actionLabel?: string;
  onActionPress?: () => void;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null);

  const showSnackbar = (options: SnackbarOptions) => {
    setSnackbar(options);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar && (
        <ThemedSnackbar
          {...snackbar}
          onHide={() => setSnackbar(null)}
        />
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
