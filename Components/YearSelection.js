/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React, {useEffect, useState} from 'react';

import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';

import {Card} from 'react-native-elements';

import Question from './Question';
import ResultQuestion from './ResultQuestion';
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
        <Text style={styles.quizResult}>{props.year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const YearSelection = ({route, navigation}) => {
  // states
  const [allYears, setAllYears] = useState([]);
  const [selectedValue, setSelectedValue] = useState("none");
  const [completedYears, setCompletedYears] = useState([]);


  // get data from database
  useEffect(() => {
    getAllYears();
  }, []); // call component did mount

  const getAllYears = async () => {
    // get the qualification and subject
    let qualification = route.params.qualification.name;
    let subject = route.params.sub.name;
    // query the database to get all years available for this qualification
    // and subject
    let query = `SELECT DISTINCT Year FROM Questions WHERE Qualification='${qualification}' 
    AND Subject='${subject}'`;
    let response = await ExecuteQuery(query, []);
    let rows = response.rows;

    // create an array of years
    let years = [];
    for (let i = 0; i < rows.length; i++) {
      years.push(rows.item(i).Year);
    }
    // get the years that have already been saved
    query = `SELECT DISTINCT year FROM "CompletedQuestions" WHERE qualification='${qualification}' 
    AND subject='${subject}' AND quiz_type='Year'`;
    response = await ExecuteQuery(query, []);
    rows = response.rows;
    console.log("Years saved: ");
    for (let i = 0; i < rows.length; i++) {
      console.log(rows.item(i));
    }

    // remove the years that have already been solved
    for (let i = 0; i < rows.length; i++) {
      let tmp = rows.item(i).year;
      let ind = years.indexOf(tmp);
      if (ind !== -1){
        years.splice(ind,1);
      }
    }

    // create array for years already completed
    let tmpArr = [];
    for (let i = 0; i < rows.length; i++) {
      let tmp = rows.item(i).year;
      tmpArr.push(tmp);
    }
    
    // set the years array for the componen
    setSelectedValue(years[0]);
    setAllYears(years);
    setCompletedYears(tmpArr);
  };

  const createCompletedYearsComponent = () => {
    // create a list of years completed
    let completedYearsComponent = null;
    let completedYearsBody = completedYears.map( (year, i) => {
      return (
        <QuizResult
            key={i}
            navigation={navigation}
            // id={i}
            year={year}
        />
      );
    });
    if (completedYearsBody.length > 0) {
      completedYearsComponent = (
        <View>
          <Text style={styles.quizResult}>Years already completed</Text>
          {completedYearsBody}
        </View>

      );
    }
    return completedYearsComponent;
  };

  const createPickerComponent = () => {
    // create the body of the picker with all the years
    let pickerBody = allYears.map( (year, i) => {
      return (
        <Picker.Item key={i} label={year} value={year} />
      );
    });
    // create picker component
    let yearPicker = (
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
    return yearPicker;
  };

  // get picker element
  let yearPicker = createPickerComponent();
  // get completed years component
  let completedYearsComponent = createCompletedYearsComponent();

  // create the object to send to yearwise
  let obj = {
    subject : route.params.sub.name,
    qualification : route.params.qualification.name,
    year : selectedValue,
  };

  // show all years for user to select
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.rootContainer}>
          <View>
            <Text style={styles.yearHeading}>Select a year:</Text>
          </View>
          <View>
            {yearPicker}
          </View>
        </View>
        <View>
          <Button title="Practice!" onPress={() => navigateTo(navigation, "YearWise", obj)}/>
        </View>
        <View>
          {completedYearsComponent}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  yearHeading: {
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

export default YearSelection;
