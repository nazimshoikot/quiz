/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';

import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';

import {Card, Button} from 'react-native-elements';

import ResultQuestion from './ResultQuestion';
import {ExecuteQuery} from './utils.js';

import Icon from 'react-native-vector-icons/AntDesign';

const MixedResult = (props) => {
  let arr = props.arr;
  // console.log('ARR: ', props.arr);
  // declare state
  const [showOverallFeedback, setShowOverallFeedback] = useState(false);
  const [showCategoryFeedback, setShowCategoryFeedback] = useState(false);
  // toggles beetween the overall and category results
  const toggleShowOverallFeedback = () => {
    setShowOverallFeedback(!showOverallFeedback);
    setShowCategoryFeedback(false);
  };
  // toggles between the overall and category results
  const toggleShowCategoryFeedback = () => {
    setShowOverallFeedback(false);
    setShowCategoryFeedback(!showCategoryFeedback);
  };
  // saves the results in the database
  const saveMixedResults = async () => {
    // get the parameters
    // convert into string
    let questionStr = JSON.stringify(arr);

    // // delete the table if it exists
    // let qu = 'DROP TABLE IF EXISTS CompletedQuestions';
    // let r = await ExecuteQuery(qu, []);

    // create the table if it does not exist
    let query = `CREATE TABLE IF NOT EXISTS "CompletedQuestions" (
        "quiz_id" INTEGER NOT NULL,
        "quiz_questions" LONGTEXT NOT NULL,
        "quiz_type" TEXT NOT NULL,
        "qualification" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "year" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        PRIMARY KEY("quiz_id")
    )`;
    let response = await ExecuteQuery(query, []);
    let rows = response.rows;
    console.log("Checked with table creation")
    // insert the questions into the table
    query = `INSERT INTO "CompletedQuestions" (quiz_questions, quiz_type,
      qualification, subject, year, category) VALUES (?, ?, ?, ?, ?, ?)`;
    response = await ExecuteQuery(query, [
        questionStr,
        props.type,
        props.qualification,
        props.subject,
        props.year,
        "",
    ]);
    console.log("Inserting response: ", response.rows);

    query = 'SELECT * FROM "CompletedQuestions"';
    response = await ExecuteQuery(query,[]);
    console.log("selection response: ", response.rows);
  };

  // create the components needed for the results
  let correctCount = 0;
  let errorCount = 0;
  let unattemptedCount = 0;
  // category array
  let categoryArray = [];
  // create the category array and counts needed for formulating results
  for (let i = 0; i < arr.length; i++) {
    let question = arr[i];
    // checking if category already included
    let categoryIndex = -1;
    for (let j = 0; j < categoryArray.length; j++) {
      if (categoryArray[j].Category === question.Category) {
        categoryIndex = j;
        break;
      }
    }
    // if array does not already contain
    if (categoryIndex === -1) {
      // create a category object
      let tmp = {
        Category: question.Category,
        correctCount: 0,
        correctQuestions: [],
        incorrectCount: 0,
        incorrectQuestions: [],
        unattemptedCount: 0,
        unattemptedQuestions: [],
        Questions: [],
      };
      // push the category object
      categoryArray.push(tmp);
      categoryIndex = categoryArray.length - 1; // index of newly pushed category
    }
    // if category already exists
    if (categoryIndex >= 0) {
      // if unattempted
      if (typeof question.Guess === 'undefined' || question.Guess === '') {
        unattemptedCount++;
        // find the category and add the question results to that category
        if (categoryArray[categoryIndex].Category === question.Category) {
          categoryArray[categoryIndex].unattemptedCount++;
          categoryArray[categoryIndex].Questions.push(question);
        }
      } else if (question.Answer === question.Guess) {
        correctCount++;
        // find the category and add the question results to that category
        if (categoryArray[categoryIndex].Category === question.Category) {
          categoryArray[categoryIndex].correctCount++;
          categoryArray[categoryIndex].Questions.push(question);
        }
      } else {
        // find the category and add the question results to that category
        if (categoryArray[categoryIndex].Category === question.Category) {
          categoryArray[categoryIndex].incorrectCount++;
          categoryArray[categoryIndex].Questions.push(question);
        }
        errorCount++;
      }
    }
  }
  // console.log('Category Array in new: ', categoryArray);

  // Give a general result
  let totalCount = correctCount + errorCount + unattemptedCount;
  let correctPercentage = (correctCount / totalCount) * 100;
  let correctPercentageStr = correctPercentage.toPrecision(4) + '%';

  // decide if the student did excellent, good, bad, or failed.
  let overallMessage = '';
  if (correctPercentage >= 90) {
    overallMessage = 'Excellent! You aced the test!';
  } else if (correctPercentage >= 75) {
    overallMessage = 'Good! You got most of the questions right!';
  } else if (correctPercentage >= 50) {
    overallMessage = "Passed. Let's try one more!";
  } else {
    overallMessage = "Failed. Keep practising to get better!";
  }

  // let the students decide which type of feedback they want
  let resultSelectionButton = (
    <View style={styles.buttonsContainer}>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => toggleShowCategoryFeedback()}
          title="Category feedback"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => toggleShowOverallFeedback()}
          title="Overall feedback"
        />
      </View>
    </View>
  );

  // ====================== OVERALL FEEDBACK =========================
  let resultQuestions = [];
  let categoryResults = [];
  if (showOverallFeedback) {
    // put the header
    resultQuestions.push(
      <View style={styles.feedbackTitleContainer} key={arr.length}>
        <Text style={styles.feedbackTitle}>Overall Feedback</Text>
      </View>,
    );
    // put all the questions in the feedback
    arr.map((question, i) => {
      let tmp = (
        <ResultQuestion
          ques={question}
          ind={i}
          key={i}
          recordAnswer={this.recordAnswer}
        />
      );
      resultQuestions.push(tmp);
    });
  } else if (showCategoryFeedback) {
    // ======================== CATEGORY FEEDBACK ==========================
    // find the percecntage for the category
    for (let j = 0; j < categoryArray.length; j++) {
      // push the heading
      if (categoryResults.length === 0) {
        categoryResults.push(
          <View
            style={styles.feedbackTitleContainer}
            key={categoryArray.length}
          >
            <Text style={styles.feedbackTitle}>Category Feedback</Text>
          </View>,
        );
      }
      // create the category accuracy percentage
      let categoryTotalCount =
        categoryArray[j].correctCount +
        categoryArray[j].incorrectCount +
        categoryArray[j].unattemptedCount;
      let categoryCorrectPercentage =
        (categoryArray[j].correctCount / categoryTotalCount) * 100;
      let categoryCorrectPercentageStr =
        categoryCorrectPercentage.toPrecision(4) + '%';
      let msg =
        categoryArray[j].Category +
        '\n' +
        categoryTotalCount +
        ' Question(s), Score: ' +
        categoryCorrectPercentageStr;
      // put all the questions for the category
      let categoryQuestions = categoryArray[j].Questions.map((question, i) => {
        let tmp = <ResultQuestion ques={question} ind={i} key={i} />;
        return tmp;
      });
      // combine msg and questions
      let categoryComponent = (
        <View key={j}>
          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryTitle}>{msg}</Text>
          </View>
          {categoryQuestions}
        </View>
      );
      // push for each category
      categoryResults.push(categoryComponent);
    }
  }

  // create a button for saving the results
  let saveResultsButton = null;
  if (props.isSaved === false) {
    saveResultsButton = (
      <View style={styles.buttonsContainer}>
        <View>
          <Button
            icon={<Icon name="questioncircleo" size={25} color="black" />}
            iconRight
            title="Save results"
            onPress={() => saveMixedResults()}
          />
        </View>
      </View>
    );
  }

  // ============================= CREATE THE RESULTS PLATFORM ==================
  return (
    <View>
      <ScrollView>
        <Card title="Results">
          <Text>{overallMessage}</Text>
          <Text>You scored {correctPercentageStr} in the quiz!</Text>
          <Text>
            Correct: {correctCount}/{totalCount}{' '}
          </Text>
          <Text>
            incorrect: {errorCount}/{totalCount}
          </Text>
          <Text>Unattempted: {unattemptedCount}</Text>
          <View>{categoryResults}</View>
          <View>{resultQuestions}</View>
          <View>{resultSelectionButton}</View>
          <View>{saveResultsButton}</View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 300,
    margin: 10,
  },
  feedbackTitle: {
    fontSize: 28,
  },
  feedbackTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  categoryTitle: {
    fontSize: 20,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 5,
    backgroundColor: '#2EC670',
  },
  questionIcon: {
    margin: 5,
  },
});

export default MixedResult;