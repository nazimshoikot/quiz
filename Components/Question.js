import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {Card, CheckBox} from 'react-native-elements';

class Question extends Component {
  constructor() {
    super();
    this.state = {
      // check boxes
      checkA: false,
      checkB: false,
      checkC: false,
      checkD: false,
    };

    // bind the functions
    this.changeA = this.changeA.bind(this);
    this.changeB = this.changeB.bind(this);
    this.changeC = this.changeC.bind(this);
    this.changeD = this.changeD.bind(this);
  }

  // handle the check boxes toggling
  changeA() {
    if (this.state.checkA) {
      this.props.recordAnswer(this.props.ind, '');
    } else {
      this.props.recordAnswer(this.props.ind, 'A');
    }

    this.setState({
      checkA: !this.state.checkA,
      checkB: false,
      checkC: false,
      checkD: false,
    });
  }
  changeB() {
    if (this.state.checkB) {
      this.props.recordAnswer(this.props.ind, '');
    } else {
      this.props.recordAnswer(this.props.ind, 'B');
    }

    this.setState({
      checkB: !this.state.checkB,
      checkA: false,
      checkC: false,
      checkD: false,
    });
  }
  changeC() {
    if (this.state.checkC) {
      this.props.recordAnswer(this.props.ind, '');
    } else {
      this.props.recordAnswer(this.props.ind, 'C');
    }
    this.setState({
      checkC: !this.state.checkC,
      checkB: false,
      checkA: false,
      checkD: false,
    });
  }
  changeD() {
    if (this.state.checkD) {
      this.props.recordAnswer(this.props.ind, '');
    } else {
      this.props.recordAnswer(this.props.ind, 'D');
    }
    this.setState({
      checkD: !this.state.checkD,
      checkB: false,
      checkC: false,
      checkA: false,
    });
  }
  render() {
    let q = this.props.ques;

    // decide whether hidden or not
    let cardBody = (
      <View>
        <CheckBox
          onPress={this.changeA}
          title={q.A}
          checked={this.state.checkA}
        />
        <CheckBox
          onPress={this.changeB}
          title={q.B}
          checked={this.state.checkB}
        />
        <CheckBox
          onPress={this.changeC}
          title={q.C}
          checked={this.state.checkC}
        />
        <CheckBox
          onPress={this.changeD}
          title={q.D}
          checked={this.state.checkD}
        />
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
});

export default Question;
