import React, { useEffect, useState } from 'react'
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import Loading from './Loading';

const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = auth().currentUser;
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const db = firestore().collection('Users');
        const userCollection = db.doc(user?.uid);
        userCollection.get().then(docSnapshot => {
            if (docSnapshot.exists) {
                const profile = { name, age, gallery =[], hobbies, future, match, spotifyTrackId } = docSnapshot.data()
                let links = [];
                new Promise((resolve, reject) => {
                    if (gallery.length < 1) {
                        resolve([]);
                    }
                    gallery.forEach((img, idx, array) => {
                        new Promise((resolve, reject) => {
                            let imageRef = storage().ref('/' + img);
                            imageRef
                                .getDownloadURL()
                                .then((url) => {
                                    resolve({
                                        imgName: img,
                                        imgUri: url
                                    })
                                })
                                .catch((e) => console.log('getting downloadURL of image error => ', e));
                        }).then((imgData) => {
                            links.push(imgData);
                        }).then(() => {
                            if (idx === array.length - 1) {
                                resolve(links);
                            }
                        })
                    })

                }).then((links) => {
                    profile.gallery = links;
                    console.log('User Profile', profile);
                    dispatch({
                        type: 'UPDATE_USER',
                        payload: profile
                    })
                })
                setLoading(false)
            } else {
                userCollection.set({
                    name: '',
                    age: 18,
                    hobbies: '',
                    future: '',
                    gallery: [],
                    likeFrom: [],
                    likeTo: [],
                    match: [],
                    spotifyTrackId: ''

                }).then(() => setLoading(false), console.log('Document saved!'))
            }
        })
    }, [user])

    return (

        <SafeAreaView style={{ flex: 1 }}>
            {!loading ?
                <View style={styles.container}>
                    <View style={styles.home_menuRow}>
                        <TouchableOpacity
                            style={{ ...styles.home_menuOption, ...styles.optionOne }}
                            onPress={() => (
                                navigation.navigate('Profile')
                            )}>
                            <Text style={{ color: 'white' }}>About you</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.home_menuOption, ...styles.optionTwo }}
                            onPress={() => {
                                navigation.navigate('Gallery')
                            }
                            }>
                            <Text style={{ color: 'white' }} >Photos</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.home_menuRow}>
                        <TouchableOpacity
                            style={{ ...styles.home_menuOption, ...styles.optionThree }}
                            onPress={() => {
                                navigation.navigate('Chats');
                            }}
                        >
                            <Text style={{ color: 'white' }}>Chat with people</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ ...styles.home_menuOption, ...styles.optionFour }}
                            onPress={() => {
                                navigation.navigate('Search')
                            }}
                        >
                            <Text style={{ color: 'white' }}>Search for people</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Button title='Sign Out' onPress={() => (
                            dispatch({
                                type: 'USER_LOGOUT'
                            }),
                            auth()
                                .signOut()
                                .then(() => navigation.replace('Login'))
                        )} />
                    </View>
                </View>
                :
                <View style={styles.heart}>
                    <Text >
                        <Loading />
                    </Text>
                </View>
            }
        </SafeAreaView>

    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,

    },
    home_menuRow: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    home_menuOption: {
        width: 150,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    optionOne: {
        backgroundColor: '#50C7FC'
    },
    optionTwo: {
        backgroundColor: '#43B0E1'

    },
    optionThree: {
        backgroundColor: '#3890B8'
    },
    optionFour: {
        backgroundColor: '#297191'

    },
    heart: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
