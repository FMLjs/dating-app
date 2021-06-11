import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';

const Mesage = ({ message }) => {
    const user = auth().currentUser;

    const messageStyle = () => {
        if (message.from === user.uid) {
            return {
                maxWidth: '45%',
                borderRadius: 20,
                padding: 10,
                marginLeft: 'auto',
                backgroundColor: '#3C88AA',
                margin: 5,
            }
        } else {
            return {
                maxWidth: '45%',
                borderRadius: 20,
                padding: 10,
                marginRight: 'auto',
                backgroundColor: '#A1A8AB',
                margin: 5,
            }
        }

    }

    const date = () => {
        let d = new Date(message.timestamp);
        let datestring = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        return datestring;
    }
    return (
        <View style={messageStyle()}>
            <Text style={{ color: 'white' }}>{message.message}</Text>
            <View style={{ marginLeft: 'auto' }}>
                <Text style={styles.message_dateText}>{date()}</Text>
            </View>
        </View>
    )
}

export default Mesage

const styles = StyleSheet.create({
    message_dateText: {
        fontSize: 7,
        color: 'white',
        paddingTop: 10,
    }
})
