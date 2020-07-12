import 'react-native-gesture-handler';
import React, {Component} from 'react';
// import {View, StatusBar, StyleSheet, ImageBackground, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Subject from './Components/Subject.js';
import Practice from './Components/Practice.js';
import Mixed from './Components/Mixed.js';
import Category from './Components/Category.js';
import Qualification from './Components/Qualification.js';

const Stack = createStackNavigator();

const App = () => {
  // adding a new comment to make insignificant push
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#889BE7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Qualification" component={Qualification} />
          <Stack.Screen name="Subject" component={Subject} />
          <Stack.Screen name="Practice" component={Practice} />
          <Stack.Screen name="MixedPractice" component={Mixed} />
          <Stack.Screen name="CategoryPractice" component={Category} />

        </Stack.Navigator>
      </NavigationContainer>
      {/* <Home /> */}
      {/* <BoxScreen /> */}
    </>
  );
};

export default App;
