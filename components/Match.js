import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import storage from '@react-native-firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const Match = ({ matchUser, close, profileImage }) => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('./assets/match_background.jpg')} style={styles.backgroundImage}>
                <View style={styles.match}>
                    <View style={styles.match_matchMessage}>
                        <Text style={styles.match_matchMessageText}>Its a match!</Text>
                        <Text style={{ alignSelf: 'center' }}>{`You and ${matchUser.name} have liked each other!`}</Text>
                    </View>
                    <View style={styles.match_matchMessageImages}>
                        <Image
                            style={styles.match_matchMessageImage}
                            source={{ uri: profileImage._W }} />
                        <Image
                            style={styles.match_matchMessageImage}
                            source={{ uri: matchUser.profileImage }} />

                    </View>

                    <View style={[styles.match_matchMessageBtns, { justifyContent: 'space-between' }]}>
                        <TouchableOpacity style={styles.match_matchMessageBtn}
                            onPress={() => {
                                close();
                            }}>
                            <Text style={{ textAlign: 'center' }}>
                                <FontAwesomeIcon style={styles.match_matchMessageIcon} icon={faSearch} />
                                Continue Searching
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.match_matchMessageBtn}
                            onPress={() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Chats' }],
                                });
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>
                                <FontAwesomeIcon style={styles.match_matchMessageIcon} icon={faComment} />
                                Go to chats
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>


        </SafeAreaView>
    )
}

export default Match

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#2390FE',
        marginTop: 30

    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    match: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    match_matchMessage: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        backgroundColor: 'white',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    match_matchMessageText: {
        alignSelf: 'center',
        fontSize: 32,
    },
    match_matchMessageImages: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    match_matchMessageImage: {
        width: 170,
        height: 170,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 2
    },
    match_matchMessageBtn: {
        borderColor: 'white',
        borderWidth: 1,
        padding: 15,
        margin: 10,
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center'
    },
    match_matchMessageBtns: {
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    match_matchMessageIcon: {
        color: '#8CC2E8',
    }
})