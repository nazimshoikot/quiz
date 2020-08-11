import React, {useEffect, useState} from 'react';
import {Card} from 'react-native-elements';
import {ExecuteQuery, navigateTo} from './utils.js';
import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

// Item for each result. Onpress navigates it to result page
const QuizResult = (props) => {
  let testName = props.testName;
  // console.log("Quiz: ", props.quiz);
  let obj = {quiz: props.quiz};
  return (
    <TouchableOpacity
      key={props.quiz.quiz_id}
      onPress={() => navigateTo(props.navigation, 'Result', obj)}
    >
      <View style={styles.quizResultContainer}>
        <Text style={styles.quizResult}>{testName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Progress = ({route, navigation}) => {
  // get values from props
  let subject = route.params.subject;
  let qualification = route.params.qualification;
  // define state
  const [pageComponent, setPageComponent] = useState(null);
  useEffect(() => {
    getAllResults();
  }, []); // call component did mount

  // get the results from database, and create the page
  const getAllResults = async () => {
    // get all the saved ones
    let query = `SELECT * FROM "CompletedQuestions" WHERE 
    qualification ="${qualification}" AND subject="${subject}"`;
    let response = await ExecuteQuery(query, []);
    console.log('selection response: ', response.rows);
    let allQuizzes = response.rows;

    // write the header
    let mixedQuizzesHeader = (
      <View style={styles.quizHeadingContainer}>
        <Text style={styles.quizHeading}>Mixed</Text>
      </View>
    );
    let categoryQuizzesHeader = (
      <View style={styles.quizHeadingContainer}>
        <Text style={styles.quizHeading}>Category</Text>
      </View>
    );
    let yearQuizzesHeader = (
      <View style={styles.quizHeadingContainer}>
        <Text style={styles.quizHeading}>Yearwise</Text>
      </View>
    );

    // create the bodies of each
    let mixedBody = [];
    let categoryBody = [];
    let yearBody = [];

    // insert the quiz in the right body
    for (let i = 0; i < allQuizzes.length; i++) {
      let quiz = allQuizzes.item(i);
      // decide which type the quiz is
      if (quiz.quiz_type === 'Mixed') {
        let testname = `Quiz ${mixedBody.length + 1}`;
        mixedBody.push(
          <QuizResult
            key={i}
            ind={i}
            testName={testname}
            quiz={quiz}
            navigation={navigation}
          />,
        );
      } else if (quiz.quiz_type === 'Category') {
        let testname = `Quiz ${categoryBody.length + 1}`;
        categoryBody.push(
          <QuizResult
            key={i}
            testName={testname}
            quiz={quiz}
            navigation={navigation}
          />,
        );
      } else if (quiz.quiz_type === 'Year') {
        let testname = `${quiz.year}`;

        yearBody.push(
          <QuizResult
            key={i}
            ind={i}
            testName={testname}
            quiz={quiz}
            navigation={navigation}
          />,
        );
      }
    }

    // create the page
    setPageComponent(
      <SafeAreaView>
        <ScrollView>
          <View>
            {mixedQuizzesHeader}
            {mixedBody}
          </View>
          <View>
            {categoryQuizzesHeader}
            {categoryBody}
          </View>
          <View>
            {yearQuizzesHeader}
            {yearBody}
          </View>
        </ScrollView>
      </SafeAreaView>,
    );
  };

  // return the page page component when loaded
  return pageComponent;
};
const styles = StyleSheet.create({
  quizResultContainer: {
    backgroundColor: '#889BE7',
    margin: 20,
  },
  quizResult: {
    fontSize: 24,
  },
  quizHeadingContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  quizHeading: {
    fontSize: 28,
  },
});
export default Progress;
