import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="login" options={{ title: '' }} />
      <Stack.Screen name="register" options={{ title: '' }} />
      <Stack.Screen name="healthWorker" options={{ title: '' }} />
      <Stack.Screen name="loginHealth" options={{ title: '' }} />
      <Stack.Screen name="registerHealth" options={{ title: '' }} />

    </Stack>
  );
}
