import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../Config';
import { Button, Dialog } from 'react-native-paper';
const database = firebase.database();

export default function ListProfils(props) {
  const { currentid } = props.route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentitem,setCurrentitem] = useState({})
  const [dialogisvisible,setDialogIsVisible] = useState(false)
  const [itempressed,setItemPressed] = useState({})
  const ref_profils = database.ref("profils");

  useEffect(() => {
    ref_profils.on("value", (snapshot) => {
      var d = [];
      snapshot.forEach((un_profil) => {
        if(un_profil.val().id ==currentid)
          setCurrentitem(un_profil.val())
        else
        d.push(un_profil.val());
      });
      setData(d);
      setFilteredData(d);
    });
    return () => {
      ref_profils.off();
    };
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setFilteredData(data);
    const filtered = data.filter(
      (profile) =>
        profile.nom.toLowerCase().includes(text.toLowerCase()) ||
        profile.prenom.toLowerCase().includes(text.toLowerCase()) ||
        profile.numero.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSendMessage = (contact) => {
    props.navigation.navigate("chat",{currentitem,seconditem:itempressed})
    // Implement logic for sending a message
    console.log(`Sending message to ${contact.nom} ${contact.prenom}`);
  };

  const handleCall = (contact) => {
    // Implement logic for making a call
    console.log(`Calling ${contact.nom} ${contact.prenom} at ${contact.numero}`);
  };

  const renderProfile = ({ item }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={()=>{
          setDialogIsVisible(true)
          setItemPressed(item)}}>
        <Image
          source={{ uri: item.url}}
          style={styles.profileImage}
        />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Text>{`${item.nom} ${item.prenom}`}</Text>
        <Text>{`Numero: ${item.numero}`}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleCall(item)}>
          <Icon name="phone" size={20} color="#000000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSendMessage(item)}>
          <Icon name="envelope" size={20} color="#28a745" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search profiles..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProfile}
      />
      <Dialog visible={dialogisvisible}
      onDismiss={()=>{setDialogIsVisible(false)}}>
        <Dialog.Title>Detail du profil</Dialog.Title>
        <Dialog.Content>
          <Text>{itempressed.nom + itempressed.prenom}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button> Call </Button>
          <Button> SMS </Button>
          <Button onPress={()=>{setDialogIsVisible(false)}}> Cancel </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:30,
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImageContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5  },
  icon:{
    marginRight : 10,
  },
});