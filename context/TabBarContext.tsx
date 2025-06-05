import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

interface TabBarContextType {
  tabBarHeight: Animated.Value;
  handleScroll: (event: any) => void;
}

const TabBarContext = createContext<TabBarContextType | null>(null);

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within TabBarProvider');
  }
  return context;
};

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const tabBarHeight = useRef(new Animated.Value(49)).current;
  const lastScrollY = useRef(0);
  const isAnimating = useRef(false);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (isAnimating.current) return;

    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      isAnimating.current = true;
      Animated.timing(tabBarHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start(() => {
        isAnimating.current = false;
      });
    } else if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
      isAnimating.current = true;
      Animated.timing(tabBarHeight, {
        toValue: 49,
        duration: 200,
        useNativeDriver: false
      }).start(() => {
        isAnimating.current = false;
      });
    }
    
    lastScrollY.current = currentScrollY;
  };

  return (
    <TabBarContext.Provider value={{ tabBarHeight, handleScroll }}>
      {children}
    </TabBarContext.Provider>
  );
}
