import { useState, useRef, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    Switch,
    StyleSheet
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { validateEmail, validateTelephone } from '../utils';

import {
  getInitProfileRecord,
  setProfileRecord,
  getProfileRecord
} from '../profileRecord';

import { deleteTable } from '../database';

export default function ProfileScreen({navigation, updateAvatarImage}) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarImage, setAvatarImage] = useState('');
    const [notifyOrderStatus, setNotifyOrderStatus] = useState(true);
    const [notifyPasswordChanges, setNotifyPasswordChanges] = useState(true);
    const [notifySpecialOffers, setNotifySpecialOffers] = useState(true);
    const [notifyNewsletter, setNotifyNewsletter] = useState(true);
    const [changeMade, setChangeMade] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [telephoneValid, setTelephoneValid] = useState(false);
    const [profile, setProfile] = useState(getInitProfileRecord());
  
    const isInitialMount = useRef(true);

    const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

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
          setFirstName(initialProfile.firstName);
          setLastName(initialProfile.lastName);
          setEmail(initialProfile.email);
          setEmailValid(validateEmail(initialProfile.email) !== null);
          setPhoneNumber(initialProfile.phoneNumber);
          setTelephoneValid(validateTelephone(initialProfile.phoneNumber) !== null);
          setAvatarImage(initialProfile.avatarImage);
          setNotifyOrderStatus(initialProfile.notifyOrderStatus);
          setNotifyPasswordChanges(initialProfile.notifyPasswordChanges);
          setNotifySpecialOffers(initialProfile.notifySpecialOffers);
          setNotifyNewsletter(initialProfile.notifyNewsletter);
        } catch(error) {
          console.log('Read error: ' + error);
        }
      })();
    }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled) {
        setAvatarImage(result.assets[0].uri);
        setChangeMade(true);
        updateAvatarImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.entryContainer}>
        <Text style={styles.introText}>Personal Information</Text>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>Avatar</Text>
            <View style={styles.rowEntry}>
                { (avatarImage === '')
                  ? <View style={styles.avatarInitialsView}>
                      <Text style={styles.avatarInitials}>{userInitials}</Text>
                    </View>
                  : <Image
                      style={styles.avatarImage}
                      source={{ uri: avatarImage}}
                    />
                }
                <Pressable
                    onPress={pickImage}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Change</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        setAvatarImage('');
                        setChangeMade(true);
                        updateAvatarImage('');
                    }}
                    disabled={avatarImage === ''}
                    style={(avatarImage === '')
                           ? styles.buttonDisabled  : styles.button}>
                    <Text style={(avatarImage === '')
                                 ? styles.disabledButtonText
                                 : styles.buttonText}>Remove</Text>
                </Pressable>
            </View>
        </View>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={firstName => {
                    setFirstName(firstName);
                    setChangeMade(true);
                }}
                keyboardType='default'
                placeholder='First Name'
            />
        </View>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={lastName => {
                    setLastName(lastName);
                    setChangeMade(true);
                }}
                keyboardType='default'
                placeholder='Last Name'
            />
        </View>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>Email{emailValid ? '' : ' (invalid)'}</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={email => {
                  setEmailValid(validateEmail(email) !== null);
                  setEmail(email);
                  setChangeMade(true);
                 }}
                keyboardType='email-address'
                placeholder='Email'
            />
        </View>
        <View style={styles.entry}>
            <Text style={styles.inputLabel}>Phone number{telephoneValid ? '' : ' (invalid)'}</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={phoneNumber => {
                  setTelephoneValid(validateTelephone(phoneNumber) !== null);
                  setPhoneNumber(phoneNumber);
                  setChangeMade(true);
                 }}
                keyboardType='phone-pad'
                placeholder='(XXX) XXX-XXXX'
            />
        </View>
        <Text style={styles.introText}>Email notifications</Text>
        <View style={styles.switchEntry}>
            <Switch
              value={notifyOrderStatus}
              onValueChange={(value) => {
                setNotifyOrderStatus(value);
                setChangeMade(true);
              }}
            />
            <Text>Order status</Text>
        </View>
        <View style={styles.switchEntry}>
            <Switch
              value={notifyPasswordChanges}
              onValueChange={(value) => {
                setNotifyPasswordChanges(value);
                setChangeMade(true);
              }}
            />
            <Text>Password changes</Text>
        </View>
        <View style={styles.switchEntry}>
            <Switch
              value={notifySpecialOffers}
              onValueChange={(value) => {
                setNotifySpecialOffers(value);
                setChangeMade(true);
              }}
            />
            <Text>Special offers</Text>
        </View>
        <View style={styles.switchEntry}>
            <Switch
              value={notifyNewsletter}
              onValueChange={(value) => {
                setNotifyNewsletter(value);
                setChangeMade(true);
              }}
            />
            <Text>Newsletter</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
            onPress={async () => {
                // On log out, forget the profile info and any menu
                // item info that had been downloaded
                setProfile(getInitProfileRecord());
                await deleteTable();
                navigation.navigate('Onboarding');
            }}
            style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
        <View style={styles.rowEntry}>
            <Pressable
                onPress={() => {
                    setFirstName(profile.firstName);
                    setLastName(profile.lastName);
                    setEmail(profile.email);
                    setPhoneNumber(profile.phoneNumber);
                    setAvatarImage(profile.avatarImage);
                    setNotifyOrderStatus(profile.notifyOrderStatus);
                    setNotifyPasswordChanges(profile.notifyPasswordChanges);
                    setNotifySpecialOffers(profile.notifySpecialOffers);
                    setNotifyNewsletter(profile.notifyNewsletter);
                    setChangeMade(false);
                    navigation.navigate('Home');
                }}
                disabled={!changeMade}
                style={!changeMade
                       ? styles.buttonDisabled  : styles.button}>
                <Text style={!changeMade ? styles.disabledButtonText
                                         : styles.buttonText}>Discard Changes</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    setProfile({
                        ...profile,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        avatarImage: avatarImage,
                        notifyOrderStatus: notifyOrderStatus,
                        notifyPasswordChanges: notifyPasswordChanges,
                        notifySpecialOffers: notifySpecialOffers,
                        notifyNewsletter: notifyNewsletter
                    });
                    setChangeMade(false);
                    navigation.navigate('Home');
                }}
                disabled={!changeMade}
                style={!changeMade
                       ? styles.buttonDisabled  : styles.button}>
                <Text style={!changeMade
                       ? styles.disabledButtonText
                       : styles.buttonText}>Save Changes</Text>
            </Pressable>
        </View>
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
    avatarInitialsView: {
        height: 80,
        width: 80,
        borderRadius: 40,
        margin: 20,
        marginTop: 0,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarInitials: {
        fontSize: 42,
        color: 'white',
        textAlign: 'center',
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
      textAlign: 'left'
    },
    entryContainer: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    regularText: {
        fontSize: 16,
        padding: 20,
        marginVertical: 8,
        color: 'black',
        textAlign: 'center',
    },
    introText: {
        fontSize: 18,
        margin: 10,
        paddingBottom: 0,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    entry: {
        alignContent: 'center',
    },
    rowEntry: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputLabel: {
        fontSize: 16,
        margin: 30,
        marginVertical: 0,
        color: 'black',
        textAlign: 'left',
    },
    avatarImage: {
        height: 80,
        width: 80,
        margin: 20,
        resizeMode: 'contain',
        borderRadius: 40,
        accessible: true,
        accessilityLabel: "Avatar image"
    },
    input: {
        fontSize: 16,
        padding: 10,
        margin: 20,
        marginTop: 0,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: 'white',
        textColor: 'black',
    },
    footer: {
        height: 150,
        backgroundColor: '#cacacaff',
        justifyContent: 'flex-end'
    },
    button: {
        padding: 10,
        margin: 10,
        backgroundColor: '#495E57',
        borderColor: '#495E57',
        borderWidth: 2,
        borderRadius: 10
    },
    logoutButton: {
        padding: 10,
        margin: 10,
        backgroundColor: '#f4ce14',
        borderColor: '#495E57',
        borderWidth: 2,
        borderRadius: 10
    },
    logoutButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonDisabled: {
        padding: 10,
        margin: 10,
        backgroundColor: '#d3d3d3ff',
        borderColor: '#495E57',
        borderWidth: 2,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    disabledButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    switchEntry: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
  }
);