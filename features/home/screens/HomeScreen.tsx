import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-6">
      <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Daily Notes
      </Text>
      <Text className="text-base text-gray-600 dark:text-gray-400 text-center">
        Welcome to your daily notes app!
      </Text>
    </View>
  );
}
