import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Match from './Match';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import Track from './Track';

const Search = ({ navigation }) => {
    const currentUser = auth().currentUser;
    const state = useSelector(state => state.user).user
    const [profilePicForMatch, setProfilePicForMatch] = useState('');

    const [randomUsers, setRandomUsers] = useState([]);
    const [randomUser, setRandomUser] = useState({});
    const [match, setMatch] = useState({});
    const [loading, setLoading] = useState(true)
    const db = firestore().collection('Users');
    const chat = firestore().collection('Chats');
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const getUrl = async () => {
            const link = await storage().ref('/' + state.profileImage).getDownloadURL();
            return link;
        }
        setProfilePicForMatch(getUrl());
    }, [])

    const getRandomUsers = () => {
        return new Promise((resolve, reject) => {
            db.get().then((query) => {
                new Promise((resolve, reject) => {
                    let users = [];
                    query._docs.filter(item => !state.match?.includes(item.id) && item.id != currentUser.uid).forEach(item => {
                        users.push({ id: item.id, data: item.data() })
                    });
                    resolve(users)
                }).then((users) => {
                    setRandomUsers(users);
                    setLoading(false);
                    resolve(users);
                })
            })
        })

    }

    const getRandomUser = async (randomUsers) => {
        try {
            const user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
            const link = await storage().ref('/' + user.data.profileImage).getDownloadURL();
            let spotifyData;
            typeof user.data.spotifyTrackId === 'undefined' ?
                spotifyData = undefined : spotifyData = {
                    profile: true,
                    searching: false,
                    spotifyTrackId: user.data.spotifyTrackId,
                    spotifyTrackImage: user.data.spotifyTrackImage,
                    spotifyName: user.data.spotifyName,
                    spotifyTrackName: user.data.spotifyTrackName,
                    spotifyPreview: user.data.spotifyPreview + ''
                }
            setRandomUser({
                id: user.id,
                name: user.data.name,
                age: user.data.age,
                hobbies: user.data.hobbies,
                future: user.data.future,
                profileImage: link,
                spotify: spotifyData
            })
        } catch (err) {
            console.log('getting random user', err)
        }

    }
    const close = () => {
        setShowAlert(false);
    }
    const dislike = () => {
        const currentUserId = currentUser?.uid;
        const randomUserId = randomUser.id;
        //TBD
    }
    const a = async () => {
        await db.doc('lLm4eDFjtUQ55alZ7Dwj6cLtLjx1')
            .update({ 'likeFrom': firestore.FieldValue.arrayRemove('p7ihFSWOKvRZ92tFhWqqgcF9FdJ2') });

        await db.doc('p7ihFSWOKvRZ92tFhWqqgcF9FdJ2')
            .update(({ 'likeTo': firestore.FieldValue.arrayRemove('lLm4eDFjtUQ55alZ7Dwj6cLtLjx1') }));

        await db.doc('lLm4eDFjtUQ55alZ7Dwj6cLtLjx1')
            .update({ 'match': firestore.FieldValue.arrayRemove('p7ihFSWOKvRZ92tFhWqqgcF9FdJ2') });

        await db.doc('p7ihFSWOKvRZ92tFhWqqgcF9FdJ2')
            .update({ 'match': firestore.FieldValue.arrayRemove('lLm4eDFjtUQ55alZ7Dwj6cLtLjx1') });

        await db.doc('lLm4eDFjtUQ55alZ7Dwj6cLtLjx1')
            .update({ 'chats': firestore.FieldValue.arrayRemove('p7ihFSWOKvRZ92tFhWqqgcF9FdJ2') });

        await db.doc('p7ihFSWOKvRZ92tFhWqqgcF9FdJ2')
            .update({ 'chats': firestore.FieldValue.arrayRemove('lLm4eDFjtUQ55alZ7Dwj6cLtLjx1') });
    }
    // a()

    const like = async () => {
        const currentUserId = currentUser?.uid;
        const randomUserId = randomUser.id;
        await db.doc(currentUser?.uid)
            .update({ 'likeTo': firestore.FieldValue.arrayUnion(randomUserId) });

        await db.doc(randomUser.id)
            .update(({ 'likeFrom': firestore.FieldValue.arrayUnion(currentUserId) }));

        checkIfMatch(currentUserId, randomUserId)
            .then(async (match) => {
                if (match) {
                    await db.doc(currentUser?.uid)
                        .update({ 'match': firestore.FieldValue.arrayUnion(randomUserId) });

                    await db.doc(randomUser.id)
                        .update({ 'match': firestore.FieldValue.arrayUnion(currentUserId) });

                    const id = currentUserId.substring(0, 10).concat(randomUserId.substring(0, 10));
                    chat.doc(id).set({});
                    await db.doc(currentUser?.uid)
                        .update({ 'chats': firestore.FieldValue.arrayUnion(id) });

                    await db.doc(randomUser.id)
                        .update({ 'chats': firestore.FieldValue.arrayUnion(id) });

                    dispatch({
                        type: 'ADD_TO_MATCH',
                        payload: randomUserId
                    })

                    setShowAlert(true);
                    setMatch({
                        id: randomUser.id,
                        name: randomUser.name,
                        age: randomUser.age,
                        hobbies: randomUser.hobbies,
                        future: randomUser.future,
                        profileImage: randomUser.profileImage
                    })
                    const arr = randomUsers.filter((item) => {
                        return item.id !== randomUserId
                    });
                    setRandomUsers(arr);
                    getRandomUser(arr);
                } else {
                    getRandomUser(randomUsers);
                }
            });

    }

    const checkIfMatch = (currentUserId, randomUserId) => {
        return new Promise((resolve, reject) => {
            db.doc(randomUserId).get()
                .then((user) => {
                    if (user.exists) {
                        const likes = user.data().likeTo;
                        resolve(likes.includes(currentUserId));
                    }
                })
        })
    }

    useEffect(() => {
        getRandomUsers()
            .then((users) => {
                getRandomUser(users);
            });
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            {loading ?
                <View style={styles.heart}>
                    <Text >
                        <Loading />
                    </Text>
                </View>
                : showAlert ? <Match matchUser={match} close={close} profileImage={profilePicForMatch} /> :
                    <View style={styles.search}>
                        <View style={styles.search_profile}>
                            <View>
                                {randomUser.profileImage ? <Image source={{ uri: randomUser.profileImage }}
                                    style={{ width: 300, height: 370 }} /> : <Image source={require('./assets/no_image.png')}
                                        style={{ width: 300, height: 370 }} />}
                            </View>
                            <ScrollView style={styles.search_profileInfo}>
                                <Text style={{ fontSize: 20, marginBottom: 20 }}>
                                    {randomUser.name}, {randomUser.age}
                                </Text>
                                <Text style={{}}>
                                    {randomUser.hobbies}
                                </Text>
                                <Text style={{}}>
                                    {randomUser.future}
                                </Text>
                                {typeof randomUser.spotify === 'undefined' ?
                                    <Text></Text> : <View style={styles.track}><Track track={
                                        {
                                            profile: true,
                                            searching: false,
                                            spotifyTrackId: randomUser.spotify.spotifyTrackId,
                                            spotifyTrackImage: randomUser.spotify.spotifyTrackImage,
                                            spotifyName: randomUser.spotify.spotifyName,
                                            spotifyTrackName: randomUser.spotify.spotifyTrackName,
                                            spotifyPreview: randomUser.spotify.spotifyPreview
                                        }
                                    } /></View>}
                            </ScrollView>
                        </View>
                        <View style={styles.search_estimate}>
                            <TouchableOpacity
                                onPress={() => {
                                    dislike(),
                                        getRandomUser(randomUsers)
                                }}>
                                <FontAwesomeIcon icon={faThumbsDown} size={70} color={'#3498FD'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    like();
                                }}>
                                <FontAwesomeIcon icon={faHeart} size={70} color={'red'} />
                            </TouchableOpacity>
                        </View>
                    </View>
            }
        </SafeAreaView>

    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        marginTop: 20
    },
    search_profile: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50
    },
    search_profileInfo: {
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,
        width: 300,
        height: 130
    },
    search_estimate: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    search_alertContent: {
        flex: 1,
    },
    heart: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    track: {
        marginTop: 10,
        marginBottom: 10
    }
})
