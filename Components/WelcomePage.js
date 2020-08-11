import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dataDetails from './../Data/AvailableDataDetails.json';
import {Picker} from '@react-native-community/picker';
import {ExecuteQuery, navigateTo} from './utils.js';

const WelcomePage = (props) => {
  const qualificationData = dataDetails.qualifications;

  const [name, setName] = useState('');
  const [selectedValue, setSelectedValue] = useState(qualificationData[0].name);
  
  // create the qualification picker
  const createQualificationPicker = () => {
    // get all the qualifications from the data
    let pickerBody = qualificationData.map((q, i) => {
      return (
        <Picker.Item
          style={styles.pickerBody}
          key={i}
          label={q.name}
          value={q.name}
        />
      );
    });
    return (
      <Picker
        selectedValue={selectedValue}
        style={styles.pickerStyle}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        itemStyle={styles.pickerBody}
      >
        {pickerBody}
      </Picker>
    );
  };

  // save the user info the
  const saveUserInfo = async () => {
    // create the table if it does not exist
    let query = `CREATE TABLE IF NOT EXISTS "UserInfo" (
        "user_id" INTEGER NOT NULL,
        "user_qualification" TEXT NOT NULL,
        "user_name" TEXT NOT NULL,
        PRIMARY KEY("user_id")
    )`;
    let response = await ExecuteQuery(query, []);
    console.log('Created UserInfo table: ', response.rows);

    // insert user details
    console.log("Values: ", 1, selectedValue, name);
    query = `INSERT INTO "UserInfo" (user_id, user_qualification,
      user_name) VALUES (?, ?, ?)`;
    response = await ExecuteQuery(query, [1, selectedValue, name]);
    console.log('Inserted user info');

    // reload the home page
    props.setLoggedIn(true);
  };

  // get the qualification picker
  let qualificationPicker = createQualificationPicker();

  // create the object for navigation to another page
  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.textInputContainer}>
        <TextInput
          value={name}
          onChangeText={(val) => setName(val)}
          placeholder="Name"
          style={styles.textInput}
        />
      </View>
      <View style={styles.textInputContainer}>{qualificationPicker}</View>
      <Button title="Log in" onPress={() => saveUserInfo()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 24,
    width: 300,
    fontFamily: 'Poppins',
  },
  textInputContainer: {
    borderColor: 'white',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 50,
    padding: 10,
  },
  rootContainer: {
    backgroundColor: '#03256C',
    flex: 1,
    justifyContent: 'center',
  },
  pickerStyle: {
    height: 50,
    width: 200,
    backgroundColor: 'white',
  },
  pickerBody: {
      fontSize: 32,
      margin: 20
  },
});

export default WelcomePage;
