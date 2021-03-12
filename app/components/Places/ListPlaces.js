import React from 'react'
import { 
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'
import { Image } from "react-native-elements";
import { size } from "lodash";


export default function (props) {
    const { places } = props;

    return (
        <View>
            {size(places) > 0 ? (
                <FlatList 
                    data={ places }
                    renderItem={(place) => <Place place={ place } />}
                    keyExtractor = {(item, index)=> index.toString()}
                />
            ): (
                <View style={ styles.loaderPlaces }>
                    <ActivityIndicator size="large" />
                    <Text>Cargando Lugares</Text>
                </View>
            )}
        </View>
    )
}

function Place(props){
    const { place } = props;
    const { images } = place.item;
    const imagePlace = images[0];

    const goPlace = () => {
        console.log("OK");
    }

    return (
        <TouchableOpacity onPress={ goPlace }>
            <View style={styles.viewPlace}>
                <View style={styles.viewPlaceImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={ <ActivityIndicator color="#fff"/> }
                        source={
                            imagePlace
                            ? { uri: imagePlace}
                            : require("../../../assets/img/no-image.png")
                        }
                        
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    loaderPlaces: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    viewPlace: {
        flexDirection: "row",
        margin: 10,
    },
    viewPlaceImage: {
        marginRight: 15,
    },
})
