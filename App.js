import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ImageUploadForm from './screens/ImageUploadForm';
import Todos from './screens/Todos';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Todos"
          component={Todos}
          options={{headerShown: false}}
        />
        <Stack.Screen
          options={{
            headerTitle: 'Add A New Todo',
            headerTintColor: 'white',
            headerStyle: {backgroundColor: '#6100ED'},
          }}
          name="ImageUploadForm"
          component={ImageUploadForm}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
