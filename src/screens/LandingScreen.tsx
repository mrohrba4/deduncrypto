import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types';
import logo from '../../assets/images/DedunCryptoLogo.png';
import * as Font from 'expo-font';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Exo 2': require('../../assets/fonts/Exo2-VariableFont_wght.ttf'),
            });
            setIsLoaded(true);
        };

        loadFonts();
    }, []);

    if (!isLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Image
                source={logo}
                style={styles.logo}
                resizeMode="contain"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')} // Navigate to Login
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Signup')} // Navigate to Sign Up
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    logo: {
        width: 350,
        height: 350,
        marginBottom: 20
    },
    button: {
        backgroundColor: 'rgba(30, 144, 255, 0.2)', 
        width: '80%', 
        paddingVertical: 15, 
        borderRadius: 30, 
        alignItems: 'center', 
        marginVertical: 10, 
    },
    buttonText: {
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold', 
    },
});

export default LandingScreen;
