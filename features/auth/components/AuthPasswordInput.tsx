import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { authPasswordInputStyles } from '../styles';

interface AuthPasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string;
}

export default function AuthPasswordInput({ label, error, style, ...props }: AuthPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={authPasswordInputStyles.container}>
      <Text style={authPasswordInputStyles.label}>{label}</Text>
      <View style={authPasswordInputStyles.passwordContainer}>
        <TextInput
          style={[authPasswordInputStyles.input, authPasswordInputStyles.passwordInput, error && authPasswordInputStyles.inputError, style]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="off"
          textContentType="none"
          passwordRules=""
          {...props}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={authPasswordInputStyles.showPasswordButton}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} style={authPasswordInputStyles.showPasswordIcon} />
        </TouchableOpacity>
      </View>
      {error && <Text style={authPasswordInputStyles.errorText}>{error}</Text>}
    </View>
  );
}

