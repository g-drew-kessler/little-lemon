// A Home screen with a welcome message for the Little Lemon restaurant,
// and a scrollable menu list below a search bar and category selection
// toggle buttons that allows users to filter the menu items displayed.

import { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image
} from 'react-native';

import MenuItems from '../components/MenuItems';

export default function Home() {
    return (
      <View style={styles.container}>
        <View style={{height: 200, margin: 20}}>
          <Text style={styles.title}>Little Lemon</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
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
        </View>
        <Text style={styles.orderBannerText}>ORDER FOR DELIVERY!</Text>
        <MenuItems style={{ flex: 1 }} />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#495E57',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
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
  orderBannerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 0,
  }
});