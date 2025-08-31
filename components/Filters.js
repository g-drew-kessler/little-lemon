// A Filters component providing category choices from which the
// user can select using toggle buttons.

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
            borderRadius: 10,
            margin: 10,
            backgroundColor: selections[index] ? '#EE9972' : '#495E57',
            borderWidth: 1,
            borderColor: 'white',
          }}>
          <View>
            <Text style={{ color: selections[index] ? 'black' : 'white' }}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default Filters;
