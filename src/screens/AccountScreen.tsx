import React, { useState } from 'react';
import { Alert, View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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

            {/* Logout Button */}
            <Text style={styles.label}>Logout</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            

            {/* Delete Account Button */}
            <Text style={styles.label}>Delete Account</Text>
            <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
            
            {/* Change Password Button */}
            <Text style={styles.label}>Change Password</Text>
            <TextInput
                placeholder="Enter new password"
                value={newPassword}  // Link state to input
                onChangeText={setNewPassword}  // Handle text change
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
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
        marginBottom: 20,
        color: '#ffffff',
        textDecorationLine: 'underline',  
    },
    label: { 
        fontSize: 16, 
        marginBottom: 5,
        color: '#ffffff',
        textDecorationLine: 'underline', 
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
        marginBottom: 30, 
    },
    buttonText: {
        color: 'white', 
        fontSize: 13, 
    },
});

export default AccountScreen;
