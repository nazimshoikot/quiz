/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React, {useEffect, useState} from 'react';

import {SafeAreaView, ActivityIndicator, ScrollView, View, Text, Button, StyleSheet, Platform} from 'react-native';

import {ExecuteQuery, navigateTo} from './utils.js';
import Question from './Question';
import LoadingSign from './LoadingSign.js';
import MixedResult from './MixedResult';

const CategoryQuiz = ({route, navigation}) => {
  // states
    const [questions, setQuestions] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [showResult, setShowResult] = useState(false)

  // get data from database
  useEffect(() => {
    getQuestions();
  }, []); // call component did mount

  // get questions gets the questions from database needed for the quiz
  const getQuestions = async () => {
    // get the qualification and subject
    let qualification = route.params.qualification;
    let subject = route.params.subject;
    let category = route.params.category;
    // query the database to get questions
    let query = `SELECT * FROM Questions WHERE 
    Qualification='${qualification}' 
    AND Subject='${subject}' AND Category='${category}'`;
    let response = await ExecuteQuery(query, []);
    let rows = response.rows;
    
    // populate the questions arr
    let categoryQuestions = [];
    for (let i = 0; i < rows.length; i++) {
        categoryQuestions.push(rows.item(i));
    }
    console.log("Questions: ", categoryQuestions)
    console.log("Number of questions: ", rows.length);
    
    // set the questions array
    setQuestions(categoryQuestions);
    setCanSubmit(true);
  };
  
  const recordAnswer = (index, guess) => {
    questions[index].Guess = guess;
  }

  const submitAnswers = () => {
    setShowResult(true);
  };

    // Prepare the quizzing platform
  const getQuizzingPlatform = () => {
    // create array of question components
    let questionComponents = questions.map((question, i) => {
        return (
          <Question
            ques={question}
            ind={i}
            key={i}
            recordAnswer={recordAnswer}
          />
        );
      });
    // show loading until data is loaded
    let submitButton = <LoadingSign />;
    let quizHeading = null;
    if (canSubmit) {
        // show the submit button 
        submitButton = (
            <Button title="Submit" onPress={() => submitAnswers()} />
        );

        // show the heading of the quiz
        quizHeading = (
            <View style={styles.quizHeadingContainer}>
                <Text style={styles.quizHeading}>{route.params.category}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView>
            <ScrollView>
            <View>{quizHeading}</View>
            <View>{questionComponents}</View>
            <View>{submitButton}</View>
            </ScrollView>
        </SafeAreaView>
    );
  };

  // prepares the results platform for the page
  const getResultPlatform = () => {
    let qualification = route.params.qualification;
    let subject = route.params.subject;
    let year = route.params.year;
    // find the number of correct, incorrect, and unattempted
    return (
      <Text>ResultPlatform</Text>
    );
  };


  // get the quizzing platform for user to answer questions
  let quizzingPlatform = getQuizzingPlatform();
  let platform = quizzingPlatform;
  // if the user has submitted and results need to be shown
  if (showResult) {
    let resultsPlatform = getResultPlatform();
    platform = resultsPlatform;
  }

  // show all years for user to select
  return platform
};

const styles = StyleSheet.create({
  quizHeading : {
      fontSize: 24,
  },
  quizHeadingContainer : {
    margin : 20,
    flexDirection : "column",
    alignItems: "center",
  },
});

export default CategoryQuiz;
