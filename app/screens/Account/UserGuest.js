import React from "react";
import { StyleSheet, View, ScrollView, Image, Text } from "react-native";
import { Button } from "react-native-elements";
import { NavigationHelpersContext, useNavigation } from "@react-navigation/native";

export default function UserGuest() {
    const navigation = useNavigation();
    
    return( 
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image 
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Atrevete a descrubrir Huasteca Bonita</Text>
            <Text style={styles.description}>
                ¿Como describirías tu mejor experiencia de viajes? Busca y visualiza los mejores
                lugares para alojamiento de una forma sencilla, vota cual te ha gustado más y
                comenta como ha sido tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button 
                    title="Perfil"
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center",
    },
    description: {
        textAlign: "center",
        marginBottom: 20,

    },
    viewBtn:{
        flex: 1,
        alignItems: "center",
    },
    btnStyle: {
        backgroundColor: "#FF1F00",
    },
    btnContainer: {
        width: "70%",
    },
});