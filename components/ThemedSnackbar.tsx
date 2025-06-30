import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';

interface ThemedSnackbarProps {
  message: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  actionLabel?: string;
  onActionPress?: () => void;
  duration?: number;
  onHide?: () => void;
}

export function ThemedSnackbar({
  message,
  icon,
  iconColor = COLORS.accent,
  iconSize = 24,
  actionLabel,
  onActionPress,
  duration = 4000,
  onHide,
}: ThemedSnackbarProps) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Restrict movement to vertical only and limit range to -20 to 20
        const newY = Math.max(-20, Math.min(20, gestureState.dy));
        position.setValue({ x: 0, y: newY });
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down more than 10px, dismiss
        if (gestureState.dy > 10) {
          hideSnackbar();
          return;
        }

        // Spring back to original position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          bounciness: 8,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        bounciness: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      hideSnackbar();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideSnackbar = () => {
    Animated.parallel([
      Animated.timing(position.y, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
          ],
          opacity,
        },
      ]}
    >
      {icon && (
        <>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${iconColor}15` },
            ]}
          >
            <MaterialIcons name={icon} size={iconSize} color={iconColor} />
          </View>
          <View style={{ width: 12 }} />
        </>
      )}

      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>

      {actionLabel && onActionPress && (
        <TouchableOpacity activeOpacity={0.7}
          style={styles.actionButton}
          onPress={() => {
            onActionPress();
            hideSnackbar();
          }}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.card,
    elevation: 8, // Add elevation for better visual feedback
    zIndex: 1000, // Ensure snackbar stays on top
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    color: COLORS.text.heading,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  actionButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'Inter-Bold',
  },
});
