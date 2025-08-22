// Install for navigation:
// npm install @react-navigation/native
// npx Expo install react-native-screens react-native-safe-area-context
// npm install @react-navigation/native-stack
// npm install @react-native-async-storage/async-storage
// npm expo install expo-image-picker

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getInitProfileRecord,
  setProfileRecord,
  getProfileRecord
} from './profileRecord';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

export default function App() {
  console.log('App started');
  const [profile, setProfile] = React.useState(getInitProfileRecord());

  const isInitialMount = React.useRef(true);
  const isLoading = React.useRef(true);

  const updateState = (key) => () =>
    setProfile((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  React.useEffect(() => {
    (async() => {
      try {
        console.log('initial mount check');
        if (isInitialMount.current) {
          isInitialMount.current = false;
        } else {
          console.log('Setting values');
          await setProfileRecord(profile);
        }
      } catch(error) {
        console.log('Store error: ' + error);
      }
    })();
  }, [profile]);
  
  React.useEffect(() => {
    (async () => {
      try {
        console.log('Getting Values');
        const initialProfile = await getProfileRecord();
        setProfile(initialProfile);
        isLoading.current = false;
      } catch(error) {
        console.log('Read error: ' + error);
      }
    })();
  }, []);

  if (isLoading.current) {
    return <Splash />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: {backgroundColor:"white"}}}
      >{
        profile.isOnboardingCompleted ? (
          // Onboarding complete, user is signed in
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          // User hasn't signed in yet
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
