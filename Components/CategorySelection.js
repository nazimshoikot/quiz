/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React, {useEffect, useState} from 'react';

import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';

import {Card} from 'react-native-elements';

import {ExecuteQuery, navigateTo} from './utils.js';
import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button} from 'react-native-elements';
import MixedResult from './MixedResult';
import {TouchableOpacity} from 'react-native-gesture-handler';

// Item for each result. Onpress navigates it to result page
const QuizResult = (props) => {
  return (
    <TouchableOpacity
      // key={props.id}
      // onPress={() => navigateTo(props.navigation, 'Result', obj)}
    >
      <View style={styles.quizResultContainer}>
        <Text style={styles.quizResult}>{props.Category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CategorySelection = ({route, navigation}) => {
  // states
  const [allCategories, setAllCategories] = useState([]);
  const [selectedValue, setSelectedValue] = useState("none");
  const [completedCategories, setCompletedCategories] = useState([]);

  // get data from database
  useEffect(() => {
    getAllCategories();
  }, []); // call component did mount

  // gets all the categories for users to select
  const getAllCategories = async () => {
    // get the qualification and subject
    let qualification = route.params.qualification.name;
    let subject = route.params.sub.name;
    // query the database to get all Categories available for this qualification
    // and subject
    let query = `SELECT DISTINCT Category FROM Questions WHERE Qualification='${qualification}' 
    AND Subject='${subject}'`;
    let response = await ExecuteQuery(query, []);
    let rows = response.rows;

    // create an array of Categories
    let Categories = [];
    for (let i = 0; i < rows.length; i++) {
        if (rows.item(i).Category !== "") {
            Categories.push(rows.item(i).Category);

        }
    }
    // get the Categories that have already been saved
    query = `SELECT DISTINCT category FROM "CompletedQuestions" WHERE qualification='${qualification}' 
    AND subject='${subject}' AND quiz_type='Category'`;
    response = await ExecuteQuery(query, []);
    rows = response.rows;
    console.log("Categories saved: ");
    for (let i = 0; i < rows.length; i++) {
      console.log(rows.item(i));
    }

    // remove the Categories that have already been solved
    for (let i = 0; i < rows.length; i++) {
      let tmp = rows.item(i).Category;
      let ind = Categories.indexOf(tmp);
      if (ind !== -1){
        Categories.splice(ind,1);
      }
    }
    console.log("Categories: ", Categories);
    // create array for Categories already completed
    let tmpArr = [];
    for (let i = 0; i < rows.length; i++) {
      let tmp = rows.item(i).Category;
      tmpArr.push(tmp);
    }
    
    // set the Categories array for the componen
    setSelectedValue(Categories[0]);
    setAllCategories(Categories);
    setCompletedCategories(tmpArr);
  };

  const createCompletedCategoriesComponent = () => {
    // create a list of Categories completed
    let completedCategoriesComponent = null;
    let completedCategoriesBody = completedCategories.map( (Category, i) => {
      return (
        <QuizResult
            key={i}
            navigation={navigation}
            // id={i}
            Category={Category}
        />
      );
    });
    if (completedCategoriesBody.length > 0) {
      completedCategoriesComponent = (
        <View>
          <Text style={styles.quizResult}>Categories already completed</Text>
          {completedCategoriesBody}
        </View>

      );
    }
    return completedCategoriesComponent;
  };

  const createPickerComponent = () => {
    // create the body of the picker with all the Categories
    let pickerBody = allCategories.map( (Category, i) => {
      return (
        <Picker.Item key={i} label={Category} value={Category} />
      );
    });
    // create picker component
    let CategoryPicker = (
      <View>
        <Picker
          selectedValue={selectedValue}
          style={styles.pickerDimension}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          {pickerBody}
        </Picker>
      </View>
    );
    return CategoryPicker;
  };

  // get picker element
  let CategoryPicker = createPickerComponent();
  // get completed Categories component
  let completedCategoriesComponent = createCompletedCategoriesComponent();

  // create the object to send to Categorywise
  let obj = {
    subject : route.params.sub.name,
    qualification : route.params.qualification.name,
    category : selectedValue,
  };

  // show all Categories for user to select
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.rootContainer}>
          <View>
            <Text style={styles.CategoryHeading}>Select a Category:</Text>
          </View>
          <View>
            {CategoryPicker}
          </View>
        </View>
        <View>
          <Button title="Practice!" onPress={() => navigateTo(navigation, "CategoryPractice", obj)}/>
        </View>
        <View>
          {completedCategoriesComponent}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  CategoryHeading: {
    fontSize: 24,
  },
  rootContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerDimension: {
    height: 80,
    width: 180,
    margin: 10,
  },
  quizResultContainer: {
    backgroundColor: "#889BE7",
    margin: 20,
  },
  quizResult: {
    fontSize: 24,
  },
});

export default CategorySelection;
