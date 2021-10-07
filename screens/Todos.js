import React, {useState, useEffect} from 'react';
import {FlatList, View, Text, ActivityIndicator} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {TextInput, Button} from 'react-native-paper';

import Todo from '../components/Todo';

function Todos({navigation}) {
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  const ref = firestore().collection('todos');

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, complete, imageURL} = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
          imageURL,
        });
      });

      setTodos(list);
      // console.log('List: ', list);

      if (loading) {
        return <ActivityIndicator size="large" />; // or a spinner
      }
    });
  }, []);

  return (
    <>
      {!todos.length ? (
        <Text style={{flex: 1, fontSize: 18, padding: 10, color: 'gray'}}>
          There are no Todo Items!
        </Text>
      ) : (
        <FlatList
          style={{flex: 1}}
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({item}) => <Todo {...item} />}
        />
      )}

      {/* <TextInput label={'Enter New Todo'} value={todo} onChangeText={setTodo} /> */}
      <Button onPress={() => navigation.navigate('ImageUploadForm')}>
        Add New Todo
      </Button>
    </>
  );
}

export default Todos;
