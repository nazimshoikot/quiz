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

class Mixed extends Component {
  constructor() {
    super();
    this.state = {
      showResults: false,
      quizQuestions: [],
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
    const numQuestions = 5;
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

  render() {
    // const {subject} = this.props.route.params;
    // const numQuestions = 10;

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

    // find the number of correct, incorrect, and unattempted
    let resultPlatform = [];
    // if (this.state.showResults) {
    let correctCount = 0;
    let errorCount = 0;
    let unattemptedCount = 0;
    console.log('RENDER:');
    for (let i = 0; i < this.state.quizQuestions.length; i++) {
      let question = this.state.quizQuestions[i];
      // console.log('Logging answers: ');
      // console.log('Actual answer: ', question.Answer);
      console.log('Guess: ', question.Guess);
      console.log('Actual answer: ', question.Answer);
      // console.log("Guess: ", typeof(question.Guess));
      if (typeof question.Guess === 'undefined' || question.Guess === '') {
        // console.log('Conclusion: Unattempted');
        unattemptedCount++;
      } else if (question.Answer === question.Guess) {
        // console.log('Conclusion: Correct');
        correctCount++;
      } else {
        // console.log('Conclusion: Incorrect');
        errorCount++;
      }
    }

    resultPlatform = (
      <View>
        <ScrollView>
          <Card title="Results">
            <Text>Correct: {correctCount}</Text>
            <Text>incorrect: {errorCount}</Text>
            <Text>Unattempted: {unattemptedCount}</Text>
          </Card>
        </ScrollView>
      </View>
    );
    // }

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
  navButton: {
    width: 100,
    margin: 10,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 100,
    margin: 10,
  },
});

export default Mixed;
