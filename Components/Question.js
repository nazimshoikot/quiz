import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {Card, CheckBox} from 'react-native-elements';

class Question extends Component {
  constructor() {
    super();
  }

  render() {
    let q = this.props.ques;
    return (
      <Card title={q.Question} key={this.props.ind}>
        <CheckBox title={q.A} checked={true} />
        <CheckBox title={q.B} checked={true} />
        <CheckBox title={q.C} checked={false} />
        <CheckBox title={q.D} checked={true} />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  navButton: {
    width: 100,
    margin: 10,
  },
});

export default Question;
