import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { fetchMultipleCoinsData } from '../services/coinGeckoService';
import { LineChart } from 'react-native-chart-kit';

interface SignedInScreenProps {
    route: {
        params: {
            email: string;
        };
    };
}

const screenWidth = Dimensions.get('window').width;

const transformDataForChart = (coinData: any) => {
    return Object.keys(coinData).map(coin => ({
        name: coin.charAt(0).toUpperCase() + coin.slice(1),
        price: coinData[coin].usd,
    }));
};

const SignedInScreen: React.FC<SignedInScreenProps> = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const { email } = route.params;

    // State to store coin data
    const [coinData, setCoinData] = useState<{ name: string; price: number }[]>([]); // You can refine the type based on the API response

    // Fetch coin data on component mount
    useEffect(() => {
        const loadMultipleCoinsData = async () => {
            try {
                const data = await fetchMultipleCoinsData(['bitcoin', 'ethereum', 'litecoin']);
                const transformedData = transformDataForChart(data)
                setCoinData(transformedData);
            } catch (error) {
                console.error('Error fetching coin data:', error);
            }
        };
        loadMultipleCoinsData();
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

            {/* Show coin data */}
            {coinData.length > 0 ? (
                <LineChart
                data={{
                    labels: coinData.map(coin => coin.name), // Labels for each coin
                    datasets: [
                        {
                            data: coinData.map(coin => coin.price), // Data for each coin's price
                        },
                    ],
                }}
                width={screenWidth - 40} // from react-native
                height={220}
                yAxisLabel="$"
                chartConfig={{
                    backgroundColor: '#000',
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
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
                        data={coinData} // You could pass more coins here in the future
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <Text>{item.name}: ${item.price}</Text>
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
