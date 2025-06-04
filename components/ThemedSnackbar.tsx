import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
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
  const translateY = new Animated.Value(100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
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
      Animated.timing(translateY, {
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
      style={[
        styles.container,
        {
          transform: [{ translateY }],
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
        <TouchableOpacity
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
