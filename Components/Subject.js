import React, {Component} from 'react';

import {
  ScrollView,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dataDetails from './../Data/AvailableDataDetails.json';

const showMenu = () => {
  // eslint-disable-next-line no-alert
  alert('Menu button pressed');
};

const navigateTo = (navigation, page, parameters) => {
  navigation.navigate(page, parameters);
};

const Subject = ({route, navigation}) => {
  // const {qualification} = route.params.qualification;
  // define options button
  let menuButton = (
    <TouchableOpacity onPress={showMenu}>
      <View>
        <Icon style={styles.menuIcon} name="menu" size={40} color="#fff" />
      </View>
    </TouchableOpacity>
  );
  navigation.setOptions({
    headerRight: () => menuButton,
  });

  // get the subjects from the file
  const subjects = dataDetails.subjects;

  // make a card for each subject
  let subjectCards = subjects.map((subject) => {
    let tempObj = {sub: subject, qualification: route.params.qualification};
    console.log(tempObj)
    return (
      <TouchableOpacity
        onPress={() => navigateTo(navigation, 'Practice', tempObj)}
        key={subject.id}
      >
        <Card style={styles.welcomeTextContainer} title={subject.name} />
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.body}>
      <ScrollView>
        <View style={styles.cardContainer}>{subjectCards}</View>
      </ScrollView>
    </View>
  );
};

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

export default Subject;
