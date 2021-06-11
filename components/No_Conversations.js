import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const No_Conversations = ({ navigation }) => {
    return (
        <View>
            <Text style={{ fontSize: 20 }}>No conversations yet</Text>
            <TouchableOpacity style={styles.search} onPress={() => {
                navigation.navigate('Search')
            }}>
                <Text style={{ color: 'white' }}>Search for people</Text>
            </TouchableOpacity>
        </View>
    )
}

export default No_Conversations

const styles = StyleSheet.create({
    search: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
        marginTop: 10,
        borderRadius: 20
    }
})
