import 'react-native-gesture-handler';
import React from 'react';
// import {View, StatusBar, StyleSheet, ImageBackground, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Subject from './Components/Subject.js';
import Practice from './Components/Practice.js';
import Mixed from './Components/Mixed.js';
import Category from './Components/Category.js';
import Qualification from './Components/Qualification.js';
import {ExecuteQuery, loadJSONFiles} from './Components/utils.js';

const Stack = createStackNavigator();

// create database

async function populateDatabase() {
  // delete the table if it exists
  let qu = 'DROP TABLE IF EXISTS Questions';
  let r = await ExecuteQuery(qu, []);

  // check if the table exists
  let query =
    "SELECT name FROM sqlite_master WHERE type='table' AND name='Questions'";
  let response = await ExecuteQuery(query, []);

  // if the table does not exist
  if (response.rows.item(0) === undefined) {
    console.log('Creating and populating table');

    // load all the required data from the json files
    let jsonQuestions = loadJSONFiles();
    console.log("length of all: ", jsonQuestions.length);

    // create the table
    query = `CREATE TABLE "Questions" (
      "question_id"	INTEGER NOT NULL,
      "Question"	TEXT NOT NULL,
      "A"	TEXT NOT NULL,
      "B"	TEXT NOT NULL,
      "C"	TEXT NOT NULL,
      "D"	TEXT NOT NULL,
      "Answer"	TEXT NOT NULL,
      "Category"	TEXT NOT NULL,
      "Year"	TEXT NOT NULL,
      "Guess"	TEXT,
      "Qualification" TEXT NOT NULL,
      "Subject" TEXT NOT NULL,
      PRIMARY KEY("question_id")
    )`;
    await ExecuteQuery(query, []);

    // insert all the data from imported json documents into the table
    query = `INSERT INTO Questions (Question, A, B, C, D, Answer, 
      Category, Year, Guess, Qualification, Subject) VALUES`;
    // use data to add to query
    jsonQuestions.map((q, i) => {
      let questionQuery = `("${q.Question}","${q.A}","${q.B}","${q.C}",
      "${q.D}","${q.Answer}","${q.Category}","${q.Year}","${q.Guess}", 
      "${q.Qualification}","${q.Subject}")`;
      query += questionQuery;

      if (i !== jsonQuestions.length - 1) {
        query += ",";
      }
    });
    try {
      response = await ExecuteQuery(query, []);
    } catch (err) {
      console.log("Caught the error.\n", err)
    }

    query = 'SELECT * FROM Questions';
    response = await ExecuteQuery(query, []);
    console.log("Response: ", response.rows);
  } else {
    // table is already there
    console.log('NOT POPULATINGGG');
    // print out first five for checking
    // query = 'SELECT * FROM Questions';
    // response = await ExecuteQuery(query, []);
    // for (let i = 0; i < response.rows.length; i++){
    //   console.log(response.rows.item(i));
    //   if (i === 4) {
    //     break;
    //   }
    // }
  }
}

const App = () => {
  // adding a new comment to make insignificant push
  console.log('=================APPPPPPPPPPPPPPPPP======================');
  populateDatabase();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#889BE7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Qualification" component={Qualification} />
          <Stack.Screen name="Subject" component={Subject} />
          <Stack.Screen name="Practice" component={Practice} />
          <Stack.Screen name="MixedPractice" component={Mixed} />
          <Stack.Screen name="CategoryPractice" component={Category} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Home /> */}
      {/* <BoxScreen /> */}
    </>
  );
};

export default App;

// //
// if (populate) {
//   console.log('=================================Running population');
//   // Drop the table if it exists
//   txn.executeSql('DROP TABLE IF EXISTS Questions', [], (tx, res) => {
//     console.log(res);
//   });

//   // Create the table and define the properties of the columns
//   query =
//     'CREATE TABLE IF NOT EXISTS Questions(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))';
//   txn.executeSql(query, [], (tx, res) => {
//     console.log(res);
//   });

//   // Insert a record
//   txn.executeSql(
//     'INSERT INTO Questions (name) VALUES (:name)',
//     ['oldQuestion1'],
//     (tx, res) => {
//       console.log(res);
//     },
//   );
// }

// //  // Insert another record
// //  txn.executeSql('INSERT INTO Questions (name) VALUES (:name)', [
// //    'oldQuestion2',
// //  ]);

// // Select all inserted records, loop over them while printing them on the console.
// txn.executeSql('SELECT * FROM `Questions`', [], function (_tx, res) {
//   for (let i = 0; i < res.rows.length; i++) {
//     console.log('item:"', i, '"number', res.rows.item(i));
//   }
// });

// // Drop the table if it exists
// txn.executeSql('DROP TABLE IF EXISTS Questions', [], (tx, res) => {
//   console.log(res);
// });
