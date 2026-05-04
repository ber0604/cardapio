import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="cardapio" />
        <Stack.Screen name="add-cardapio" />
      </Stack>
    </AppProvider>
  );
}
