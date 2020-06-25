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

class Category extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
    };
  }

  navigateTo = (page, parameters) => {
    this.props.navigation.navigate(page, parameters);
  };

  render() {
    const {subject} = this.props.route.params;
    return (
      <View>
        <ScrollView>
          <View>
            <Card title={subject.name}>
              <Text>Let's get started with category practice!</Text>
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

export default Category;
