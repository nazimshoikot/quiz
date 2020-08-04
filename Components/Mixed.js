/* eslint-disable prettier/prettier */
import React, {Component} from 'react';

import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';


import Question from './Question';
import {ExecuteQuery} from './utils.js';

import {Button} from 'react-native-elements';
import MixedResult from './MixedResult';
import LoadingSign from './LoadingSign.js';

class Mixed extends Component {
  constructor() {
    super();
    this.state = {
      showResults: false,
      quizQuestions: [],

      // whether the page is loaded or not
      isLoaded: false,

      // which feedback to show
      showOverallFeedback: false,
      showCategoryFeedback: false,
    };

    // bind functions
    this.recordAnswer = this.recordAnswer.bind(this);
    this.submitAnswers = this.submitAnswers.bind(this);
  }

  componentDidMount() {
    this.getRandomQuestions();
  }

  alreadyCompleted = (completedArr, newQuestion) => {
    
    for (let i = 0; i < completedArr.length; i++) {
      if (completedArr[i].D === newQuestion.D) {
        if (completedArr[i].A === newQuestion.A) {
          if (completedArr[i].B === newQuestion.B) {
            if (completedArr[i].C === newQuestion.C) { 
              if (completedArr[i].Question === newQuestion.Question) {
                  // console.log("ALLLLREADYYYYY EXISTTTTTTTTTTTTTSSS")
                  // console.log(completedArr[i])
                  // console.log(newQuestion)
                  return true;
              }
            }
          }

        }
      }
    }
    return false;
  };

  // get the questions needed for the quiz
  getRandomQuestions = async () => {
    console.log("GETTTING RANDOM QUESTIONS....");
    let qualification = this.props.route.params.qualification.name;
    let subject = this.props.route.params.sub.name;
    let query = `SELECT * FROM Questions WHERE Qualification='${qualification}' 
    AND Subject='${subject}' ORDER BY RANDOM()`;
    let response = await ExecuteQuery(query, []);
    let rows = response.rows;
    console.log(response.rows);

    // get all the quizzes that have been done
    query = `SELECT quiz_questions FROM "CompletedQuestions" WHERE 
    qualification='${qualification}' AND subject='${subject}'
    AND quiz_type='Mixed'`;
    response = await ExecuteQuery(query, []);
    let completedRows = response.rows;
    // create an array of questions already completed
    let completedQuestions = [];
    for (let i = 0; i < completedRows.length; i++) {
      let quiz_questions = JSON.parse(completedRows.item(i).quiz_questions); // get the array
      for (let j = 0; j < quiz_questions.length; j++) {
        completedQuestions.push(quiz_questions[j]);
      }
    }
    console.log("Length of completed: ", completedQuestions.length);

    // create new objects for each question
    let numQuestions = 20; // number of questions in quiz
    let quizArr = [];
    console.log("Length of all: ", rows.length);
    // console.log("Comleted: ", completedQuestions);
    for (let i = 0; i < rows.length; i++) {
      let q = rows.item(i);
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
      // console.log("Question: ", newQuestion);
      if (!quizArr.includes(newQuestion) &&
            !this.alreadyCompleted(completedQuestions, newQuestion)) {
        quizArr.push(newQuestion);
      }

      if (quizArr.length >= numQuestions) {
        break;
      }
    }

    this.setState({
      isLoaded: true,
      quizQuestions: quizArr,
    });
  };

  navigateTo = (page, parameters) => {
    this.props.navigation.navigate(page, parameters);
  };

  recordAnswer(index, guess) {
    // this.toggleShow(index);
    this.state.quizQuestions[index].Guess = guess;
  }

  submitAnswers() {
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
  // prepares the quizzing platform
  getQuizzingPlatform = () => {
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
    
    // decide whether to show loading or submit
    let submitButton = <LoadingSign />;
    if (this.state.isLoaded) {
      // show the submit button 
      submitButton = (
        <Button title="Submit" onPress={this.submitAnswers} />
      );
    }

    // if no questions left to show
    if (questions.length === 0) {
      // dont show any submit buttton
      submitButton = (
        <View style={styles.oval}>
          <Button title="Check Progress" />
        </View>
      );

      // give him the message that all questions are done
      questions.push(
        <Text key={1}>
          All mixed questions from this qualification completed. Go to progress
          to see results or retry the quizzes. 
        </Text>
      );

    }

    return (
      <View>
        <ScrollView>
          <View>{questions}</View>
          <View>
            {submitButton}
          </View>
        </ScrollView>
      </View>
    );
  };
  // used for debugging. will delete later
  showCheatsheet = () => {
    console.log('Cheatsheet: ');
    for (let i = 0; i < this.state.quizQuestions.length; i++) {
      console.log('Answer: ', this.state.quizQuestions[i].Answer);
      console.log('Guess: ', this.state.quizQuestions[i].Guess);
    }
  };

  // prepares the results platform for the page
  getResultPlatform = () => {
    let qualification = this.props.route.params.qualification.name;
    let subject = this.props.route.params.sub.name;
    // find the number of correct, incorrect, and unattempted
    return (
      <MixedResult
        arr={this.state.quizQuestions}
        isSaved={false}
        qualification={qualification}
        subject={subject}
        type="Mixed"
        year=""
      />
    );
  };

  render() {
    // get the quizzing platform
    let quizPlatform = this.getQuizzingPlatform();
    // this.showCheatsheet();

    // decide which platform to show to the user
    let platform = quizPlatform;
    if (this.state.showResults) {
      // prepare the results platform (to show results when submit is clicked)
      let resultPlatform = this.getResultPlatform();
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
  questionIcon: {
    margin: 5,
  },
  oval: {
    borderRadius: 50,
    margin: 20,
    backgroundColor: "red",
  }
});

export default Mixed;
