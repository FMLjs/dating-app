import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Heart } from 'react-native-shapes'
const Loading = () => {
    return (
        <View style={styles.container}>
            <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                style={{ textAlign: 'center' }}>
                <Heart style={styles.loadgingHeart} color="#89C7E2" size={25} />
                <Text style={styles.loadgingHeartText}>Loading...</Text>
            </Animatable.View>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadgingHeart: {
        zIndex: 1,

    },
    loadgingHeartText: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        zIndex: 10000,
        fontSize: 20,
        color: 'white'
    }

})
