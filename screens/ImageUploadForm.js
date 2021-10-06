import React, {useState, useEffect} from 'react';

import {Formik} from 'formik';

import firestore from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';

import ImagePicker from 'react-native-image-crop-picker';

import Todo from '../components/Todo';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

const ImageUploadForm = ({navigation}) => {
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const ref = firestore().collection('todos');

  const openFromGallery = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = image.path;
      setImage(imageUri);
      console.log('image --> ', imageUri);
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = image.path;
      setImage(imageUri);
      console.log('image --> ', imageUri);
    });
  };

  const handleSubmit = async () => {
    // handle submit form functions

    if (image == null) {
      alert('Image is required!');
      return;
    } else if (todo == '') {
      alert('Please enter something!');
      return;
    } else {
      console.log('image path: ', image);

      // Function to Upload image to Firebase Storage

      const uploadUri = image;

      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

      setUploading(true);
      setTransferred(0);

      const task = storage().ref(filename).putFile(uploadUri);

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );

        setTransferred(
          Math.round(
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
          ),
        );
      });

      try {
        await task;

        setUploading(false);
        Alert.alert(
          'Image Uploaded!',
          'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
        );
      } catch (e) {
        console.log(e);
      }

      const imageDownloadURL = await storage().ref(filename).getDownloadURL();
      console.log('Image Download URL: ', imageDownloadURL);
      setImage(null);

      // Function to Add Todo Item to Firestore Database
      try {
        await ref.add({
          title: todo,
          complete: false,
          imageURL: imageDownloadURL,
        });
        setTodo('');
        navigation.navigate('Todos');
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Formik onSubmit={() => handleSubmit()}>
      <View>
        <View style={{flexDirection: 'column'}}>
          <TextInput
            placeholder="Enter New Todo"
            value={todo}
            onChangeText={setTodo}
            style={styles.todoInputBox}
          />
          <Text style={{marginLeft: 10}}>Image Selected:</Text>

          {image ? (
            <Image source={{uri: image}} style={styles.imageStyle} />
          ) : (
            <Image
              source={require('../assets/placeholder.png')}
              style={styles.imageStyle}
            />
          )}

          <View style={{flexDirection: 'row', marginBottom: 25}}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                backgroundColor: '#04b040',
                borderRadius: 15,
                paddingHorizontal: 13,
                paddingVertical: 10,
                alignItems: 'center',
                shadowColor: '#E67E22',
                shadowOpacity: 0.8,
                elevation: 8,
                marginRight: 3,
                marginLeft: 10,
              }}
              onPress={() => openFromGallery()}>
              <Text style={{color: 'white'}}>Open Image from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                backgroundColor: '#04b040',
                borderRadius: 15,
                paddingHorizontal: 13,
                paddingVertical: 10,
                alignItems: 'center',
                shadowColor: '#E67E22',
                shadowOpacity: 0.8,
                elevation: 8,
              }}
              onPress={() => openCamera()}>
              <Text style={{color: 'white'}}>Take Image from Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Button title="Add Item" onPress={handleSubmit} /> */}
        {uploading ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Button title="Add Item" onPress={handleSubmit} />
        )}
      </View>
    </Formik>
  );
};

export default ImageUploadForm;

const styles = StyleSheet.create({
  imageStyle: {
    borderColor: 'red',
    borderWidth: 2,
    width: 100,
    height: 100,
    marginLeft: 10,
    marginBottom: 25,
  },
  todoInputBox: {
    borderColor: '#000000',
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 15,
    marginBottom: 10,
  },
});
