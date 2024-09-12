import Logo from "@/assets/images/nyt-logo.svg";
import { Colors } from "@/constants/Colors";
import { tokenCache } from "@/utils/cache";
import { storage } from "@/utils/storage";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
  useFonts,
} from "@expo-google-fonts/frank-ruhl-libre";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  Appearance,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVBoolean } from "react-native-mmkv";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

// Load the fonts first before hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [dark] = useMMKVBoolean("dark-mode", storage);

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(dark ? "dark" : "light");
    }
  }, [dark]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="game"
                  options={{
                    headerBackTitle: "Wordle",
                    headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
                    headerBackTitleStyle: {
                      fontFamily: "FrankRuhlLibre_800ExtraBold",
                      fontSize: 26,
                    },
                    title: "",
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: "modal",
                    headerTitle: () => <Logo width={150} height={40} />,
                    headerShadowVisible: false,
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                          name="close"
                          size={26}
                          color={Colors.light.gray}
                        />
                      </TouchableOpacity>
                    ),
                  }}
                />
                <Stack.Screen
                  name="end"
                  options={{
                    presentation: "fullScreenModal",
                    title: "",
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
