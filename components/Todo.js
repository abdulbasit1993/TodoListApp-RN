import React from 'react';
import firestore from '@react-native-firebase/firestore';
import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {List} from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

function Todo({id, title, complete, imageURL}) {
  async function toggleComplete() {
    await firestore().collection('todos').doc(id).update({
      complete: !complete,
    });
  }

  const deleteItem = () => {
    firestore()
      .collection('todos')
      .doc(id)
      .delete()
      .then(() => {
        console.log(`Removed item: ${id}`);
      });
  };

  return (
    <List.Item
      title={title}
      onPress={() => toggleComplete()}
      left={props => (
        <>
          <TouchableOpacity
            onPress={() => deleteItem()}
            style={{marginTop: 30, marginLeft: 8}}>
            <FontAwesome5Icon name="trash" size={18} />
          </TouchableOpacity>
          <List.Icon
            {...props}
            icon={complete ? 'check' : 'cancel'}
            style={{alignItems: 'center', marginTop: 20}}
          />
        </>
      )}
      right={props => (
        <Image source={{uri: imageURL}} style={styles.imageStyle} />
      )}
    />
  );
}

export default React.memo(Todo);

const styles = StyleSheet.create({
  imageStyle: {
    width: 80,
    height: 80,
    alignItems: 'center',
  },
});
