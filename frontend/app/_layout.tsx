import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/login" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/resetPassword" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/resetPassword" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/otp" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/register" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/healthWorker" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/app" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/bio" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/registerHealth" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/newPassword" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/newPassword" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/home" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/home" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/message" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/message" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/notification" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/notification" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/Mail" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/User" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/User" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/profile" options={{ title: '' }} />
      <Stack.Screen name="screens/patient/profile" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/app" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/bio" options={{ title: '' }} />
      <Stack.Screen name="screens/healthworker/verification" options={{ title: '' }} />

    </Stack>
  );
}
