import { Link } from "expo-router";
import CustomButton from "./CustomButton";
import InputField from "./InputField";
import OAuth from "./OAuth";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { icons } from "@/constants";
import { UserFormData } from "@/types/type";
import { Text } from "react-native";

interface SignUpFormProps {
    form: UserFormData;
    onFieldChange: (field: keyof UserFormData) => (value: string) => void;
    onSubmit: () => Promise<void>;
  }
  
  export const SignUpForm: React.FC<SignUpFormProps> = ({
    form,
    onFieldChange,
    onSubmit,
  }) => (
    <View className="p-5">
      <InputField
        label="Name"
        placeholder="Enter name"
        icon={icons.person}
        value={form.name}
        onChangeText={onFieldChange('name')}
      />
      <InputField
        label="Email"
        placeholder="Enter email"
        icon={icons.email}
        textContentType="emailAddress"
        value={form.email}
        onChangeText={onFieldChange('email')}
      />
      <InputField
        label="Password"
        placeholder="Enter password"
        icon={icons.lock}
        secureTextEntry={true}
        textContentType="password"
        value={form.password}
        onChangeText={onFieldChange('password')}
      />
      <CustomButton title="Sign Up" onPress={onSubmit} className="mt-6" />
      <OAuth />
      <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
        Already have an account? <Text className="text-primary-500">Log In</Text>
      </Link>
    </View>
  );