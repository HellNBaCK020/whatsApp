import Authentification from "./Screens/Auth"
import NewUser from "./Screens/NewUser";
import Home from "./Screens/Home";
import Chat from "./Home/Chat";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App ()
{
  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown : false }}>
      <Stack.Screen name = "auth" component={Authentification}></Stack.Screen>
      <Stack.Screen name = "home" component={Home}></Stack.Screen>
      <Stack.Screen name = "newuser" component={NewUser}></Stack.Screen>
      <Stack.Screen name ="chat" component={Chat}></Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

