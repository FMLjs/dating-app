import React from 'react'
import { useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import _, { range } from 'underscore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

const ProfileEdit = ({ navigation }) => {
    const user = auth().currentUser;
    const dispatch = useDispatch();
    const state = useSelector(state => state.user).user

    const [name, setName] = useState(state.name);
    const [age, setAge] = useState(state.age);
    const [hobbies, setHobbies] = useState(state.hobbies);
    const [future, setFuture] = useState(state.future);

    let ageItems = _.range(18, 111).map((s, i) => {
        return <Picker.Item key={i} value={s + ''} label={s + ''} />
    })

    const save = () => {

        const profile = {
            name: name,
            age: Number(age),
            hobbies: hobbies,
            future: future,
            gallery: state.gallery,
            linksToImages: state.linksToImages
        }
        firestore().collection('Users').doc(user?.uid)
            .update({
                name: name,
                age: Number(age),
                hobbies: hobbies,
                future: future
            })
            .then(() => console.log('Document changes saved'))
            .then(() => {
                dispatch({
                    type: 'UPDATE_USER',
                    payload: profile
                })
            })
            .then(() => navigation.navigate('Profile'))
            .catch((err) => console.log(err));
    }

    return (
        <SafeAreaView style={{ marginTop: 20 }}>
            <View style={styles.profileEdit_row}>
                <Text style={styles.profileEdit_rowProperty}>What's your name?</Text>
                <TextInput
                    style={styles.profileEdit_rowInput}
                    value={name}
                    onChangeText={name => setName(name)}
                    placeholder='Enter your name'
                />
            </View>

            <View style={styles.profileEdit_row}>
                <Text style={styles.profileEdit_rowProperty}>How old are you?</Text>
                <Picker
                    selectedValue={age.toString()}
                    style={styles.profileEdit_rowPicker}
                    itemStyle={{ backgroundColor: '#5BA5FB' }}
                    onValueChange={(itemValue, itemIndex) =>
                        setAge(itemValue)
                    }>
                    {ageItems}
                </Picker>
            </View>

            <View style={styles.profileEdit_row}>
                <Text style={styles.profileEdit_rowProperty}>Hobbies</Text>
                <TextInput
                    style={styles.profileEdit_rowInput}
                    value={hobbies}
                    onChangeText={hobbie => setHobbies(hobbie)}
                    placeholder='Tell us about your hobbies'
                />
            </View>

            <View style={styles.profileEdit_row}>
                <Text style={styles.profileEdit_rowProperty}>Future</Text>
                <TextInput
                    style={styles.profileEdit_rowInput}
                    value={future}
                    onChangeText={future => setFuture(future)}
                    placeholder='Tell us about your future plans'
                />
            </View>

            <TouchableOpacity style={styles.profileEdit_btn} onPress={() => {
                save();
            }}>
                <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default ProfileEdit

const styles = StyleSheet.create({
    profileEdit_row: {
        margin: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 10,
        borderBottomWidth: 1,
        borderStyle: 'dotted'
    },
    profileEdit_rowProperty: {
        fontSize: 17,
        borderColor: 'black',
        marginBottom: 10,
    },
    profileEdit_rowInput: {
        height: 40,
        width: 300,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    profileEdit_btn: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
        marginTop: 20,
    },
    profileEdit_rowPicker: {
        height: 50,
        width: 100,

    }
})

