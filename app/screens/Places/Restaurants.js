import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text} from "react-native";
import { Icon } from "react-native-elements";
import {firebaseApp} from "../../utils/firebase";
import ListPlaces from "../../components/Places/ListPlaces";

import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Restaurant(props){
    const { navigation }  = props;
    const [user, setUser] = useState(null);
    const [places, setPlaces] = useState([]);
    const [totalPlaces, setTotalPlaces] = useState(0);
    const [startPlace, setStartPlace] = useState(null);
    const limitPlace = 4;
    
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo)=>{
            setUser(userInfo);
        });
    }, []); 

    useEffect(() => {
        db.collection("places").get().then((snap) =>{
            setTotalPlaces(snap.size);
        });
        const resultPlaces = [];

        db.collection("places")
            .orderBy("createAt", "desc")
            .limit(limitPlace)
            .get().
            then((response) =>{
                setStartPlace(response.docs[response.docs.length - 1]);

                response.forEach((doc)=>{
                    const place = doc.data();
                    place.id = doc.id;
                    resultPlaces.push(place);
                });
                setPlaces(resultPlaces);
            });

    }, []);

    return(
        <View style={styles.viewBody}>
            <ListPlaces 
                places = {places}
            />
            {user && (
                <Icon 
                    reverse
                    type = "material-community"
                    name="plus"
                    color="#ff1ff0"
                    containerStyle={styles.btnContainer}
                    onPress={ () => navigation.navigate("add-place")}
                />
            )}
        </View>
    );
}

// const Admin = () => {
//     deb
// }

const styles = StyleSheet.create({
    viewBody: {
        flex : 1,
        backgroundColor: "#fff",
    },
    btnContainer : {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
    },
});