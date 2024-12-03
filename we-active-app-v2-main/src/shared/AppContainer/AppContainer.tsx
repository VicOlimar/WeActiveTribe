import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import RegisterScreen from '../../views/Register';
import LoginScreen from '../../views/Login';
import RecoverPasswordScreen from '../../views/RecoverPassword';
import {UserContext} from '../../contexts/UserContext';

import {NavigationContainer} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RecoverPassword: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
};

const AppContainer = () => {
  const {authState} = useContext(UserContext);
  const isSignedIn = authState.user !== undefined;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen name="App" component={TabScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="RecoverPassword"
              component={RecoverPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
