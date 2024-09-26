import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { deleteAccount, changePassword } from '../services/authService';


const SignedInScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [newPassword, setNewPassword] = useState('');

    const handleLogout = () => {
        // Logout functions here.
        navigation.navigate('Login');
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: async () => {
                    try {
                        await deleteAccount();
                        Alert.alert("Account Deleted", "Your account has been successfully deleted.");
                        navigation.navigate('Login');
                    } catch (error: unknown) {
                        const err = error as Error;
                        Alert.alert("Error", err.message);
                    }
                }}
            ]
        );
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
         }

         try {
            await changePassword(newPassword);
            Alert.alert("Password Changed", "You password has been successfully updated.");
            setNewPassword('');
         } catch (error: unknown) {
            const err = error as Error;
            Alert.alert("Error", err.message);
         }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.message}>You are now signed in.</Text>
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Delete Account" onPress={handleDeleteAccount} color="red" />

            <TextInput
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Change Password" onPress={handleChangePassword} color="blue" />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    message: { fontSize: 18, marginBottom: 20 },
    input: {  
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15
    }
});
export default SignedInScreen;