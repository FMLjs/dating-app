import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import RNLocation from 'react-native-location';
import { useSelector } from 'react-redux';
import Spotify_Search from './Spotify_Search';
import Track from './Track';

const Profile = ({ navigation }) => {
    const state = useSelector(state => state.user).user
    const [latLong, setLatLong] = useState({});
    const [location, setLocation] = useState('');
    const [visible, setVisible] = useState(true);
    const key = 'pIHGX0rmcTzAuVGQ8ofy2hY1cDlWhGf0';

    RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
            detail: "coarse"
        }
    }).then(granted => {
        if (granted) {
            RNLocation.subscribeToLocationUpdates(locations => {
                setLatLong({
                    latitude: locations[0].latitude,
                    longitude: locations[0].longitude
                })
            })
        }
    }).then(() => {
        if (latLong) {
            fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${latLong.latitude},${latLong.longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
                .then((response) => response.json())
                .then((responseJson) => {
                    setLocation(responseJson.results[0].locations[0].adminArea5);
                }).catch((err) => console.log(err))
        }
    });

    const close = () => {
        setVisible(true);
    }
    return (
        <SafeAreaView style={{ marginTop: 25 }}>
            {visible ? <View style={styles.container}>
                <View style={styles.profileRow}>
                    <Text style={styles.profileRow_property}>Name</Text>
                    <Text style={styles.profileRow_value}>{state.name}</Text>
                </View>

                <View style={styles.profileRow}>
                    <Text style={styles.profileRow_property} >Age</Text>
                    <Text style={styles.profileRow_value}>{state.age}</Text>
                </View>

                <View style={styles.profileRow}>
                    <Text style={styles.profileRow_property} >Location</Text>
                    <Text style={styles.profileRow_value}>{location ? location : 'Looking for where you are'}</Text>
                </View>

                <View style={styles.profileRow}>
                    <Text style={styles.profileRow_property} >Hobbies</Text>
                    <Text style={styles.profileRow_value}>{state.hobbies}</Text>
                </View>
                <View style={styles.profileRow}>
                    <Text style={styles.profileRow_property}>Who do you see yourself in the future</Text>
                    <Text style={styles.profileRow_value}>{state.future}</Text>
                </View>
                <View style={styles.profileRow_spotify}>
                    <TouchableOpacity onPress={() => {
                        setVisible(false);
                    }}>
                        {state.spotifyTrackId ? <Track track={
                            {
                                profile: false,
                                searching: false,
                                spotifyTrackId: state.spotifyTrackId,
                                spotifyTrackImage: state.spotifyTrackImage,
                                spotifyName: state.spotifyName,
                                spotifyTrackName: state.spotifyTrackName,
                                spotifyPreview: state.spotifyPreview

                            }
                        } /> : <ImageBackground source={require('./assets/spotify-logo.png')}
                            style={styles.profileRow_spotifyLogo}>
                            <View style={styles.profileRow_spotifyText}>
                                <Text>Share your favorite song</Text>
                            </View>
                        </ImageBackground>}

                    </TouchableOpacity>

                </View>
                <View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => {
                        navigation.navigate('ProfileEdit')
                    }}>
                        <Text style={{ color: 'white' }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View> : <Spotify_Search close={() => { close() }} />}
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    profileRow_property: {
        fontSize: 17,
        borderColor: 'black',
        borderRightWidth: 1,

        borderBottomWidth: 1,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 0,
        marginBottom: 10,
        borderRadius: 4,
    },
    profileRow_value: {
        color: '#505050'
    },
    profileRow: {
        margin: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15
    },
    profileButton: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
    },
    profileRow_spotify: {
        width: '100%',
        height: 100,
        alignSelf: 'center',
        borderRadius: 30
    },
    profileRow_spotifyLogo: {
        height: 100,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-around'
    },
    profileRow_spotifyText: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    }
})
