import 'react-native-gesture-handler';
import React, {Component} from 'react';
// import {View, StatusBar, StyleSheet, ImageBackground, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './Components/Home.js';
import Practice from './Components/Practice.js';
import Mixed from './Components/Mixed.js';
import Category from './Components/Category.js';
import BoxScreen from './Components/new.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3E8DE5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
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
