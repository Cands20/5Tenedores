import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Places/Restaurants";
import AddPlace from "../screens/Places/AddPlace";


const Stack = createStackNavigator();

export default function RestaurantsStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name= "restaurants"
            component={Restaurants}
            options={{title:"Lugares  "}}/>
            <Stack.Screen
            name="add-place"
            component={AddPlace}
            options={{title: "Añadir nuevo lugar"}}
            />
        </Stack.Navigator>

    );

}