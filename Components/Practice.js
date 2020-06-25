import React, {Component} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';

import {Card} from 'react-native-elements';

import bg from './bg-image.png';

// const bg = {uri: 'https://reactjs.org/logo-og.png'};

class Practice extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
    };
  }

  navigateTo = (page, parameters) => {
      console.log("Navigating from practice: ", page, parameters);
    this.props.navigation.navigate(page, parameters);
  };

  render() {
    const {sub} = this.props.route.params;
    console.log("Subject 2:", sub);
    let obj = {subject: sub};
    return (
      <View>
        <ScrollView>
          <View>
            <Card title={sub.name}>
              <Text>Let's get started!</Text>
              <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                  <Button
                    style={styles.navButton}
                    title="Mixed"
                    onPress={() => this.navigateTo('MixedPractice', obj)}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    style={styles.navButton}
                    title="Category X"
                    onPress={() => this.navigateTo('CategoryPractice', obj)}
                  />
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}

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
