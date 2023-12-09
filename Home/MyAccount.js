import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { ImageBackground, StyleSheet, Text, View ,TextInput, Button,Image, TouchableOpacity} from 'react-native';
import {useRef, useState} from 'react';
import React from 'react'
import firebase from '../Config';
export default function MyAccount(props) {
const [nom ,setNom] = useState ("");
const [prenom ,setPrenom] = useState ("");
const [numero ,setNumero] = useState ("");
const [isDefault ,setIsDefault] = useState (true);
const [urllocal ,setUrl] = useState ();
const currentid = props.route.params.currentid
const database = firebase.database();
const storage = firebase.storage();

const refinput2 = useRef ();
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    setIsDefault(false);
    setUrl(result.assets[0].uri);
  }
};
const imageToBlob = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob"; 
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  return blob;
};

const uploadLocalImageToStorage = async(url) => {
  const blob = await imageToBlob(url);

  const ref_lesImages = storage.ref("lesimages");
  const ref_uneimage = ref_lesImages.child("uneimage.jpg"+ currentid);
  await ref_uneimage.put(blob);
  const link = await ref_uneimage.getDownloadURL(); 
  return link
}
    return (
        <View style={styles.container}>
         <StatusBar style ="light" ></StatusBar>
         <View style = {{height : 50 , width : "100%", backgroundColor: "#800040"}}></View>
         <ImageBackground
        style = {{
          alignItems : 'center',
          justifyContent: 'center',
          flex : 1,
          height:"100%" , width:"100%"}} 
        source={require ("../assets/sea.jpg")}  >
    <View 
        style = {{
          alignItems:'center',
          justifyContent:'flex-start',
          borderRadius : 8,
          backgroundColor : "#0005",
          width : "85%",
          height : 480,
    
        }}
        
        >
          <Text style ={{
            color : "white",
            fontSize : 32,fontWeight:"bold"}}>
          Profil
          </Text>
          <TouchableOpacity onPress={pickImage} style={{ width: '40%', aspectRatio: 1 }}>
          <Image
             style={{
            flex: 1,
            width: '100%',
             borderRadius: 8, 
                 }}
            source={
              isDefault?
              require('../assets/profile.png'):{uri:urllocal}}
          />
          </TouchableOpacity>
          <TextInput
          onSubmitEditing={()=>{refinput2.current.focus();}}
          blurOnSubmit = {false}
          onChangeText={(text)=>setNom(text)}
        style={styles.input}
        placeholder="Nom"
        keyboardType='email-address'
    
          ></TextInput>
    
              <TextInput
              ref = {refinput2}
              onChangeText={(text)=>setPrenom(text)}
        style={styles.input}
        placeholder="Prenom"
        keyboardType='default'
    
          ></TextInput>
        <TextInput
              ref = {refinput2}
              onChangeText={(text)=>setNumero(text)}
        style={styles.input}
        placeholder="Numero"
        keyboardType='default'

    
          ></TextInput>
          <View style={{ flexDirection: 'row' }}>
          <Button
          onPress  = {async () => {
            var link =""
            if(urllocal){
               link = await uploadLocalImageToStorage(urllocal)
            }
              const refProfils = database.ref('profils');
              const refUnProfil = refProfils.child("profil" + currentid);
              await refUnProfil.set({
                id:currentid,
                nom: nom,
                prenom: prenom,
                numero: numero,
                url:link,
              });
              alert("Saved !!")
              props.navigation.navigate("listprofil")
            }}
          title='Save'
          ></Button>
          </View>
        <TouchableOpacity
        style = {{
          width : "100%",
          alignItems : 'flex-end',  
          paddingRight : 10  }}
        >  
          </TouchableOpacity>
        </View>
        </ImageBackground>
        
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      input : {
        backgroundColor : "white",
        fontSize : 16,
        marginBottom : 5 , 
        marginTop : 15 , 
        height : 60,
        width : "90%",
        borderRadius : 8,
        textAlign : "center",
        
      }
    });
    
    
