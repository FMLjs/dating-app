import React, { useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');

    const login = () => {
        auth()
            .signInWithEmailAndPassword(username, password)
            .then(() => {
                console.log('User signed in')
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            })
            .catch(error => {
                setError(error.message);
                console.log(error);
            })
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.login_greeting}>Hello! {'\n'} Please login to your account or register!</Text>
            <View style={styles.login_form}>
                <TextInput
                    style={styles.login_formInput}
                    value={username}
                    onChangeText={text => setUsername(text)}
                    placeholder='Enter email'
                />
                <TextInput
                    style={styles.login_formInput}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                    placeholder='Enter password'
                />
                <Text style={styles.login_forimError}>{error ? error : ''}</Text>

            </View>

            <View style={styles.login_buttons}>
                <TouchableOpacity style={styles.login_button}
                    disabled={!username || !password}
                    onPress={login}
                    title={'Sign In'} >
                    <Text style={styles.login_buttonText}>SIGN IN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.login_button}
                    onPress={() => (
                        navigation.navigate('Registration')
                    )}
                >
                    <Text style={styles.login_buttonText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        marginTop: 30
    },
    login_form: {
        alignItems: 'center'
    },
    login_formInput: {
        height: 40,
        width: 300,
        borderRadius: 10,
        borderWidth: 1,
        margin: 20,
        padding: 10,
        backgroundColor: 'white'
    },
    login_button: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
        marginTop: 20,
    },
    login_buttonText: {
        fontSize: 14,
        color: 'white'
    },
    login_forimError: {
        color: 'red'
    },
    login_greeting: {
        textAlign: 'center',
        fontSize: 17,
    }
})
