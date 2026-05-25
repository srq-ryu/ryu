import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, ActivityIndicator } from "react-native";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { JournalScreen } from "../screens/JournalScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { supabase } from "../services/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { appTheme } from "../theme";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryGreen,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 24,
          height: 72,
          borderRadius: 24,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.primaryGreen,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700", marginBottom: 6 },
        tabBarIconStyle: { marginTop: 8 },
      }}
    >
      <Tab.Screen
        name="发现"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎨</Text>, tabBarLabel: "发现" }}
      />
      <Tab.Screen
        name="记录"
        component={JournalScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📝</Text>, tabBarLabel: "记录" }}
      />
      <Tab.Screen
        name="我的"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⛲</Text>, tabBarLabel: "我的" }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.cream }}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}
