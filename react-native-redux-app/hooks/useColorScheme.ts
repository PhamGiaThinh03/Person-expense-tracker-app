import { useColorScheme as _useColorScheme } from 'react-native';

// Force light theme
export function useColorScheme() {
  return 'light' as const;
}
