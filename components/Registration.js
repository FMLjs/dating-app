import React, { useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';


const Registration = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [error, setError] = useState('');

    const signUp = () => {
        if (password !== passwordRepeat) {
            setError('Passwords do not match')
        } else {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    return result.user.updateProfile({
                        displayName: username
                    });
                }).
                then(() => {
                    console.log('User created');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                })
                .catch((error) => {
                    setError(error.message);
                    console.log(error);
                })
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.registration_greeting}>
                Please fill out the form {'\n'}
                Remember, protecting your data starts with you.{'\n'}
                Come up with a strong password!
            </Text>
            <View style={styles.registration_form}>
                <TextInput
                    style={styles.registration_formInput}
                    value={email}
                    onChangeText={email => setEmail(email)}
                    placeholder='Enter email'
                />

                <TextInput
                    style={styles.registration_formInput}
                    value={username}
                    onChangeText={user => setUsername(user)}
                    placeholder='Enter username'
                />
                <TextInput
                    style={styles.registration_formInput}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                    placeholder='Enter password'
                />

                <TextInput
                    style={styles.registration_formInput}
                    value={passwordRepeat}
                    secureTextEntry={true}
                    onChangeText={passwordRepeat => setPasswordRepeat(passwordRepeat)}
                    placeholder='Repeat password'
                />

            </View>

            <Text>{error ? error : ''}</Text>

            <TouchableOpacity
                disabled={!email || !username || !password
                    || !passwordRepeat}
                style={styles.registration_button}
                onPress={signUp}
            >
                <Text style={styles.registration_buttonText}>SIGN UP</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Registration

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        marginTop: 20
    },
    registration_button: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
        marginTop: 20,
    },
    registration_button: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
        marginTop: 20,
    },
    registration_formInput: {
        height: 40,
        width: 300,
        borderRadius: 10,
        borderWidth: 1,
        margin: 20,
        padding: 10,
        backgroundColor: 'white'
    },
    registration_greeting: {
        textAlign: 'center',
        fontSize: 17,
    },
    registration_buttonText: {
        fontSize: 14,
        color: 'white'
    }
})
