import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dataDetails from './../Data/AvailableDataDetails.json';
import {ExecuteQuery} from './utils.js';
import Dashboard from './Dashboard.js';
import WelcomePage from './WelcomePage.js';

const navigateTo = (navigation, page, parameters) => {
  navigation.navigate(page, parameters);
};

const Home = ({navigation}) => {
  const [isLoggedIn, changeLoggedIn] = useState(false);
  const [showPage, setShowPage] = useState(false);
  // function to check if the user is logged in
  const checkLogin = async () => {
    // check if the table exists
    let query =
      "SELECT name FROM sqlite_master WHERE type='table' AND name='UserInfo'";
    let response = await ExecuteQuery(query, []);

    // if the table exists
    if (response.rows.item(0) !== undefined) {
      query = 'SELECT * from UserInfo';
      response = await ExecuteQuery(query, []);
      for (let i = 0; i < response.rows.length; i++) {
        console.log("length: ", response.rows.length);
        console.log("Home: ",response.rows.item(i));
      }
      //set logged in as true
      changeLoggedIn(true);
    }
    // show the appropriate page
    setShowPage(true);
  };

  // decide which page to show
  checkLogin();
  let page = null;
  // once authorization is got
  if (showPage) {
    if (isLoggedIn) {
      page = <Dashboard nav={navigation} />;
    } else {
      page = <WelcomePage setLoggedIn={changeLoggedIn} />;
    }
  }

  return page;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default Home;
