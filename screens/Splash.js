import {
    View,
    Image,
    StyleSheet
} from 'react-native';

export default function Splash() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logoImage}
        source={require('../assets/little-lemon-logo.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center' 
    },
    logoImage: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
        borderRadius: 20,
        alignSelf: 'center',
        accessible: true,
        accessilityLabel: "Little Lemon Logo"
    },
  }
)