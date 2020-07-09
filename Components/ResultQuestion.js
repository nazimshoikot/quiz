import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {Card, CheckBox} from 'react-native-elements';

class ResultQuestion extends Component {
  constructor() {
    super();
  }
  render() {
    let q = this.props.ques;
    let checkA = false;
    let checkB = false;
    let checkC = false;
    let checkD = false;

    console.log('Question: ', q);

    // set default background colors
    let AStyle = styles.normal;
    let BStyle = styles.normal;
    let CStyle = styles.normal;
    let DStyle = styles.normal;

    // mark if the guess is wrong
    if (q.Guess === 'A') {
      checkA = true;
      AStyle = styles.incorrectAnswer;
    } else if (q.Guess === 'B') {
      checkB = true;
      BStyle = styles.incorrectAnswer;
    } else if (q.Guess === 'C') {
      checkC = true;
      CStyle = styles.incorrectAnswer;
    } else if (q.Guess === 'D') {
      checkD = true;
      DStyle = styles.incorrectAnswer;
    }

    // mark the correct answer
    if (q.Answer === 'A') {
      AStyle = styles.correctAnswer;
    } else if (q.Answer === 'B') {
      BStyle = styles.correctAnswer;
    } else if (q.Answer === 'C') {
      CStyle = styles.correctAnswer;
    } else if (q.Answer === 'D') {
      DStyle = styles.correctAnswer;
    }

    let cardBody = (
      <View>
        <View style={AStyle}>
          <CheckBox title={q.A} checked={checkA} />
        </View>
        <View style={BStyle}>
          <CheckBox title={q.B} checked={checkB} />
        </View>
        <View style={CStyle}>
          <CheckBox title={q.C} checked={checkC} />
        </View>
        <View style={DStyle}>
          <CheckBox title={q.D} checked={checkD} />
        </View>
      </View>
    );
    return (
      <Card title={q.Question} key={this.props.ind}>
        {cardBody}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  navButton: {
    width: 100,
    margin: 10,
  },
  correctAnswer: {
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'green',
    margin: 1,
  },
  incorrectAnswer: {
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'red',
    margin: 1,
  },
  normal: {
    backgroundColor: 'transparent',
  },
});

export default ResultQuestion;
