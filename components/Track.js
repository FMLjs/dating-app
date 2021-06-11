import React, { useEffect, useState } from 'react'
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Triangle } from 'react-native-shapes';
import Sound from 'react-native-sound'

const Track = ({ track, close }) => {
    const db = firestore().collection('Users');
    const user = auth().currentUser;
    const dispatch = useDispatch();
    const [searching, setSearching] = useState(track.searching);
    const [profile, setProfile] = useState(track.profile);

    const [playing, setPlaying] = useState(true);
    const [sound, setSound] = useState(null);

    const alert = () => {
        Alert.alert(
            'No preview available!',
            'Sorry, there is no preview for this song!',
            [{
                text: 'Ok',
            },]
        );
    }
    const play = () => {
        console.log(searching)
        console.log(profile)
        if (track.spotifyPreview === 'null') {
            alert();
            return false;
        }
        let _sound = new Sound(track.spotifyPreview, '', () => {
            setSound(_sound);
            _sound.play(() => {
                _sound.release()
            })
        });
        setPlaying(!playing);
    }

    const stop = () => {
        sound.stop(() => {
        })
        setPlaying(!playing)
    }

    const shareSong = () => {
        const trackInfo = {
            spotifyTrackId: track.spotifyTrackId,
            spotifyName: track.spotifyName,
            spotifyTrackName: track.spotifyTrackName,
            spotifyTrackImage: track.spotifyTrackImage,
            spotifyPreview: track.spotifyPreview
        }
        db.doc(user.uid).update(trackInfo)
            .then(() => console.log('Spotify uri added'))
            .then(() => {
                dispatch({
                    type: 'ADD_FAVOURITE_SONG',
                    payload: trackInfo
                })
            }).then(() => {
                close();
            })
    }
    return (

        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                playing ? play() : stop()
            }}>
                <ImageBackground
                    source={{ uri: track.spotifyTrackImage }}
                    style={styles.track_image}
                    imageStyle={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
                    {(searching || profile) ?
                        playing ?
                            <Triangle
                                rotate={90}
                                style={styles.shape}
                                color="lightgrey"
                                size={3}
                            /> :
                            <View style={[styles.square, styles.shape]} /> : null
                    }

                </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.track_description} onPress={() => {
                searching ? shareSong() : () => { return true }
            }}>
                <View>
                    <Text style={{ fontSize: 16 }}>{track.spotifyName}</Text>
                    <Text style={{ width: '100%' }}>{track.spotifyTrackName}</Text>
                </View>

            </TouchableOpacity>

        </View>

    )
}

export default Track

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 20
    },
    track_description: {
        marginLeft: 5,
        minWidth: '80%',
        maxWidth: '90%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 10
    },
    track_image: {
        width: 64,
        height: 64,
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderRadius: 15
    },
    shape: {
        opacity: 0.8,
        alignSelf: 'center'
    },
    square: {
        width: 20,
        height: 20,
        backgroundColor: "lightgrey",
    },
})
