import React, { useState } from 'react';
import { Alert, View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { deleteAccount, changePassword } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const AccountScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [newPassword, setNewPassword] = useState('');

    const handleLogout = () => {
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
            Alert.alert("Password Changed", "Your password has been successfully updated.");
            setNewPassword('');
        } catch (error: unknown) {
            const err = error as Error;
            Alert.alert("Error", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account Settings</Text>
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Delete Account" onPress={handleDeleteAccount} color="red" />
            
            <TextInput
                placeholder="Enter new password"
                value={newPassword}  // Link state to input
                onChangeText={setNewPassword}  // Handle text change
                secureTextEntry
                style={styles.input}
            />
            <Button title="Change Password" onPress={handleChangePassword} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { marginBottom: 15, borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
});

export default AccountScreen;
