import React, { useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity
} from "react-native";

import AwesomeAlert from 'react-native-awesome-alerts';

const ImageFooter = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState({
        title: '',
        comfirmText: '',
    })

    const showAlertConfig = (type) => {
        if (type === 'Delete') {
            setAlert({
                title: 'Delete photo',
                comfirmText: 'Yes, delete it',
            })
        } else {
            setAlert({
                title: 'Make profile',
                comfirmText: 'Yes, make it profile',
            })
        }
        setShowAlert(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.options}>
                <View>
                    <TouchableOpacity onPress={() => showAlertConfig('Delete')}><Text style={{ color: 'grey' }}>Delete</Text></TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => showAlertConfig('Profile')}><Text style={{ color: 'grey' }}>Make Profile</Text></TouchableOpacity>
                </View>
            </View>

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alert.title}
                message="Are you sure?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText={alert.comfirmText}
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setShowAlert(false);
                }}
                onConfirmPressed={() => {
                    if (alert.title === 'Delete photo') {
                        props.deleteImage();
                    } else {
                        props.makeProfilePhoto();
                    }
                    setShowAlert(false);
                    props.closeModal();
                }}
            />
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    options: {
        width: '100%',
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
})


export default ImageFooter;