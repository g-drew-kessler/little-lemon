// An on-boarding screen that appears if the user hasn't used the app
// yet, or logged out since last using the app. Gets the user's name and
// email before proceeding to the main app.

import { useState, useRef, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    StyleSheet
} from 'react-native';

import { validateEmail } from '../utils';

import {
  getInitProfileRecord,
  setProfileRecord,
  getProfileRecord
} from '../profileRecord';

export default function Onboarding({navigation, updateProfile}) {
  const [emailValid, setEmailValid] = useState(false);
  const [profile, setProfile] = useState(getInitProfileRecord());

  const isInitialMount = useRef(true);

  const toggleBoolState = (key) => () =>
    setProfile((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  const updateState = (key) => (value) =>
    setProfile((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const updateName = (name) => {
    const lastNameIndex = name.lastIndexOf(' ');
    if ((lastNameIndex >= 0) && (lastNameIndex < name.length - 1)) {
      updateState('firstName')(name.slice(0, lastNameIndex));
      updateState('lastName')(name.slice(lastNameIndex + 1));
    } else {
      updateState('firstName')(name);
      updateState('lastName')('');
    }
  }

  // Update the profile in our AsyncStorage whenever it changes, except on
  // the first rendering, where the profile should be set from the current
  // value in the AsyncStorage

  useEffect(() => {
    (async() => {
      try {
        if (isInitialMount.current) {
          isInitialMount.current = false;
        } else {
          await setProfileRecord(profile);
        }
      } catch(error) {
        console.log('Store error: ' + error);
      }
    })();
  }, [profile]);
  
  useEffect(() => {
    (async () => {
      try {
        const initialProfile = await getProfileRecord();
        setProfile(initialProfile);
        setEmailValid(validateEmail(initialProfile.email) !== null);
      } catch(error) {
        console.log('Read error: ' + error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logoImage}
          source={require('../assets/Image-1.png')}
        />
        <Text style={styles.title}>
          Little Lemon
        </Text>
      </View>
      <ScrollView style={styles.entryContainer}>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1, flexDirection: 'column'}}>
            <Text style={styles.subtitle}>Chicago</Text>
            <Text style={styles.infoText}>
              We are a family-owned Mediterranean restaurant, focused
              on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.infoImage}
            source={require('../assets/Hero image.png')}
            accessible={true}
            accessibilityLabel={'Little Lemon Hero Image'}
          />
        </View>
        <Text style={styles.introText}>Let us get to know you!</Text>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
                style={styles.input}
                value={profile.firstName + (profile.lastName ? ' ' + profile.lastName : '')}
                onChangeText={updateName}
                keyboardType='default'
                placeholder='First or Full Name'
            />
        </View>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={email => {
                  setEmailValid(validateEmail(email) !== null);
                  updateState('email')(email);
                }}
                keyboardType='email-address'
                placeholder='Email'
            />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
            onPress={() => {
              toggleBoolState('isOnboardingCompleted')(true);
              profile.isOnboardingCompleted = true;
              updateProfile(profile);
              navigation.navigate('Home');
            }}
            disabled={(profile.firstName === '' || !emailValid)}
            style={(profile.firstName === '' || !emailValid)
                   ? styles.buttonDisabled  : styles.button}>
            <Text style={(profile.firstName === '' || !emailValid)
                   ? styles.buttonTextDisabled  : styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    header: {
      padding: 20,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    logoImage: {
      height: 100,
      width: 100,
      resizeMode: 'contain',
      borderRadius: 20,
      accessible: true,
      accessilityLabel: "Little Lemon Logo"
    },
    title: {
      padding: 20,
      fontSize: 42,
      color: '#495E57',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    entryContainer: {
      flex: 1,
      backgroundColor: '#495E57',
    },
    infoContainer: {
      flex: 1,
      flexDirection: 'row',
      margin: 20,
      justifyContent: 'space-between',
    },
    subtitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
    },
    infoText: {
      width: '200',
      fontSize: 16,
      color: 'white',
    },
    infoImage: {
      width: 150,
      height: 150,
      margin: 10,
      borderRadius: 40,
      resizeMode: 'cover',
    },
    regularText: {
      fontSize: 24,
      padding: 20,
      marginVertical: 8,
      color: 'black',
      textAlign: 'center',
    },
    introText: {
      fontSize: 24,
      margin: 20,
      paddingBottom: 10,
      color: 'white',
      textAlign: 'center',
    },
    entry: {
      alignContent: 'center',
    },
    inputLabel: {
      fontSize: 24,
      margin: 0,
      paddingTop: 10,
      marginVertical: 0,
      color: 'white',
      textAlign: 'center',
    },
    input: {
      height: 40,
      fontSize: 16,
      padding: 10,
      margin: 20,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: 'black',
      backgroundColor: 'white',
      textColor: 'black',
    },
    footer: {
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    button: {
      width: 140,
      padding: 10,
      marginVertical: 40,
      margin: 40,
      backgroundColor: '#495E57',
      borderColor: '#495E57',
      borderWidth: 2,
      borderRadius: 10
    },
    buttonDisabled: {
      width: 140,
      padding: 10,
      marginVertical: 40,
      margin: 40,
      backgroundColor: '#d3d3d3ff',
      borderColor: '#495E57',
      borderWidth: 2,
      borderRadius: 10
    },
    buttonText: {
      fontSize: 24,
      color: 'white',
      textAlign: 'center'
    },
    buttonTextDisabled: {
      fontSize: 24,
      color: 'black',
      textAlign: 'center'
    }
  }
)