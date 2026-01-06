import { Text, TextInput, TextInputProps, View } from 'react-native';

import { authInputStyles } from '../styles';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, style, ...props }: AuthInputProps) {
  return (
    <View style={authInputStyles.container}>
      <Text style={authInputStyles.label}>{label}</Text>
      <TextInput
        style={[authInputStyles.input, error && authInputStyles.inputError, style]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text style={authInputStyles.errorText}>{error}</Text>}
    </View>
  );
}

