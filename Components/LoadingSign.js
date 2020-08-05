import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const LoadingSign = () => {
  return (
    <View style={styles.activityContainter}>
      <ActivityIndicator style={styles.activity} size="large" color="#00ff00" />
    </View>
  );
};

const styles = StyleSheet.create({
  activityContainter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 180,
  },
  activity : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
  },
});

export default LoadingSign;
