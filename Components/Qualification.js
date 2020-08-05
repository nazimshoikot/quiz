import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
<<<<<<< HEAD
  Icon,
} from 'react-native';

const DATA = [
  {
    name: 'Cambridge-IGCSE',
    id: '1',
  },
  {
    name: 'Edexcel-IGCSE',
    id: '2',
  },
];

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.cardName}>{item.name}</Text>
=======
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dataDetails from './../Data/AvailableDataDetails.json';

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <View style={styles.cardContainer}>
      <Text style={styles.cardName}>{item.name}</Text>
    </View>
>>>>>>> e1ce50ca6b97b109e6eb7d5d094a1f87eb6f863e
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
<<<<<<< HEAD
  //   const [selectedId, setSelectedId] = useState(null);
  // define options button
=======
  // define menu button
>>>>>>> e1ce50ca6b97b109e6eb7d5d094a1f87eb6f863e
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
<<<<<<< HEAD
  const renderItem = ({item}) => {
    // const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
=======

  const renderItem = ({item}) => {
>>>>>>> e1ce50ca6b97b109e6eb7d5d094a1f87eb6f863e
    let tmp = {qualification: item};
    return (
      <Item
        item={item}
        onPress={() => navigateTo(navigation, 'Subject', tmp)}
      />
    );
  };
<<<<<<< HEAD

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
=======
  // get the qualifications data from json file
  const data = dataDetails.qualifications;
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
>>>>>>> e1ce50ca6b97b109e6eb7d5d094a1f87eb6f863e
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

<<<<<<< HEAD
=======

>>>>>>> e1ce50ca6b97b109e6eb7d5d094a1f87eb6f863e
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
<<<<<<< HEAD
=======
  cardContainer: {
    backgroundColor: '#889BE7',
    padding: 20,
  },
>>>>>>> e1ce50ca6b97b109e6eb7d5d094a1f87eb6f863e
});

export default Qualification;
