import { Image, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import CustomButton from "../CustomButton";
import { images } from "@/constants";

interface SuccessModalProps {
    isVisible: boolean;
    onNavigateHome: () => void;
  }
  
  export const SuccessModal: React.FC<SuccessModalProps> = ({
    isVisible,
    onNavigateHome,
  }) => (
    <ReactNativeModal isVisible={isVisible}>
      <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
        <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5" />
        <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
        <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
          You have successfully verified your account.
        </Text>
        <CustomButton
          title="Browse Home"
          onPress={onNavigateHome}
          className="mt-5"
        />
      </View>
    </ReactNativeModal>
  );
  