import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View ,TextInput, Button, TouchableOpacity} from 'react-native';
import {useRef, useState} from 'react';
import firebase from '../Config';
export default function NewUser(props) {
const [email ,setmail] = useState ("");
const [password ,setPwd] = useState ("");
const [confirmpwd ,setConfPwd] = useState ("");
const refinput2 = useRef ();
const auth =firebase.auth();
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
      height : 350,
    }}
    
    >
      <Text style ={{
        color : "white",
        fontSize : 32,fontWeight:"bold"}}>
      New User
      </Text>
      <TextInput
      onSubmitEditing={()=>{refinput2.current.focus();}}
      blurOnSubmit = {false}
      onChangeText={(text)=>setmail(text)}
    style={styles.input}
    placeholder="Email"
    keyboardType='email-address'

      ></TextInput>

          <TextInput
          ref = {refinput2}
          onChangeText={(text)=>setPwd(text)}
    style={styles.input}
    placeholder="Password"
    keyboardType='default'
    secureTextEntry={true}

      ></TextInput>
      <TextInput
          ref = {refinput2}
          onChangeText={(text)=>setConfPwd(text)}
    style={styles.input}
    placeholder="Confirm Password"
    keyboardType='default'
    secureTextEntry={true}

      ></TextInput>
      <View style={{ flexDirection: 'row' }}>
      <Button
      onPress  = {()=> {
        if(password=== confirmpwd){
          auth
          .createUserWithEmailAndPassword(email,password)
          .then(()=>{
            props.navigation.navigate("auth")
          })
          .catch((err)=>{
            alert(err)
          })
        }
        else {alert("password invalide")}
      }}
      title='Submit'
      ></Button>
        <Button
      onPress  = {()=> {
        props.navigation.goBack();
      }}
      title='Cancel'
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

