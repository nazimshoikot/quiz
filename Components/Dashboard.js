import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import dataDetails from './../Data/AvailableDataDetails.json';
import {ExecuteQuery, navigateTo} from './utils.js';

import {Image} from 'react-native';
import {Card, ListItem, Button, Icon} from 'react-native-elements';
import DP from './profilepic.png';
const Dashboard = (props) => {
  // constants
  const [name, setName] = useState('user');
  const [qualification, setQualification] = useState('Cambridge-IGCSE');

  // get userinfo from the database
  useEffect(() => {
    getUserInfo();
  }, []); // call component did mount

  // gets the necessary information about the user
  const getUserInfo = async () => {
    let query = `SELECT * from UserInfo WHERE user_id=${1}`;
    let response = await ExecuteQuery(query, []);
    const userInfo = response.rows.item(0);

    // set the constants
    setName(userInfo.user_name);
    setQualification(userInfo.user_qualification);
  };

  // creates the object for calling navigation
  let tmp = {qualification: qualification};
  return (
    <SafeAreaView style={styles.container}>
      <Card title={`Hello ${name}`} image={DP}>
        <Text>{`Your qualification is ${qualification}`}</Text>
        <Text>Are you ready for some practice?</Text>
        <Button
          onPress={() => navigateTo(props.nav, 'Subject', tmp)}
          title="Practice"
        />
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default Dashboard;
