import { ReactNativeModal } from 'react-native-modal';
import { VerificationState } from '../../types/type';
import { View,Text } from 'react-native';
import InputField from '../InputField';
import CustomButton from '../CustomButton';
import { icons } from '@/constants';
interface VerificationModalProps {
  isVisible: boolean;
  email: string;
  verification: VerificationState;
  onVerify: () => Promise<void>;
  onCodeChange: (code: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isVisible,
  email,
  verification,
  onVerify,
  onCodeChange,
}) => (
  <ReactNativeModal isVisible={isVisible}>
    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
      <Text className="font-JakartaExtraBold text-2xl mb-2">Verification</Text>
      <Text className="font-Jakarta mb-5">
        We've sent a verification code to {email}.
      </Text>
      <InputField
        label="Code"
        icon={icons.lock}
        placeholder="12345"
        value={verification.code}
        keyboardType="numeric"
        onChangeText={onCodeChange}
      />
      {verification.error && (
        <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
      )}
      <CustomButton
        title="Verify Email"
        onPress={onVerify}
        className="mt-5 bg-success-500"
      />
    </View>
  </ReactNativeModal>
);