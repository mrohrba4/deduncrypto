import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, Dimensions, TouchableOpacity } from 'react-native';
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

    const handleSearch = (query: string) => {
        navigation.navigate('SearchResult', { query })
    };

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
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Account')}>
                <Text style={styles.buttonText}>Account</Text>
            </TouchableOpacity>
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
                    backgroundGradientFrom: '#001226',
                    backgroundGradientTo: '#000000',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 92, 191, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                        paddingLeft: 20,
                        marginLeft: 20,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    padding: 15,
                }}
            />
            ) : (
                <Text>Loading coin data...</Text>
            )}
            {/* Search bar */}
            <Text style={styles.message}>Search currencies here:</Text>
            <TextInput
                placeholder="Search for Cryptocurrencies"
                value={searchQuery}
                onSubmitEditing={(event) => handleSearch(event.nativeEvent.text)}
                onChangeText={setSearchQuery}
                style={styles.input}
                placeholderTextColor="#888"
            />

            {/* Assets List section */}
            <View style={styles.assetsPlaceholder}>
                <Text style={styles.assetsText}>Assets List Placeholder</Text>
                {/* You could render a list of assets here */}
                {coinData && (
                    <FlatList
                        data={coinData} // You could pass more coins here in the future
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <Text style={styles.assetsText}>{item.name}: ${item.price}</Text>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: '#000000',
    },
    title: { 
        fontSize: 24, 
        marginBottom: 20,
        color: '#ffffff', 
    },
    message: { 
        fontSize: 18, 
        marginBottom: 20,
        color: '#cfcfcf',
    },
    input: {  
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#333',
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
        marginBottom: 15
    },
    chartPlaceholder: {
        width: '100%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#1e1e1e',
        marginBottom: 20,
        alignItems: 'center',
    },
    assetsPlaceholder: {
        width: '100%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
        alignItems: 'center',
    },
    assetsText: {
        color: '#ffffff',
        fontSize: 16,
    },
    coinInfo: {
        marginVertical: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 10,
        width: '90%',
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
    },
    button: {
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
    }
});

export default SignedInScreen;
