import React, {Component} from 'react';

import {ScrollView, View, Text, Button, StyleSheet} from 'react-native';

import {Card} from 'react-native-elements';

const Practice = ({route, navigation}) => {
  const navigateTo = (navigation, page, parameters) => {
    navigation.navigate(page, parameters);
  };

  let obj = {
    qualification: route.params.qualification,
    subject: route.params.sub.name,
  };
  console.log('Object being passed from practice: ', obj);
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
                  onPress={() => navigateTo(navigation, 'MixedPractice', obj)}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  style={styles.navButton}
                  title="Category"
                  onPress={() =>
                    navigateTo(navigation, 'CategorySelection', obj)
                  }
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  style={styles.navButton}
                  title="Yearwise"
                  onPress={() => navigateTo(navigation, 'YearSelection', obj)}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => navigateTo(navigation, 'Progress', obj)}
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
