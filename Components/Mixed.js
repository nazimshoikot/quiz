import React, {Component} from 'react';

import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';

import {Card} from 'react-native-elements';

import Question from './Question';
import ResultQuestion from './ResultQuestion';
import {ExecuteQuery} from './utils.js';

import Icon from 'react-native-vector-icons/AntDesign';
import {Button} from 'react-native-elements';
import MixedResult from './MixedResult';

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
    this.getRandomQuestions();
  }

  getRandomQuestions = async () => {
    let qualification = this.props.route.params.qualification.name;
    let subject = this.props.route.params.sub.name;
    let query = `SELECT * FROM Questions WHERE Qualification='${qualification}' 
    AND Subject='${subject}' ORDER BY RANDOM()`;
    let response = await ExecuteQuery(query, []);
    let rows = response.rows;
    console.log(response.rows);

    // create new objects for each question
    let numQuestions = 5; // number of questions in quiz
    let quizArr = [];
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

      if (!quizArr.includes(newQuestion)) {
        quizArr.push(newQuestion);
      }

      if (quizArr.length >= numQuestions) {
        break;
      }
    }

    this.setState({
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
    return (
      <View>
        <ScrollView>
          <View>{questions}</View>
          <View>
            <Button title="Submit" onPress={this.submitAnswers} />
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
});

export default Mixed;
