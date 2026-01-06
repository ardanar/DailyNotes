import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  // Container styles
  maxWidthContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },

  // Error styles
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
});

// Common colors - exported separately as it's not a style object
export const colors = {
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
  },
  border: '#E5E7EB',
};

