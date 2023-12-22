//import liraries
import React, { Component, useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import colors from '../misc/colors';
import SearchBar from '../components/SearchBar';
import RoundIconBtn from '../components/RoundIconBtn';
import NoteInputModal from '../components/NoteInputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from '../components/Note';
import { useNotes } from '../contexts/NoteProvider';
import NotFound from '../components/NotFound';



// create a component

const reverseData = data => {
    return data.sort((a, b) => {
      const aInt = parseInt(a.time);
      const bInt = parseInt(b.time);
      if (aInt < bInt) return 1;
      if (aInt == bInt) return 0;
      if (aInt > bInt) return -1;
    });
  };

const NoteScreen = ({user, navigation}) => {
    const[greet, setGreet] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [resultNotFound, setResultNotFound] = useState(false);
    const {notes, setNotes, findNotes} = useNotes();
    
    const findGreet = () => {
        const hrs = new Date().getHours()
        if(hrs === 0 || hrs < 12) return setGreet('Morning!🌞');
        if(hrs === 1 || hrs <17) return setGreet('Afternoon!🌥️');
        setGreet('Evening!🌙');
    };


    useEffect( () => {
        findGreet();
    }, []);

    const reverseNotes = reverseData(notes);

    const handleOnSubmit = async (title, desc) => {   
        const note = { id: Date.now(), title, desc, time: Date.now() };
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
        
      };
    
      const openNote = note => {
        navigation.navigate('NoteDetail', { note });
      };

      const handleOnSearchInput = async text => {
        setSearchQuery(text);
        if (!text.trim()) {
          setSearchQuery('');
          setResultNotFound(false);
          return await findNotes();
        }
        const filteredNotes = notes.filter(note => {
          if (note.title.toLowerCase().includes(text.toLowerCase())) {
            return note;
          }
        });
    
        if (filteredNotes.length) {
          setNotes([...filteredNotes]);
        } else {
          setResultNotFound(true);
        }
      };
    
      const handleOnClear = async () => {
        setSearchQuery('');
        setResultNotFound(false);
        await findNotes();
      };

    return (
        <>
        
        <StatusBar 
            barStyle='dark-content' 
            backgroundColor={colors.light} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <View style={styles.container}>
            <Text style={styles.header}>{`Hi, ${user.name}! Good ${greet}`}</Text>
            
            {notes.length ? 
            <SearchBar
              value={searchQuery}
              onChangeText={handleOnSearchInput}
              containerStyle={{ marginVertical: 15 }}
              onClear={handleOnClear}
            /> : null}

            {resultNotFound ? (
            <NotFound />
          ) : (
            <FlatList
                data={reverseNotes}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    marginBottom: 15,
                }}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                <Note onPress={() => openNote(item)} item={item} />
              )}
            />
          )}
            
            {!notes.length ? 
            <View
              style={[
                StyleSheet.absoluteFillObject,
                styles.emptyHeaderContainer,
              ]}
            >
                <Text style={styles.emptyHeader}>Add Notes</Text>
            </View> : null}
        </View>
        
        </TouchableWithoutFeedback>
        <RoundIconBtn
            onPress={() => setModalVisible(true)}
            antIconName='plus'
            style={styles.addBtn}
        />
        <NoteInputModal 
            visible={modalVisible} 
            onClose={() => setModalVisible(false)}
            onSubmit={handleOnSubmit}
        />
        
    </>
    );
};

// define your styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' depending on your choice
},
    header: {
        fontSize: 23,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: colors.primary,
      },
      container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
        paddingTop: 45,
        
      },
      emptyHeader: {
        fontSize: 30,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        opacity: 0.2,
      },
      emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
      },
      addBtn: {
        position: 'absolute',
        right: 15,
        bottom: 50,
        zIndex: 1,
      },

});

//make this component available to the app
export default NoteScreen;
