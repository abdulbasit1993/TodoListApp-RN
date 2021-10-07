import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import auth from '@react-native-firebase/auth';

import ImageUploadForm from './screens/ImageUploadForm';
import Todos from './screens/Todos';
import Login from './screens/Login';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <DrawerItem label="Sign Out" onPress={() => auth().signOut()} />
    </DrawerContentScrollView>
  );
}

const DrawerNav = createDrawerNavigator();
const AuthStack = createNativeStackNavigator();

const AuthScreens = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
};

const DrawerScreens = () => {
  return (
    <DrawerNav.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <DrawerNav.Screen
        name="Todos"
        component={Todos}
        options={{
          headerTitle: 'Todos List',
          headerTintColor: '#fff',
          headerStyle: {backgroundColor: '#6100ED'},
        }}
      />
      <DrawerNav.Screen
        name="ImageUploadForm"
        component={ImageUploadForm}
        options={{
          headerTitle: 'Add a New Todo',
          headerTintColor: '#fff',
          headerStyle: {backgroundColor: '#6100ED'},
        }}
      />
    </DrawerNav.Navigator>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (auth().currentUser) {
      setIsAuthenticated(true);
    }
    auth().onAuthStateChanged(user => {
      console.log('Checking auth state...');
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <DrawerScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
};

export default App;
