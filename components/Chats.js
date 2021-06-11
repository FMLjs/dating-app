import React, { useEffect, useState } from 'react'
import { BackHandler, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Chat from './Chat'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loading from './Loading';
import No_Conversations from './No_Conversations';
const Chats = ({ navigation }) => {
    const state = useSelector(state => state.user).user
    const db = firestore().collection('Users');
    const [matchChats, setMatchChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState('');
    const [visible, setVisible] = useState(false);
    const [chat, setChat] = useState({});
    const [chatId, setChatId] = useState('');
    const [haveMatches, setHaveMatches] = useState(false);

    const close = () => {
        setVisible(false);
    }
    function handleBackButtonClick() {
        navigation.navigate('Home');
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    useEffect(() => {
        let matches = [];
        state.match?.forEach((mtch, idx, array) => {
            setHaveMatches(true)
            new Promise((resolve, reject) => {
                resolve(db.doc(mtch).get())
            }).then((user) => {
                new Promise((resolve, reject) => {
                    let usr = user.data();
                    storage().ref('/' + usr.profileImage)
                        .getDownloadURL()
                        .then((url) => {
                            usr.profileImage = url;
                            resolve(usr)
                        })
                        .catch((e) => console.log('getting downloadURL of image error => ', e));
                }).then((usr) => {
                    matches.push({ id: mtch, user: usr });
                    if (idx === array.length - 1) {
                        setMatchChats(matches);
                        setLoading(false);
                    }
                })
            })
        });
        const getProfileImageLink = async () => {
            const link = await storage().ref('/' + state.profileImage).getDownloadURL();
            setProfileImage(link);
        }
        getProfileImageLink();

    }, [])

    function matches() {
        return matchChats.map(item => {
            console.log(state.chats)
            return (
                <TouchableOpacity key={item.id}
                    onPress={() => {
                        state.chats.forEach(chat => {
                            if (item.user.chats.includes(chat)) {
                                setChatId(chat);
                            }
                        })
                        setVisible(true);
                        setChat(item);
                    }}>
                    <View style={styles.chats_profile}>
                        <Image source={{ uri: item.user.profileImage }}
                            style={styles.chats_profileImage} />
                        <View style={styles.chats_profileText}>
                            <Text style={styles.chats_profileInfo}>{item.user.name}</Text>
                            <Text style={styles.chats_profileMessage}>Last message...</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
    }
    return (
        <SafeAreaView style={styles.container}>
            {loading ?
                !haveMatches ?
                    <View style={styles.chats_noConversations}><No_Conversations navigation={navigation} /></View> :
                    <View style={styles.heart}>
                        <Text >
                            <Loading />
                        </Text>
                    </View>
                : visible ?
                    <Chat chatProfile={chat} chatId={chatId} close={close} /> :
                    <View style={{ flex: 1, padding: 20 }}>
                        <View style={styles.chats_profileChats}>
                            {matches()}
                        </View>
                    </View>}
        </SafeAreaView >
    )
}

export default Chats

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginTop: 30
    },
    chats_profile: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
        borderColor: 'black'
    },
    chats_profileImage: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderRadius: 40
    },
    chats_profileInfo: {
        fontSize: 20
    },
    chats_profileChats: {
        display: 'flex',
    },
    chats_profileText: {
        marginLeft: 10,
        justifyContent: 'center'
    },
    chats_profileMessage: {
        color: 'grey'
    },
    heart: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chats_noConversations: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})
