import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { signUp } from '../services/authService';

interface FirebaseError extends Error {
    code: string;
    message: string;

}

const SignupScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            setError('');
            navigation.navigate('SignIn');
        } catch (error) {
            const firebaseError = error as FirebaseError;
            setError(firebaseError.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button title="Sign Up" onPress={handleSignUp} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { marginBottom: 15, borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
    error: { color: 'red', marginBottom: 15 },
  });
  export default SignupScreen;