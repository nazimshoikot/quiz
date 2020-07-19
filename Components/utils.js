import SQLite from 'react-native-sqlite-storage';
import {concat} from 'react-native-reanimated';

// open the database. Since we only use one database, it does not need
// opened in any other files
const db = SQLite.openDatabase(
  {
    name: 'database.db',
    location: 'default',
    // createFromLocation: '~www/Questions.db',
  },
  () => {
    console.log('Successfully imported database');
    // populateDatabase();
  },
  (error) => {
    console.log('Could not import database', error);
  },
);

// synchronous query for database
export const ExecuteQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        (error) => {
          console.log("There has been an error");
          reject(error);
        },
      );
    });
  });

// get json data from each file and feed it into json array
export const loadJSONFiles = () => {
  // import all the questions
  let accountingQuestions = require('./../Data/Cambridge-IGCSE_Accounting.json');
  let physicsQuestions = require('./../Data/Cambridge-IGCSE_Physics.json');

  // concat all the arrays
  let allQuestions = accountingQuestions.concat(physicsQuestions);
  return allQuestions;
};
