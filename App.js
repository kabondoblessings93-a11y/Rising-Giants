import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ProductivityScreen from './src/screens/ProductivityScreen';
import PlanningScreen from './src/screens/PlanningScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AssistantScreen from './src/screens/AssistantScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#94a3b8',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#0f172a', fontWeight: '700' },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Community') iconName = 'people-outline';
            else if (route.name === 'Productivity') iconName = 'time-outline';
            else if (route.name === 'Planning') iconName = 'calendar-outline';
            else if (route.name === 'Assistant') iconName = 'chatbubble-ellipses-outline';
            else if (route.name === 'Settings') iconName = 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Community"
          component={HomeScreen}
          options={{ headerTitle: 'Rising Giants' }}
        />
        <Tab.Screen name="Productivity" component={ProductivityScreen} />
        <Tab.Screen name="Planning" component={PlanningScreen} />
        <Tab.Screen name="Assistant" component={AssistantScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
