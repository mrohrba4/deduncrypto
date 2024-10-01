import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { login } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import logo from '../../assets/images/DedunCryptoLogo.png';


// Define custom error:
interface FirebaseError extends Error {
    code: string;
    message: string;
  }

  const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');

    const handleLogin = async () => {
        try {
            const user = await login(email, password);
            
            if (user && user.email) {
                const userEmail = user.email;
                navigation.navigate('SignIn', { email: userEmail });
            } else {
                throw new Error("Login Failed: User email not available.");
            }
        } catch (error) {
            const firebaseError = error as FirebaseError;
            setError(firebaseError.message);
            console.error('Login error:', firebaseError.message); // Log the error for debugging
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                placeholder="Email"
                placeholderTextColor="#ffffff"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#ffffff"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin} // Navigate to Login
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )

  }

  const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',  
        padding: 20,
        backgroundColor: '#000', 
    },
    title: { 
        fontSize: 24, 
        marginBottom: 20 
    },
    logo: {
        width: 350,
        height: 350,
        marginBottom: 20
    },
    input: { 
        marginBottom: 15,
        width: '80%', 
        borderBottomWidth: 1, 
        borderColor: '#ccc', 
        padding: 10,
        backgroundColor: '#1e1e1e',
        color: '#FFFFFF',
        textAlign: 'center',
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
    error: { 
        color: 'red', 
        marginBottom: 15 
    },
});

  export default LoginScreen;