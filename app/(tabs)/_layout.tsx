import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="(expenses)"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(expenses)"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(import-export)"
        options={{
          title: "Import/Export",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="import-export" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
