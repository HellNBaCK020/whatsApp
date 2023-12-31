import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import ListProfils from '../Home/ListProfils';
import Groupe from '../Home/Groupe';
import MyAccount from '../Home/MyAccount';
import { AppState } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../Config';
const database = firebase.database();
const Tab = createMaterialBottomTabNavigator();
export default function Home(props) {
    const ref_profils = database.ref("profils");
    const { currentid } = props.route.params;
    const [appState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
          if (appState.match(/inactive|background/) && nextAppState === 'active') {
            ref_profils.child("profil" + currentid).update({
                isOnline:true,
              })
          } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
            ref_profils.child("profil" + currentid).update({
                isOnline:false,
              })
          }
    
          setAppState(nextAppState);
        };
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
          appStateSubscription.remove();
        };
      }, [appState]);
return(
<Tab.Navigator screenOptions={{headerShown : false }}>
    <Tab.Screen initialParams={{currentid}} name ="Contacts" component={ListProfils}options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={30} color={color} />
          ),
        }}></Tab.Screen>
    <Tab.Screen initialParams={{currentid}} name ="Group Chat" component={Groupe}options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="comments" size={30} color={color} />
          ),
        }}></Tab.Screen>
    <Tab.Screen initialParams={{currentid}} name ="My Account" component={MyAccount}options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={30} color={color} />
          ),
        }}></Tab.Screen>
</Tab.Navigator>
)};

