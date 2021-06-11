import React, { useState } from 'react'
import { Alert, Animated, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import ImageViewing from 'react-native-image-viewing';
import ImageFooter from './ImageFooter';

const Gallery = ({ navigation }) => {
    const user = auth().currentUser;
    const state = useSelector(state => state.user).user
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selecting, setSelecting] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [animation, setAnimation] = useState(new Animated.Value(650));
    const [active, setActive] = useState(true);
    const [animatedStyles, setAnimatedStyles] = useState({ height: animation })
    const [modalUri, setModalUri] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const db = firestore().collection('Users');

    const dispatch = useDispatch();

    const modalImages = () => {
        return state.gallery.map((item) => {
            return {
                uri: item.imgUri,
            }
        })

    }
    const selectImage = () => {
        if (active) {
            startAnimation();
        }
        setSelecting(true)
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                setSelecting(false)
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: 'file://' + response.path };
                setImage(source);
            }
        });
    };

    const uploadImage = async () => {
        const { uri } = image;
        const filename = 'profile_' + user.uid + new Date().getTime();
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        setTransferred(0);

        const task = storage()
            .ref(filename)
            .putFile(uploadUri)

        // set progress state
        task.on('state_changed', snapshot => {
            setTransferred(
                Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
            );
        });

        try {
            await task;
            new Promise((resolve, reject) => {
                db.doc(user?.uid)
                    .update({ 'gallery': firestore.FieldValue.arrayUnion(filename) })
                    .then(() => {
                        dispatch({
                            type: 'ADD_TO_GALLERY',
                            payload: {
                                imgName: filename,
                                imgUri: uploadUri
                            }
                        })
                    })
                    .then(() => {
                        if (state.gallery.length === 0) {
                            makeProfilePhoto(filename);
                        }
                    })
                    .then(() => resolve())
                    .catch((err) => console.log(err))
            })
        } catch (e) {
            console.error(e);
        }

        setUploading(false);
        setSelecting(false)

        Alert.alert(
            'Photo uploaded!',
            'Your are beatifull!'
        );

        setImage(null);
    };

    function images() {
        return state.gallery?.map((img, i) => {
            return (
                <TouchableOpacity
                    key={img.imgUri}
                    onPress={() => {
                        returnModal(img);
                        setModalIndex(i);
                    }} >
                    < Image
                        resizeMethod={'resize'}
                        style={{ width: 100, height: 200, marginBottom: 20 }}
                        source={{ uri: img.imgUri }}
                    />
                </TouchableOpacity>
            )
        });
    }

    function returnModal(img) {
        setModalUri(img)
        setModalVisible(true)
    }

    function close() {
        setModalVisible(false)
    }

    function deletePhoto(imageIndex) {
        const imageToDelete = state.gallery[imageIndex];
        let ref = storage().ref().child('/' + imageToDelete.imgName);
        ref.delete()
            .then(() => {
                console.log('Image deleted from storage')
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                new Promise((resolve, reject) => {
                    db.doc(user?.uid)
                        .update({ 'gallery': firestore.FieldValue.arrayRemove(imageToDelete.imgName) })
                        .then(() => {
                            dispatch({
                                type: 'REMOVE_FROM_GALLERY',
                                payload: {
                                    imgName: imageToDelete.imgName,
                                    imgUri: imageToDelete.imgUri
                                }
                            })
                        })
                        .then(() => resolve())
                        .catch((err) => console.log('!!' + err))
                })
            })
    }

    const makeProfilePhoto = async (imgName) => {
        await db.doc(user?.uid)
            .update({ 'profileImage': imgName });
    }

    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: active ? 650 : 170,
            duration: 400,
            useNativeDriver: false
        }).start(() => {
            setActive(!active)
        });
    }


    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[animatedStyles]}>
                <View style={styles.gallery_uploadSection}>
                    <Text style={styles.gallery_greeting}>Upload photos!</Text>

                    <TouchableOpacity
                        style={styles.gallery_btn}
                        onPress={selectImage}
                    >
                        <Text style={{ color: 'white' }}>Load Image</Text>
                    </TouchableOpacity>
                    <View
                        style={styles.gallery_imageUploader}>
                        {image !== null ? (
                            <Image source={{ uri: image.uri }} style={{ width: 100, height: 200, alignSelf: 'center' }} />
                        ) : null}
                        {uploading ? (
                            <View style={styles.gallery_progressBar}>
                                <Progress.Bar progress={transferred} width={300} />
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[!selecting ? styles.gallery_btnDisabled : styles.gallery_btn]}
                                onPress={uploadImage}
                                disabled={!selecting}>
                                <Text style={{ color: 'white' }}>Upload image</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Animated.View>
            <Animated.View style={[animatedStyles]}>
                <View style={styles.gallery_gallerySection}>
                    <TouchableOpacity disabled={selecting} onPress={() => startAnimation()}>
                        <Text style={styles.gallery_greeting}>Your gallery!</Text>
                    </TouchableOpacity >
                    <View style={styles.gallery_allPhotos}>
                        <ScrollView>
                            <View style={styles.gallery_gallerySectionScrollView}>
                                {images()}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Animated.View>
            <ImageViewing
                onRequestClose={() => close()}
                images={modalImages()}
                imageIndex={modalIndex}
                visible={modalVisible}
                FooterComponent={
                    ({ imageIndex }) => {
                        return (
                            <ImageFooter
                                closeModal={() => close()}
                                deleteImage={() => { deletePhoto(imageIndex) }}
                                makeProfilePhoto={() => { makeProfilePhoto(modalUri.imgName) }} />
                        );
                    }
                }

            />
        </SafeAreaView>
    )
}
export default Gallery

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        marginTop: 30
    },
    gallery_greeting: {
        textAlign: 'center',
        fontSize: 17,
    },
    gallery_btn: {
        alignItems: "center",
        backgroundColor: "#5BA5FB",
        padding: 10,
        marginTop: 20,
    },
    gallery_btnDisabled: {
        alignItems: "center",
        backgroundColor: "#B8B9BA",
        padding: 10,
        marginTop: 20,
    },
    gallery_allPhotos: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    gallery_imageUploader: {
        marginTop: 20,
    },
    gallery_progressBar: {
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    gallery_uploadSection: {
        borderBottomWidth: 1,
        marginBottom: 10,
        paddingBottom: 10,
        borderRadius: 20,
    },
    gallery_gallerySection: {
        paddingTop: 10,
        height: 500
    },
    gallery_gallerySectionScrollView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    }


})
