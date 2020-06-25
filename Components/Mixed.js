import React, {Component} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';

import {Card} from 'react-native-elements';

import bg from './bg-image.png';
import Question from './Question';

// const bg = {uri: 'https://reactjs.org/logo-og.png'};

class Mixed extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
    };
  }

  navigateTo = (page, parameters) => {
    this.props.navigation.navigate(page, parameters);
  };

  componentDidMount = () => {
    // get the appropriate questions
    let data = require('./Accounting-IGCSE.json');
    this.setState({
      questions: data,
    });
  };

  render() {
    const {subject} = this.props.route.params;
    const numQuestions = 10;
    // select 20 random questions
    let quizArr = [];
    if (this.state.questions.length !== 0) {
      for (let i = 0; i < this.state.questions.length; i++) {
        let ind = Math.floor(Math.random() * this.state.questions.length);
        // push the question into the arr
        console.log('Index: ', ind);
        console.log(this.state.questions[ind]);
        quizArr.push(this.state.questions[ind]);

        if (quizArr.length >= numQuestions) {
          break;
        }
      }
    }
    // create array of question components
    let questions = quizArr.map((question, i) => {
      return <Question ques={question} ind={i} key={i} />;
    });

    return (
      <View>
        <ScrollView>
          <View>{questions}</View>
        </ScrollView>
      </View>
    );
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
