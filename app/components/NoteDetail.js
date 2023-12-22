//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import colors from '../misc/colors';
import { useState } from 'react';
import { useNotes } from '../contexts/NoteProvider';
import { useHeaderHeight } from '@react-navigation/elements';
import RoundIconBtn from './RoundIconBtn';
import NoteInputModal from './NoteInputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';


const formatDate = ms => {
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let hrs = date.getHours();
  const min = date.getMinutes();

  let period = 'AM'; 
  if (hrs >= 12) {
      period = 'PM';
      if (hrs > 12) {
          hrs -= 12;
      }
  }
  return `${month}/${day}/${year} - ${hrs}:${min} ${period}`;
};
  
  const NoteDetail = props => {
    const [note, setNote] = useState(props.route.params.note);
    const headerHeight = useHeaderHeight();
    const { setNotes } = useNotes();
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
  
    const deleteNote = async () => {
      const result = await AsyncStorage.getItem('notes');
      let notes = [];
      if (result !== null) notes = JSON.parse(result);
  
      const newNotes = notes.filter(n => n.id !== note.id);
      setNotes(newNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      props.navigation.goBack();
    };
  
    const displayDeleteAlert = () => {
      Alert.alert(
        'Are You Sure!',
        'This action will delete your note permanently!',
        [
          {
            text: 'Delete',
            onPress: deleteNote,
          },
          {
            text: 'No Thanks',
            onPress: () => console.log('no thanks'),
          },
        ],
        {
          cancelable: true,
        }
      );
    };
  
    const handleUpdate = async (title, desc, time) => {
      const result = await AsyncStorage.getItem('notes');
      let notes = [];
      if (result !== null) notes = JSON.parse(result);
  
      const newNotes = notes.filter(n => {
        if (n.id === note.id) {
          n.title = title;
          n.desc = desc;
          n.isUpdated = true;
          n.time = time;
  
          setNote(n);
        }
        return n;
      });
  
      setNotes(newNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    };
    const handleOnClose = () => setShowModal(false);
    const openEditModal = () => {
      setIsEdit(true);
      setShowModal(true);
    };


    return (
        <>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}
      >
        <Text style={styles.time}>
          {note.isUpdated
            ? `Updated At ${formatDate(note.time)}`
            : `Created At ${formatDate(note.time)}`}
        </Text>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.desc}>{note.desc}</Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName='delete'
          style={{ backgroundColor: colors.error, marginBottom: 15 }}
          onPress={displayDeleteAlert}
        />
        <RoundIconBtn antIconName='edit' onPress={openEditModal} />
      </View>
      <NoteInputModal
        isEdit={isEdit}
        note={note}
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
      />
    </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
         flex: 1,
        paddingHorizontal: 15,
      },
      title: {
        fontSize: 30,
        color: colors.primary,
        fontWeight: 'bold',
        paddingTop: 20
        
      },
      desc: {
        fontSize: 20,
        opacity: 0.6,
      },
      time: {
        textAlign: 'right',
        fontSize: 12,
        opacity: 0.5,
        color: colors.primary,
      },
      btnContainer: {
        position: 'absolute',
        right: 15,
        bottom: 50,
      },
});

//make this component available to the app
export default NoteDetail;
