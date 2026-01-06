import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { authButtonStyles } from '../styles';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function AuthButton({ title, style, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[authButtonStyles.button, style]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={authButtonStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}


