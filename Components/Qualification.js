import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dataDetails from './../Data/AvailableDataDetails.json';

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View style={styles.cardContainer}>
      <Text style={styles.cardName}>{item.name}</Text>
    </View>
  </TouchableOpacity>
);

const showMenu = () => {
  // eslint-disable-next-line no-alert
  alert('Menu button pressed');
};

const navigateTo = (navigation, page, parameters) => {
  navigation.navigate(page, parameters);
};

const Qualification = ({navigation}) => {
  // define menu button
  let menuButton = (
    <TouchableOpacity onPress={showMenu}>
      <View>
        <Icon style={styles.menuIcon} name="menu" size={40} color="#fff" />
      </View>
    </TouchableOpacity>
  );
  navigation.setOptions({
    headerRight: () => menuButton,
  });

  const renderItem = ({item}) => {
    let tmp = {qualification: item};
    return (
      <Item
        item={item}
        onPress={() => navigateTo(navigation, 'Subject', tmp)}
      />
    );
  };
  // get the qualifications data from json file
  const data = dataDetails.qualifications;
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        onPress={() => navigateTo(navigation, 'Progress', {})}
        title="Progress"
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardName: {
    fontSize: 24,
  },
  cardContainer: {
    backgroundColor: '#889BE7',
    padding: 20,
  },
});

export default Qualification;
