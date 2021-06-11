import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Message from './Message';
const Chat = ({ chatProfile, chatId }) => {
    const scrollViewRef = useRef();
    const [message, setMessage] = useState('');
    const db = firestore().collection('Chats');
    const user = auth().currentUser;
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        setMessage('');
        await db.doc(chatId).collection('messages').add({
            message: message,
            from: user.uid,
            timestamp: Date.now()
        })
    }

    useEffect(() => {
        db.doc(chatId).collection('messages').orderBy('timestamp', 'asc').
            onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            })
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chat_header}>
                <Image source={{ uri: chatProfile.user.profileImage }} style={styles.chat_header_image} />
                <Text style={{ fontSize: 20, color: 'white' }}>{chatProfile.user.name}</Text>
            </View>
            <ScrollView
                style={styles.chat_messages}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {messages.map(message => (
                    <Message key={message.from + message.timestamp} message={message} />
                ))}
            </ScrollView>
            <View style={styles.chat_input}>
                <TextInput
                    style={styles.chat_inputText}
                    placeholder="Message..."
                    onChangeText={message => setMessage(message)}
                    defaultValue={message}
                />
                <TouchableOpacity style={styles.chat_inputButton}
                    onPress={sendMessage}>
                    <FontAwesomeIcon icon={faLocationArrow} size={30} color={'black'} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    chat_header: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#67C6F1',
    },
    chat_header_image: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    chat_messages: {
        flex: 1,
    },
    chat_input: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    chat_inputText: {
        backgroundColor: 'white',
        width: '85%',
    },
    chat_inputButton: {
        marginLeft: 5
    }
})
