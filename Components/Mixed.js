import React, {Component} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

import {Card} from 'react-native-elements';

import Question from './Question';
import ResultQuestion from './ResultQuestion';

class Mixed extends Component {
  constructor() {
    super();
    this.state = {
      showResults: false,
      quizQuestions: [],

      // which feedback to show
      showOverallFeedback: false,
      showCategoryFeedback: false,
    };

    // bind functions
    this.recordAnswer = this.recordAnswer.bind(this);
    this.submitAnswers = this.submitAnswers.bind(this);
  }

  componentDidMount() {
    // get all the data
    const data = require('./../Data/Accounting - Cambridge.json');
    let allQues = [];
    // console.log("Data length: ", data.length)
    // put all the questions from the years into allQuestions
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].Questions.length; j++) {
        allQues.push(data[i].Questions[j]);
      }
    }
    const allQuestions = allQues;
    console.log('allquestions length: ', allQuestions.length);
    for (let i = 0; i < allQuestions.length; i++) {
      if (allQuestions[i].Guess !== '') {
        console.log('ERRRRORRRR');
        console.log(allQuestions[i]);
      }
    }

    // extract 10 random questions from all questions
    const numQuestions = 10;
    let quizArr = [];
    if (allQuestions.length !== 0) {
      for (let i = 0; i < allQuestions.length; i++) {
        let ind = Math.floor(Math.random() * allQuestions.length);
        // push the question into the arr
        // console.log("Item: ", allQuestions[ind])
        let q = allQuestions[ind];
        // create a new object
        let newQuestion = {
          Question: q.Question,
          A: q.A,
          B: q.B,
          C: q.C,
          D: q.D,
          Answer: q.Answer,
          Category: q.Category,
          Guess: q.Guess,
        };

        // console.log('Are the arrays same? ', newArr === allQuestions);

        if (!quizArr.includes(newQuestion)) {
          // make the body of the first card visible
          if (quizArr.length === 0) {
            newQuestion.ShowBody = true;
          }
          quizArr.push(newQuestion);
        }

        if (quizArr.length >= numQuestions) {
          break;
        }
      }
    }
    // console.log('quizArray:');
    // for (let i = 0; i < quizArr.length; i++) {
    //   console.log('Guess: ', quizArr[i].Guess);
    // }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      quizQuestions: quizArr,
    });
  }

  navigateTo = (page, parameters) => {
    this.props.navigation.navigate(page, parameters);
  };

  recordAnswer(index, guess) {
    // this.toggleShow(index);
    this.state.quizQuestions[index].Guess = guess;
  }

  submitAnswers() {
    // console.log('======================SUBMITTING==================');
    // for (let i = 0; i < this.state.quizQuestions.length; i++) {
    //   console.log(this.state.quizQuestions[i]);
    // }
    this.setState({
      showResults: true,
    });
  }

  toggleShowOverallFeedback = () => {
    this.setState({
      showOverallFeedback: !this.state.showOverallFeedback,
      showCategoryFeedback: false,
    });
  };

  toggleShowCategoryFeedback = () => {
    this.setState({
      showCategoryFeedback: !this.state.showCategoryFeedback,
      showOverallFeedback: false,
    });
  };

  render() {
    // const {subject} = this.props.route.params;

    // Prepare the quizzing platform
    // create array of question components
    let questions = this.state.quizQuestions.map((question, i) => {
      return (
        <Question
          ques={question}
          ind={i}
          key={i}
          recordAnswer={this.recordAnswer}
        />
      );
    });
    let quizPlatform = (
      <View>
        <ScrollView>
          <View>{questions}</View>
          <View>
            <Button title="Submit" onPress={this.submitAnswers} />
          </View>
        </ScrollView>
      </View>
    );

    // prepare the results platform (to show results when submit is clicked)
    console.log('Cheatsheet: ');
    for (let i = 0; i < this.state.quizQuestions.length; i++) {
      console.log('Answer: ', this.state.quizQuestions[i].Answer);
      console.log('Guess: ', this.state.quizQuestions[i].Guess);
    }
    // find the number of correct, incorrect, and unattempted
    let resultPlatform = [];
    if (this.state.showResults) {
      let correctCount = 0;
      let errorCount = 0;
      let unattemptedCount = 0;
      // category array
      let categoryArray = [];
      // create the category array and counts needed for formulating results
      for (let i = 0; i < this.state.quizQuestions.length; i++) {
        let question = this.state.quizQuestions[i];
        // checking if category already included
        // let arrayAlreadyContains = false;
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
      console.log('Category Array: ', categoryArray);

      // Give a general result
      let totalCount = correctCount + errorCount + unattemptedCount;
      let correctPercentage = (correctCount / totalCount) * 100;
      let correctPercentageStr = correctPercentage.toPrecision(4) + '%';

      // decide if the student did excellent, good, bad, or failed.
      let overallMessage = '';
      if (correctPercentage >= 90) {
        overallMessage = 'Excellent!';
      } else if (correctPercentage >= 75) {
        overallMessage = 'Good!';
      } else if (correctPercentage >= 50) {
        overallMessage = "Passed. Let's try one more.";
      } else {
        overallMessage = "Failed. Bruh you don't know shit.";
      }

      // let the students decide which type of feedback they want
      let resultSelectionButton = (
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.toggleShowCategoryFeedback}
              title="Category feedback"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.toggleShowOverallFeedback}
              title="Overall feedback"
            />
          </View>
        </View>
      );

      // ====================== OVERALL FEEDBACK =========================
      let resultQuestions = [];
      let categoryResults = [];
      if (this.state.showOverallFeedback) {
        // put the header
        resultQuestions.push(
          <View
            style={styles.feedbackTitleContainer}
            key={this.state.quizQuestions.length}
          >
            <Text style={styles.feedbackTitle}>Overall Feedback</Text>
          </View>,
        );
        // put all the questions in the feedback
        this.state.quizQuestions.map((question, i) => {
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
      } else if (this.state.showCategoryFeedback) {
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
          let categoryQuestions = categoryArray[j].Questions.map(
            (question, i) => {
              let tmp = <ResultQuestion ques={question} ind={i} key={i} />;
              return tmp;
            },
          );
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
      // ============================= CREATE THE RESULTS PLATFORM ==================
      resultPlatform = (
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
            </Card>
          </ScrollView>
        </View>
      );
    }

    // decide which platform to show to the user
    let platform = quizPlatform;
    if (this.state.showResults) {
      platform = resultPlatform;
    }
    // return the platform
    return platform;
  }
}

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
});

export default Mixed;
