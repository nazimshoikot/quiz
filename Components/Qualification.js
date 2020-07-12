import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  //   const [selectedId, setSelectedId] = useState(null);
  // define options button
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
    // const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    let tmp = {qualification: item};
    return (
      <Item
        item={item}
        onPress={() => navigateTo(navigation, 'Subject', tmp)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
});

export default Qualification;
