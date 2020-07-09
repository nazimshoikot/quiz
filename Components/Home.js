import React, {Component} from 'react';

import {
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import {Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import bg from './bg-image.png';
// import {TouchableOpacity} from 'react-native-gesture-handler';

// const bg = {uri: 'https://reactjs.org/logo-og.png'};

class Home extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
    };

    this.subjects = [
      {
        name: 'Accounting',
        description: 'Past mcq questions of IGCSE Accounting',
        id: '1',
      },
      {
        name: 'Chemistry',
        description: 'Past mcq questions of IGCSE Chemistry',
        id: '2',
      },
    ];
  }

  showMenu = () => {
    alert('Menu button pressed');
  };

  navigateTo = (page, parameters) => {
    this.props.navigation.navigate(page, parameters);
  };

  render() {
    // define options button
    let menuButton = (
      <TouchableOpacity onPress={this.showMenu}>
        <View>
          <Icon style={styles.menuIcon} name="menu" size={40} color="#fff" />
        </View>
      </TouchableOpacity>
    );
    this.props.navigation.setOptions({
      headerRight: () => menuButton,
    });

    // make a card for each subject
    let subjectCards = this.subjects.map((subject) => {
      let tempObj = {sub: subject};
      return (
        <Card
          key={subject.id}
          style={styles.welcomeTextContainer}
          title={subject.name}
        >
          <Text key={subject.id}>{subject.description}</Text>
          <Button
            key={subject.id + 1}
            title="GO"
            type="clear"
            onPress={() => this.navigateTo('Practice', tempObj)}
          />
        </Card>
      );
    });

    return (
      <View style={styles.body}>
        <ImageBackground source={bg} style={styles.bgImage}>
          <ScrollView>
            <View style={styles.cardContainer}>{subjectCards}</View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  logoStyle: {
    width: '100%',
  },
  welcomeTextContainer: {
    width: 200,
  },
  welcomeText: {
    fontSize: 25,
  },
  try1: {
    flex: 1,
    width: 50,
    height: 50,
    backgroundColor: 'powderblue',
  },
  try2: {
    flex: 1,
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  menuIcon: {
    margin: 5,
  },
});

export default Home;
