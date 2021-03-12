import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions} from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as  MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";
import AddPlace from '../../screens/Places/AddPlace';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";

import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddPlaceForm(props){
    const { toastRef, setIsLoading, navigation } = props;
    const [placeName, setPlaceName] = useState("");
    const [placeAdress, setPlaceAdress] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationPlace, setLocationPlace] = useState(null);
    
    const addPlace =() => {
        if(!placeName || !placeAdress || !placeDescription){
            toastRef.current.show("Todos los campos del formulario son obligatorios");
        }else if(size(imageSelected) == 0){
            toastRef.current.show("El lugar tiene que tener al menos 1 imagen");
        }else if(!locationPlace){
            toastRef.current.show("Tienes que localizar el lugar en el mapa");
        } else {
            setIsLoading(true);
            uploadImageStorage().then((response) => {

                db.collection("places")
                    .add({
                        name: placeName,
                        address: placeAdress,
                        description: placeDescription,
                        location: locationPlace,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebaseApp.auth().currentUser.uid,
                    })
                    .then(() =>{
                        setIsLoading(false);
                        navigation.navigate("restaurants")
                    }).catch(() => {
                        setIsLoading(false);
                        toastRef.current.show("Error al subir el lugar, intentelo mas tarde");
                    })
                
            });
        }
    };

    const uploadImageStorage = async() =>{
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async(image) =>{
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("places").child(uuid());
                await ref.put(blob).then(async(result) =>{
                    await firebase
                        .storage()
                        .ref(`places/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );
        return imageBlob;
    };

    return (
        <ScrollView style={styles.scrollView}>
            <ImagePlace  imagePlace={ imageSelected[0] }/>
            <FormAdd
                setPlaceName= { setPlaceName }
                setPlaceAdress={ setPlaceAdress }
                setPlaceDescription = { setPlaceDescription }
                setIsVisibleMap = { setIsVisibleMap }
                locationPlace = { locationPlace }
            />
            <UploadImage 
                toastRef={toastRef}
                imageSelected={imageSelected}
                setImageSelected={setImageSelected} 
            />
                
            <Button 
                title= "Añadir"
                onPress={addPlace}
                buttonStyle={styles.btnAddPlace}
            />
            <Map 
                isVisibleMap={ isVisibleMap }
                setIsVisibleMap= { setIsVisibleMap }
                setLocationPlace = {setLocationPlace}
                toastRef = {toastRef}
            />
        </ScrollView>
    )
}
function ImagePlace(props) {
    const { imagePlace } = props;

    return (
        <View style={styles.viewPhoto}>
            <Image 
                source={ 
                    imagePlace
                    ? { uri: imagePlace }
                    : require("../../../assets/img/no-image.png")
                }
                style={{ width: widthScreen , height: 200}}
            />
        </View>
    )
}

function FormAdd(props){
    const{ setPlaceName, setPlaceAdress, setPlaceDescription, setIsVisibleMap, locationPlace } = props;

    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder = "Nombre del lugar"
                containerStyle= {styles.input}
                onChange= {e => setPlaceName(e.nativeEvent.text)}

            />
            <Input
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange= {e => setPlaceAdress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationPlace ? "#ff1ff0": "#c2c2c2",
                    onPress: (() => setIsVisibleMap(true))
                }}
            />
            <Input
                placeholder="Descripcion"
                multiline ={true}
                inputContainerStyle={styles.textArea}
                onChange= {e => setPlaceDescription(e.nativeEvent.text)}
            />


        </View>
    )
}

function Map(props){
    const { isVisibleMap, setIsVisibleMap, setLocationPlace, toastRef } = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
     (async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.LOCATION
        );
        const statusPermissions = resultPermissions.permissions.location.status;

        if( statusPermissions !== "granted" ){
            toastRef.current.show(
                "Tienes que aceptar los permisos de localizacion para crear un nuevo lugar",
                 3000
            );
        } else {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            });
        }
     })();
    }, []);

    const confirmLocation  = () => {
        setLocationPlace(location);
        toastRef.current.show("Localizacion guardada correctamente");
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible = {isVisibleMap} setIsVisible = {setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion= {location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />

                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                <Button title = "Guardar"
                    containerStyle={styles.viewMapBtnContainerSuccess}
                    buttonStyle={styles.viewBtnSuccess}
                    onPress={confirmLocation} 
                />
                <Button title = "Cancelar" 
                    containerStyle={styles.viewMapBtnContainerCancel}
                    buttonStyle={styles.viewBtnCancel}
                    onPress = {() => setIsVisibleMap(false)}
                />

                </View>
            </View>

        </Modal>
    );
}

function UploadImage(props){
    const { toastRef, imageSelected, setImageSelected } = props;
    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
            );
        if(resultPermission === "denied"){
            toastRef.current.show("Es necesario activar los permisos de la galeria, si los has rechazado activalos manualmente desde los ajustes", 
            3000
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if(result.cancelled){
                toastRef.current.show(
                "Has cerrado la galeria sin seleccionar ninguna imagen",
                2000
                );
            }else {
                setImageSelected([...imageSelected, result.uri]);
            }
        }
    };

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro de eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                       setImageSelected(
                           filter(imageSelected, (imageUrl) => imageUrl !== image)
                       );
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <ScrollView horizontal={true} style={styles.viewImage}>
            {size(imageSelected) < 10 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerStyleIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imageSelected, (imagePlace, index) => (
               <Avatar 
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imagePlace}}
                    onPress={() => removeImage(imagePlace)}
                />
            ))}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,

    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddPlace: {
        backgroundColor: "#ff1ff0",
        margin: 20,
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerStyleIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,

    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewBtnCancel : {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSuccess : {
        paddingRight: 5,
    },
    viewBtnSuccess : {
        backgroundColor: "#ff1ff0"
    }
})