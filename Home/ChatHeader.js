import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '../Config';
const database = firebase.database();
const ChatHeader = ({ user }) => {
    const ref_profils = database.ref("profils");
    const [isOnline, setIsOnline] = useState(user.isOnline);
    const [currentitem,setCurrentitem] = useState({})

    useEffect(() => {
        ref_profils.on("value", (snapshot) => {
          snapshot.forEach((un_profil) => {
            if(un_profil.val().id ==user.id)
              setCurrentitem(un_profil.val())
          });
        });
        return () => {
          ref_profils.off();
        };
      }, [currentitem]);
  useEffect(() => {
    setIsOnline(currentitem.isOnline);
  }, [currentitem.isOnline]);
  return (
    <View style={styles.profileItem}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity >
          <Image
            source={{ uri: user.url }}
            style={styles.profileImage}
          />
          {isOnline  && (
            <View style={styles.onlineIndicator} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Text>{`${user.nom} ${user.prenom}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ChatHeader;
