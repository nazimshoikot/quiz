import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'QuestionsDB.db'});

// read the json file and put it in the questions database
db.transaction(function (txn) {

  // Drop the table if it exists
  txn.executeSql('DROP TABLE IF EXISTS Questions', []);

  // Create the table and define the properties of the columns
  let query =
    'CREATE TABLE IF NOT EXISTS Questions(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))';
  txn.executeSql(query, []);

  // Insert a record
  txn.executeSql('INSERT INTO Questions (name) VALUES (:name)', [
    'oldQuestion1',
  ]);

  // Insert another record
  txn.executeSql('INSERT INTO Questions (name) VALUES (:name)', [
    'oldQuestion2',
  ]);

  // Select all inserted records, loop over them while printing them on the console.
  txn.executeSql('SELECT * FROM `Questions`', [], function (_tx, res) {
    for (let i = 0; i < res.rows.length; ++i) {
      console.log('item:', res.rows.item(i));
    }
  });
});
