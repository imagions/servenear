import { View, Text } from 'react-native';

export default function WebMapFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map is not supported on web.</Text>
    </View>
  );
}
