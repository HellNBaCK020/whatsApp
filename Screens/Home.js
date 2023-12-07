import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import ListProfils from '../Home/ListProfils';
import Groupe from '../Home/Groupe';
import MyAccount from '../Home/MyAccount';

const Tab = createMaterialBottomTabNavigator();
export default function Home(props) {
    const currentid = props.route.params.currentid
return(
<Tab.Navigator screenOptions={{headerShown : false }}>
    <Tab.Screen name ="listprofil" component={ListProfils}></Tab.Screen>
    <Tab.Screen name ="groupe" component={Groupe}></Tab.Screen>
    <Tab.Screen initialParams={{currentid}}name ="myaccount" component={MyAccount}></Tab.Screen>
</Tab.Navigator>
)};

