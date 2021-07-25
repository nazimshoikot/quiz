import React, {Component} from 'react';

import {ScrollView, View, Text, Button, StyleSheet} from 'react-native';

import {Card} from 'react-native-elements';

const Practice = ({route, navigation}) => {
  const navigateTo = (navigation, page, parameters) => {
    navigation.navigate(page, parameters);
  };
  // console.log("Params:", route.params);
  return (
    <View>
      <ScrollView>
        <View>
          <Card title={route.params.sub.name}>
            <Text>Let's get started!</Text>
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.navButton}
                  title="Mixed"
                  onPress={() =>
                    navigateTo(navigation, 'MixedPractice', route.params)
                  }
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  style={styles.navButton}
                  title="Category"
                  onPress={() =>
                    navigateTo(navigation, 'CategorySelection', route.params)
                  }
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  style={styles.navButton}
                  title="Yearwise"
                  onPress={() =>
                    navigateTo(navigation, 'YearSelection', route.params)
                  }
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={() =>
                    navigateTo(navigation, 'Progress', route.params)
                  }
                  title="Progress"
                />
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navButton: {
    width: 100,
    margin: 10,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 100,
    margin: 10,
  },
});

export default Practice;
