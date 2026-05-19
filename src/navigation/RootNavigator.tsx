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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2F5D46",
        tabBarInactiveTintColor: "#8A978A",
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 12,
          height: 64,
          borderRadius: 20,
          backgroundColor: "#FFFDF8",
          borderTopWidth: 0,
          elevation: 6,
          shadowColor: "#B7C9B5",
          shadowOpacity: 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700", paddingBottom: 6 },
        tabBarIconStyle: { marginTop: 6 },
      }}
    >
      <Tab.Screen
        name="发现"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>🎨</Text>, tabBarLabel: "发现" }}
      />
      <Tab.Screen
        name="记录"
        component={JournalScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>📝</Text>, tabBarLabel: "记录" }}
      />
      <Tab.Screen
        name="我的"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>🌿</Text>, tabBarLabel: "我的" }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0E1318" }}>
        <ActivityIndicator size="large" color="#2F5D46" />
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
