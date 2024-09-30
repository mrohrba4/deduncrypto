import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { login } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';


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
            <Text style={styles.title}>Login</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                placeholder="Email"
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
            />
            <Button title="Login" onPress={handleLogin}/>
        </View>
    )

  }

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { marginBottom: 15, borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
    error: { color: 'red', marginBottom: 15 },
});

  export default LoginScreen;