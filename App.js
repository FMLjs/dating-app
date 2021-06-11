import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import Login from './components/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Registration from './components/Registration';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';
import Search from './components/Search';
import RNLocation from 'react-native-location';
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import Gallery from './components/Gallery';

import firestore from '@react-native-firebase/firestore';
import usersData from './data.json';
import Chats from './components/Chats';
import Match from './components/Match';

RNLocation.configure({
  distanceFilter: 2000,
  androidProvider: "auto",
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
})


const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;


  RNLocation.requestPermission({
    ios: "whenInUse",
    android: {
      detail: "coarse"
    }
  })

  return (
    <Provider store={configureStore}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={!user ? 'Login' : 'Home'}
          screenOptions={{
            cardStyle: { backgroundColor: '#C1ECFF' }
          }}
        >
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
          <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name='ProfileEdit' component={ProfileEdit} options={{ headerShown: false }} />
          <Stack.Screen name='Registration' component={Registration} options={{ headerShown: false }} />
          <Stack.Screen name='Gallery' component={Gallery} options={{ headerShown: false }} />
          <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
          <Stack.Screen name='Chats' component={Chats} options={{ headerShown: false }} />
          <Stack.Screen name='Match' component={Match} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer >
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  containter: {
    backgroundColor: '#9DD5FC',
    flex: 1
  }
})