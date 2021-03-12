import React, {useState} from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";

import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props){
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setformData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();


    const onSubmit =() => {
        if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword))
        {
            toastRef.current.show("Todos los campos son requeridos");
        }
        else if(!validateEmail(formData.email)){
            toastRef.current.show("el Email no es valido");
        } else if(formData.password !== formData.repeatPassword){
            toastRef.current.show("las contraseñas no son iguales");
        }else if(size(formData.password) < 6){
            toastRef.current.show("las contraseñas son minimo 6 caraceres");
        }else{
            setLoading(true);
            
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then(() =>{
                setLoading(false);
                navigation.navigate("account");
            })
            .catch(() =>{
                setLoading(false);
                toastRef.current.show("El correo ya esta en uso, pruebe con otro");
            })
        }
    };

    const onChange = (e, type) => {
        setformData({ ...formData, [type]: e.nativeEvent.text});
    };


    return(
        <View style={styles.formContainer}>
            <Input
                placeholder= "Email"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={
                            styles.iconRight
                        }
                    />
                }
            />
            <Input 
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "password")}
                password = {true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={
                            styles.iconRight
                        }
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                password= {true}
                secureTextEntry={showPassword ? false : true}
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "repeatPassword")}
                password={true}
                secureTextEntry={showRepeatPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={
                            styles.iconRight
                        }
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
                password= {true}
                secureTextEntry={showRepeatPassword ? false : true}
            /> 
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle= {styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Creando tu cuenta"/>
        </View>
    );
}

function defaultFormValue(){
    return{
        email: "",
        password: "",
        repeatPassword:"",
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#FF1F00",
    },
    iconRight:{
        color: "#c1c1c1",
    },
});