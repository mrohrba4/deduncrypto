import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

interface SignedInScreenProps {
    route: {
        params: {
            email: string;
        };
    };
}


const SignedInScreen: React.FC<SignedInScreenProps> = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const { email } = route.params;


    return (
        <View style={styles.container}>
            {/* Welcome message */}
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.message}>{email}</Text>

            {/* User Functions */}
            <View>
                <Button title="Account" onPress={() => navigation.navigate('Account')}/>
            </View>

            {/* Portfolio chart section */}
            <View style={styles.chartPlaceholder}>
                <Text>Portfolio Chart Placeholder</Text>
            </View>

            {/* Search bar */}
            <TextInput
                placeholder="Search for Crypocurrencies"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
            />

            {/* Assets List section */}
            <View style={styles.assetsPlaceholder}>
                <Text>Assets List Placeholder</Text>
            </View>
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
    },
    chartPlaceholder: {
        width: '100%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        alignItems: 'center',
    },
    assetsPlaceholder: {
        width: '100%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    }
});
export default SignedInScreen;