import React, { useEffect } from 'react'
import { useState } from 'react';
import { Alert, BackHandler, StyleSheet, Text, TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Loading from './Loading';
import Track from './Track';

const Spotify_Search = (props) => {
    const [track, setTrack] = useState('');
    const [tracks, setTracks] = useState([]);
    const [status, setStatus] = useState(false);
    const getTrack = async (track) => {
        if (track.length > 0) {
            const response = await fetch(`https://fmlmail-server.herokuapp.com/song/${track}`);
            const responseJson = await response.json();
            return responseJson;
        } else {
            return [];
        }

    }
    useEffect(() => {
        console.log('fetching')
        fetch(`https://fmlmail-server.herokuapp.com/`)
            .then((responseJson) => {
                if (responseJson.ok) {
                    setStatus(true);
                }
            })
    }, [])

    const getTracks = () => {
        return tracks.map((item, i) => {
            return (
                <Track key={item.uri}
                    track={
                        {
                            profile: false,
                            searching: true,
                            spotifyTrackId: item.uri,
                            spotifyTrackImage: item.imgUrl,
                            spotifyName: item.name,
                            spotifyTrackName: item.trackName,
                            spotifyPreview: item.preview_url + ''
                        }
                    }
                    close={() => { props.close() }}
                />
            )
        });
    }

    function handleBackButtonClick() {
        props.close();
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);
    return (
        <View>
            {status ?
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type here to search!"
                        onChangeText={track => {
                            setTrack(track);
                            getTrack(track).then((tracks) => {
                                setTracks(tracks);
                            })
                        }}
                        defaultValue={track}
                    />
                    <ScrollView>{getTracks()}</ScrollView>
                </View>
                : <View style={[styles.heart, { flex: 1, marginTop: 310 }]}>
                    <Text >
                        <Loading />
                    </Text>
                </View>
            }
        </View>
    )
}

export default Spotify_Search

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: '90%'
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        borderRadius: 15
    },
    heart: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
})
