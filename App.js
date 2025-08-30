// Install for navigation:
// npm install @react-navigation/native
// npx Expo install react-native-screens react-native-safe-area-context
// npm install @react-navigation/native-stack
// npm install @react-native-async-storage/async-storage
// npx expo install expo-image-picker

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
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

import Home from './screens/Home';
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

function HomeScreenTitle({profile}) {
  console.log('HomeScreenTitle render, avatar:' + profile.avatarImage);
  console.log('firstName=' + profile.firstName);
  console.log('lastName=' + profile.lastName);
  return (
    <Image
          style={styles.logoImage}
          source={require('./assets/Logo.png')}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={'Little Lemon Logo'}
    />
  )
}


function ProfileButton({navigation, profile}) {
  console.log('HomeScreenTitle render, avatar:' + profile.avatarImage);
  console.log('firstName=' + profile.firstName);
  console.log('lastName=' + profile.lastName);
  console.log('navigation=' + JSON.stringify(navigation));
  let userInitials = '';
  if (profile.firstName || profile.lastName) {
    userInitials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }
  console.log('userInitials=' + userInitials);
  return (
    <Pressable onPress={() => navigation.navigate('Profile')}>

      {
        ((profile.avatarImage === undefined) || (profile.avatarImage === '')) ? (
          <View style={styles.avatarInitialsView}>
            <Text style={styles.avatarInitials}>{userInitials}</Text>
          </View>
        ) : (
          <Image
            style={styles.avatarImage}
            source={{ uri: profile.avatarImage }}
          />
        )
      }
    </Pressable>
  )
}

function ScreenTitle({title, profile}) {
  console.log('ScreenTitle render, avatar:' + profile.avatarImage);
  console.log('firstName=' + profile.firstName);
  console.log('lastName=' + profile.lastName);
  let userInitials = '';
  if (profile.firstName || profile.lastName) {
    userInitials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }
  console.log('userInitials=' + userInitials);
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <Text style={styles.screenTitle}>{title}</Text>
        { ((profile.avatarImage === undefined) || (profile.avatarImage === '')) ? (
          <View style={styles.avatarInitialsView}>
            <Text style={styles.avatarInitials}>{userInitials}</Text>
          </View>
        ) : (
          <Image
            style={styles.avatarImage}
            source={{ uri: profile.avatarImage }}
          />
        )}
    </View>
  )
}

export default function App() {
  console.log('App started');
  const [profile, setProfile] = React.useState(getInitProfileRecord());

  const isInitialMount = React.useRef(true);
  const isLoading = React.useRef(true);

  const updateBoolState = (key) => () =>
    setProfile((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  const updateState = (key) => (value) =>
    console.log('updateState value=' + String(value)) ||
    setProfile((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const updateAvatarImage = (value) => {
    console.log('updateAvatarImage value=' + String(value));
    setProfile((prevState) => ({
      ...prevState,
      avatarImage: value,
    }));
  };

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

  let userInitials = '';
  if (profile.firstName && profile.lastName) {
    userInitials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }

  if (isLoading.current) {
    return <Splash />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName= { profile.isOnboardingCompleted
                            // Onboarding complete, user is signed in
                            ? "Home"
                            : "Onboarding" }
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "white" }
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={(props) => ({
            headerRight: () => (
              <ProfileButton
                {...props}
                profile={profile}
                navigation={props.navigation}
              />
            ),
            headerTitle: (props) => <HomeScreenTitle {...props} profile={profile} />
          })}
        />
        <Stack.Screen
          name="Profile"
          options={{
            headerTitle: (props) =>
              <ScreenTitle {...props} title="Profile"
                                      profile={profile}
           />
          }}
         >
          {(props) => <Profile {...props} updateAvatarImage={updateAvatarImage} />}
        </Stack.Screen>
        <Stack.Screen name="Onboarding">
          {(props) => <Onboarding {...props} updateProfile={(profile) => setProfile(profile)} />}
        </Stack.Screen>
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
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  logoImage: {
    height: 50,
    width: 150,
    margin: 20,
    resizeMode: 'contain',
    borderRadius: 40,
    accessible: true,
    accessibilityLabel: "Logo image"
  },
  avatarImage: {
    height: 50,
    width: 50,
    margin: 20,
    resizeMode: 'contain',
    borderRadius: 40,
    accessible: true,
    accessibilityLabel: "Avatar image"
  },
  avatarInitialsView: {
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 20,
        marginTop: 0,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center'
  },
  avatarInitials: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
  },
});
