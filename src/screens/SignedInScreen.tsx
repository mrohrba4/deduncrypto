import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { fetchCoinData } from '../services/coinGeckoService';

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

    // State to store coin data
    const [coinData, setCoinData] = useState<any>(null); // You can refine the type based on the API response

    // Fetch coin data on component mount
    useEffect(() => {
        const loadCoinData = async () => {
            try {
                const data = await fetchCoinData('bitcoin');
                setCoinData(data);
            } catch (error) {
                console.error('Error fetching coin data:', error);
            }
        };
        loadCoinData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Welcome message */}
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.message}>{email}</Text>

            {/* User Functions */}
            <View>
                <Button title="Account" onPress={() => navigation.navigate('Account')} />
            </View>

            {/* Portfolio chart section */}
            <View style={styles.chartPlaceholder}>
                <Text>Portfolio Chart Placeholder</Text>
            </View>

            {/* Show coin data */}
            {coinData ? (
                <View style={styles.coinInfo}>
                    <Text>Bitcoin Price: ${coinData.usd}</Text>
                    <Text>Market Cap: ${coinData.usd_market_cap}</Text>
                    <Text>24h Volume: ${coinData.usd_24h_vol}</Text>
                    <Text>24h Change: {coinData.usd_24h_change}%</Text>
                    <Text>Last Updated: {new Date(coinData.last_updated_at * 1000).toLocaleString()}</Text>
                </View>
            ) : (
                <Text>Loading coin data...</Text>
            )}

            {/* Search bar */}
            <TextInput
                placeholder="Search for Cryptocurrencies"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
            />

            {/* Assets List section */}
            <View style={styles.assetsPlaceholder}>
                <Text>Assets List Placeholder</Text>
                {/* You could render a list of assets here */}
                {coinData && (
                    <FlatList
                        data={[{ id: 'bitcoin', ...coinData}]} // You could pass more coins here in the future
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Text>{item.id}: ${item.usd}</Text>
                        )}
                    />
                )}
            </View>
        </View>
    );
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
    },
    coinInfo: {
        marginVertical: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: '90%',
        backgroundColor: '#f9f9f9'
    },
});

export default SignedInScreen;
