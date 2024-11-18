import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="patient/login" options={{ title: '' }} />
      <Stack.Screen name="patient/register" options={{ title: '' }} />
      <Stack.Screen name="healthworker/healthWorker" options={{ title: '' }} />
      <Stack.Screen name="patient/app" options={{ title: '' }} />
      <Stack.Screen name="heathworker/loginHealth" options={{ title: '' }} />
      <Stack.Screen name="patient/bio" options={{ title: '' }} />
      <Stack.Screen name="healthworker/registerHealth" options={{ title: '' }} />
      <Stack.Screen name="healthworker/home" options={{ title: '' }} />
      <Stack.Screen name="patient/home" options={{ title: '' }} />
      <Stack.Screen name="healthworker/message" options={{ title: '' }} />
      <Stack.Screen name="patient/message" options={{ title: '' }} />
      <Stack.Screen name="healthworker/notification" options={{ title: '' }} />
      <Stack.Screen name="patient/notification" options={{ title: '' }} />
      <Stack.Screen name="healthworker/Mail" options={{ title: '' }} />
      <Stack.Screen name="healthworker/User" options={{ title: '' }} />
      <Stack.Screen name="patient/User" options={{ title: '' }} />
      <Stack.Screen name="healthworker/profile" options={{ title: '' }} />
      <Stack.Screen name="patient/profile" options={{ title: '' }} />
      <Stack.Screen name="healthworker/app" options={{ title: '' }} />
      <Stack.Screen name="healthworker/bio" options={{ title: '' }} />
      <Stack.Screen name="healthworker/verification" options={{ title: '' }} />

    </Stack>
  );
}
