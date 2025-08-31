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

  // Update the profile in our AsyncStorage whenever it changes, except on
  // the first rendering, where the profile should be set from the current
  // value in the AsyncStorage
  
  useEffect(() => {
    (async() => {
      try {
        console.log('initial mount check onboarding');
        if (isInitialMount.current) {
          isInitialMount.current = false;
        } else {
          console.log('Setting values onboarding');
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
        console.log('Getting Values onboarding');
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
        <Text style={styles.introText}>Let us get to know you!</Text>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
                style={styles.input}
                value={profile.firstName}
                onChangeText={updateState('firstName')}
                keyboardType='default'
                placeholder='First Name'
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
              updateState('isOnboardingCompleted')(true);
              updateProfile(profile);
              navigation.navigate('Home');
            }}
            disabled={(profile.firstName === '' || !emailValid)}
            style={(profile.firstName === '' || !emailValid)
                   ? styles.buttonDisabled  : styles.button}>
            <Text style={styles.buttonText}>Next</Text>
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
        backgroundColor: '#cacacaff',
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
      fontSize: 30,
      color: 'black',
      textAlign: 'center'
    },
    entryContainer: {
        flex: 1,
        backgroundColor: '#929292ff',
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
        margin: 40,
        paddingBottom: 100,
        color: 'black',
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
        color: 'black',
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
        backgroundColor: '#cacacaff',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        width: 140,
        padding: 10,
        marginVertical: 40,
        margin: 40,
        backgroundColor: '#929292ff',
        borderColor: '#929292ff',
        borderWidth: 2,
        borderRadius: 10
    },
    buttonDisabled: {
        width: 140,
        padding: 10,
        marginVertical: 40,
        margin: 40,
        backgroundColor: '#d3d3d3ff',
        borderColor: '#d3d3d3ff',
        borderWidth: 2,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center'
    }
  }
)