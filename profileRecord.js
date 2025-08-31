// Routines that manage the user profile record as it is stored in
// an AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

export function getInitProfileRecord() {
    return {
      isOnboardingCompleted: false,
      firstName: '',
      lastName: '',
      avatarImage: '',
      email: '',
      phoneNumber: '',
      notifyOrderStatus: true,
      notifyPasswordChanges: true,
      notifySpecialOffers: true,
      notifyNewsletter: true
    }
}

export async function setProfileRecord(profile) {
  try {
    await AsyncStorage.multiSet([
      ['isOnboardingCompleted', Boolean(profile.isOnboardingCompleted).toString()],
      ['firstName', '"' + profile.firstName + '"'],
      ['lastName', '"' + profile.lastName + '"'],
      ['avatarImage', '"' + profile.avatarImage + '"'],
      ['email', '"' + profile.email + '"'],
      ['phoneNumber', '"' + profile.phoneNumber + '"'],
      ['notifyOrderStatus', Boolean(profile.notifyOrderStatus).toString()],
      ['notifyPasswordChanges', Boolean(profile.notifyPasswordChanges).toString()],
      ['notifySpecialOffers', Boolean(profile.notifySpecialOffers).toString()],
      ['notifyNewsletter', Boolean(profile.notifyNewsletter).toString()]
    ]);
  } catch(error) {
    console.log('Set profile error: ' + error);
  }
}

export async function getProfileRecord() {
  let profile = getInitProfileRecord();
  try {
    const values = await AsyncStorage.multiGet(['isOnboardingCompleted',
                                                'firstName',
                                                'lastName',
                                                'avatarImage',
                                                'email',
                                                'phoneNumber',
                                                'notifyOrderStatus',
                                                'notifyPasswordChanges',
                                                'notifySpecialOffers',
                                                'notifyNewsletter']);
    console.log('values: ' + JSON.stringify(values));
    profile = values.reduce((acc, curr) => {
      // Every item in the values array is itself an array with a string key
      // and a stringified value, i.e ['isOnboardingCompleted', 'firstName', 'email']
      console.log('value for ' + String(curr[0]) + ' is ' + String(curr[1]));
      acc[curr[0]] = (curr[1] === '' ? '' : JSON.parse(curr[1]));
      return acc;
    }, {});
  } catch(error) {
      console.log('Get profile error: ' + error);
  }
  return profile;
}

