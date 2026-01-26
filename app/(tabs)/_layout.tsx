import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Moon, BookOpen, Search, Sparkles } from "lucide-react-native";
import { appColors } from "../../src/constants/colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.gray[400],
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
          borderTopColor: colorScheme === 'dark' ? appColors.zinc[800] : appColors.gray[200],
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
        },
        headerTintColor: colorScheme === 'dark' ? appColors.white : appColors.zinc[900],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Daily Symbol",
          tabBarIcon: ({ color }) => <Moon color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse A-Z",
          tabBarIcon: ({ color }) => <BookOpen color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="random"
        options={{
          title: "Random",
          tabBarIcon: ({ color }) => <Sparkles color={String(color)} size={24} />,
        }}
      />
    </Tabs>
  );
}
