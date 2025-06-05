import { useEffect } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTabBar } from '@/context/TabBarContext';

export const useScrollToHide = () => {
  const { handleScroll } = useTabBar();

  return {
    scrollProps: {
      onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => handleScroll(event),
      scrollEventThrottle: 16,
    }
  };
};
