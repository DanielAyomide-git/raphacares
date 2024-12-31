import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/login" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/resetPassword" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/healthWorkerInfo" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/bookAppointment" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/resetPassword" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/otp" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/healthCenters" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/consultation" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/otp" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/services" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/register" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/appointmentDetails" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/addReview" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/chatScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/appointmentInfo" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/chatScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/payment" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/consultation" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/card" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/payNow" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/healthWorker" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/appointmentInfo" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/app" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/bio" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/registerHealth" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/newPassword" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/newPassword" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/home" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/home" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/appointments" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/notification" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/notification" options={{ headerShown: false }} />
      <Stack.Screen name="screens/patient/profile" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/app" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/bio" options={{ headerShown: false }} />
      <Stack.Screen name="screens/healthworker/verification" options={{ headerShown: false }} />
    </Stack>
  );
}
