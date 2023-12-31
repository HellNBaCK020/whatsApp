import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../Config';
import { Button, Dialog } from 'react-native-paper';
import { Linking } from 'react-native';
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
      ref_profils.child("profil" + currentid).update({
        isOnline:false,
      }) 
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

  const handleSendMessage = (item) => {
    setItemPressed(item)
    props.navigation.navigate("chat",{currentid,seconditem:item})
  };

  const handleCall = (contact) => {
    const phoneNumber = contact.numero;
      if (!phoneNumber) {
      console.log('Invalid phone number');
      return;
    }
      const phoneDialerUrl = `tel:${phoneNumber}`;
      Linking.canOpenURL(phoneDialerUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneDialerUrl);
        } else {
          console.log('Phone dialer not supported');
        }
      })
      .catch((error) => console.error('Error opening phone dialer', error));
  };

  const renderProfile = ({ item }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={() => {
          setDialogIsVisible(true);
          setItemPressed(item);
        }}>
          <Image
            source={{ uri: item.url }}
            style={styles.profileImage}
          />
          {item.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
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
      onDismiss={()=>{
        setDialogIsVisible(false)
        setItemPressed({})}}>
        <Dialog.Title>Detail du profil</Dialog.Title>
        <Dialog.Content>
          <Text>{itempressed.nom +" "+ itempressed.prenom}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button> Call </Button>
          <Button onPress={()=>{handleSendMessage(itempressed)}}> SMS </Button>
          <Button onPress={()=>{
            setDialogIsVisible(false)
            setItemPressed({})
            }}> Cancel </Button>
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
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
});