/**
 * Navigation — premium minimal tab bar
 * Matches reference: flat white bar, indigo active icon+label,
 * no FAB bump, clean icons: home / search / folder / person
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { TabParamList, RootStackParamList } from '../types';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { DocumentsScreen } from '../screens/Documents/DocumentsScreen';
import { ApplicationsScreen } from '../screens/Applications/ApplicationsScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

import { AskScreen } from '../screens/Journey/AskScreen';
import { GoalConfirmationScreen } from '../screens/Journey/GoalConfirmationScreen';
import { RequirementsScreen } from '../screens/Journey/RequirementsScreen';
import { MissingDocumentScreen } from '../screens/Journey/MissingDocumentScreen';
import { RenewalFlowScreen } from '../screens/Journey/RenewalFlowScreen';
import { CorrectionFlowScreen } from '../screens/Journey/CorrectionFlowScreen';
import { DocumentDetailScreen } from '../screens/Documents/DocumentDetailScreen';
import { ShareDocumentScreen } from '../screens/Documents/ShareDocumentScreen';
import { ApplicationFlowScreen } from '../screens/Applications/ApplicationFlowScreen';
import { ApplicationStatusScreen } from '../screens/Applications/ApplicationStatusScreen';
import { ApplicationSuccessScreen } from '../screens/Applications/ApplicationSuccessScreen';
import { FamilyScreen } from '../screens/Family/FamilyScreen';
import { FamilyMemberScreen } from '../screens/Family/FamilyMemberScreen';
import { NotificationsScreen } from '../screens/Profile/NotificationsScreen';
import { SplashScreen } from '../screens/SplashScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const INDIGO = '#3D3BF3';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TAB_CONFIG: Record<string, {
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
  label: string;
}> = {
  Home: { active: 'home', inactive: 'home-outline', label: 'Home' },
  Documents: { active: 'folder', inactive: 'folder-outline', label: 'Issued' },
  Applications: { active: 'search', inactive: 'search-outline', label: 'Search' },
  Profile: { active: 'person', inactive: 'person-outline', label: 'Profile' },
};

// ─── Custom tab bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: {
  state: any; descriptors: any; navigation: any;
}) {
  return (
    <View style={styles.tabBarOuter}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any) => {
          const isFocused = state.index === state.routes.indexOf(route);
          const cfg = TAB_CONFIG[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline', label: route.name };

          // Route "Applications" tab navigates to AskScreen (search)
          const onPress = () => {
            if (route.name === 'Applications') {
              navigation.navigate('AskScreen');
              return;
            }
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={cfg.label}
            >
              <Ionicons
                name={isFocused ? cfg.active : cfg.inactive}
                size={24}
                color={isFocused ? INDIGO : Colors.textTertiary}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main tabs ────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Issued' }} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Root navigator ───────────────────────────────────────────────────────────
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />

        <Stack.Screen name="AskScreen" component={AskScreen} />
        <Stack.Screen name="GoalConfirmation" component={GoalConfirmationScreen} />
        <Stack.Screen name="Requirements" component={RequirementsScreen} />
        <Stack.Screen name="MissingDocument" component={MissingDocumentScreen} />

        <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
        <Stack.Screen name="ShareDocument" component={ShareDocumentScreen} />

        <Stack.Screen name="ApplicationFlow" component={ApplicationFlowScreen} />
        <Stack.Screen name="ApplicationStatus" component={ApplicationStatusScreen} />
        <Stack.Screen name="ApplicationSuccess" component={ApplicationSuccessScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />

        <Stack.Screen name="RenewalFlow" component={RenewalFlowScreen} />
        <Stack.Screen name="CorrectionFlow" component={CorrectionFlowScreen} />

        <Stack.Screen name="FamilyScreen" component={FamilyScreen} />
        <Stack.Screen name="FamilyMember" component={FamilyMemberScreen} />

        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="SearchScreen" component={AskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const TAB_HEIGHT = Platform.OS === 'ios' ? 80 : 62;
const BOTTOM_PAD = Platform.OS === 'ios' ? 24 : 6;

const styles = StyleSheet.create({
  tabBarOuter: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  tabBar: {
    flexDirection: 'row',
    height: TAB_HEIGHT,
    paddingBottom: BOTTOM_PAD,
    paddingTop: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '500', marginTop: 2 },
  tabLabelActive: { color: INDIGO, fontWeight: '600' },
});
