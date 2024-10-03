import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { fetchMultipleCoinsData } from '../services/coinGeckoService';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';

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

    // Buy/sell states
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const [transactionAmount, setTransactionAmount] = useState<number>(0);
    const [balance, setBalance] = useState<number>(10000);
    const [coinData, setCoinData] = useState<{ name: string; price: number }[]>([]);
    const [portfolio, setPortfolio] = useState<{ name: string; amount: number }[]>([]);

    const handleSearch = (query: string) => {
        navigation.navigate('SearchResult', { query })
    };


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

    // Buying logic
    const handleBuy = () => {
        if (selectedCoin && transactionAmount > 0) {
            const coinPrice = coinData.find(coin => coin.name.toLowerCase() === selectedCoin.toLowerCase())?.price;
            if (coinPrice && balance >= transactionAmount * coinPrice) {
                setBalance(prevBalance => prevBalance -transactionAmount * coinPrice);
                setPortfolio(prevPortfolio => {
                    const existingAsset = prevPortfolio.find(asset => asset.name === selectedCoin);
                    if (existingAsset) {
                        return prevPortfolio.map(asset =>
                            asset.name === selectedCoin
                                ? { ... asset, amount: asset.amount + transactionAmount }
                                : asset
                        );
                    }
                    return [...prevPortfolio, { name: selectedCoin, amount: transactionAmount }];
                });
                setTransactionAmount(0);
            }
        }
    };

    // Selling logic
    const handleSell = () => {
        if (selectedCoin && transactionAmount > 0) {
            const existingAsset = portfolio.find(asset => asset.name === selectedCoin);
            const coinPrice = coinData.find(coin => coin.name.toLowerCase() === selectedCoin.toLowerCase())?.price;
            if (existingAsset && coinPrice && existingAsset.amount >= transactionAmount) {
                setBalance(prevBalance => prevBalance + transactionAmount * coinPrice);
                setPortfolio(prevPortfolio =>
                    prevPortfolio.map(asset =>
                        asset.name === selectedCoin
                            ? { ...asset, amount: asset.amount - transactionAmount }
                            : asset
                    )
                );
                setTransactionAmount(0);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Welcome message */}
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.message}>{email}</Text>

            {/* User Functions */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Account')}>
                <Text style={styles.buttonText}>Account</Text>
            </TouchableOpacity>

            {/* Balance display */}
            <Text style={styles.balanceText}>Balance: ${balance.toFixed(2)}</Text>
            
            {/* Buy/Sell section */}
            <Text style={styles.sectionTitle}>Buy/Sell Cryptocurrencies</Text>

            {/* Coin Selection */}
            <TextInput
                placeholder="Enter Coin (e.g., Bitcoin)"
                value={selectedCoin || ''}
                onChangeText={setSelectedCoin}
                style={styles.input}
                placeholderTextColor="#888"
            />

            {/* Transaction Amount */}
            <TextInput
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={transactionAmount.toString()}
                onChangeText={text => setTransactionAmount(Number(text))}
                style={styles.input}
                placeholderTextColor="#888"
            />

            {/* Buy/Sell Buttons */}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.buyButton]} onPress={handleBuy}>
                        <Text style={styles.buttonText}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.sellButton]} onPress={handleSell}>
                        <Text style={styles.buttonText}>Sell</Text>
                    </TouchableOpacity>
                </View>


            {/* Portfolio Section */}
            <Text style={styles.sectionTitle}>Your Portfolio</Text>
            <View style={styles.assetsPlaceholder}>
                {portfolio.length > 0 ? (
                    <FlatList
                        data={portfolio}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <Text style={styles.assetsText}>
                                {item.name}: {item.amount} units
                            </Text>
                        )}
                    />
                    ) : (
                        <Text style={styles.assetsText}>You don't own any assets yet.</Text>
                )}
            </View>

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
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
    balanceText: {
        fontSize: 20,
        marginBottom: 15,
        color: '#ffffff',
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        color: '#00acee',
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
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginVertical: 10,
    },
});

export default SignedInScreen;
