import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const SearchResultScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<StackNavigationProp>();
    const { query } = route.params;

    const [coinData, setCoinData] = useState(null);
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoinId = async () => {
            try {
                // Step 1: Fetch coin list to get the coin ID
                const listResponse = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
                const listData = await listResponse.json();
                const coin = listData.find(c => c.symbol.toLowerCase() === query.toLowerCase() || c.name.toLowerCase() === query.toLowerCase());

                if (!coin) {
                    throw new Error(`Coin with query "${query}" not found.`);
                }

                // Step 2: Fetch coin details
                const coinId = coin.id;
                const detailsResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                const detailsData = await detailsResponse.json();
                setCoinData(detailsData);

                // Step 3: Fetch 24-hour market chart data
                const marketChartResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`);
                const marketChartData = await marketChartResponse.json();

                // Get the current time and filter data for the last 6 hours (360 minutes)
                const currentTime = Date.now();
                const sixHoursAgo = currentTime - (6 * 60 * 60 * 1000); // 6 hours in milliseconds
                const filteredPrices = marketChartData.prices.filter(price => price[0] >= sixHoursAgo);
                
                // To reduce the number of points, select only a few (e.g., every 30 minutes)
                const step = Math.floor(filteredPrices.length / 12); // Adjust the denominator to control how many points you want
                const formattedData = filteredPrices.filter((_, index) => index % step === 0).map((price) => ({
                    x: new Date(price[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }), // Format to HH:MM AM/PM
                    y: price[1] // Price
                }));

                setPriceData(formattedData); // Set the formatted price data
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch coin data");
                setLoading(false);
            }
        };

        fetchCoinId();
    }, [query]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            contentContainerStyle={styles.contentContainer}
            style={styles.container}>
            <Text style={styles.title}>{coinData.name} ({coinData.symbol?.toUpperCase()})</Text>
            <Text style={styles.text}>Current Price: ${coinData.market_data?.current_price?.usd}</Text>

            <LineChart
                data={{
                    labels: priceData.map(item => item.x),
                    datasets: [
                        {
                            data: priceData.map(item => item.y),
                        },
                    ],
                }}
                width={screenWidth * 1}
                height={320}
                yAxisLabel="$"
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: '#000',
                    backgroundGradientFrom: '#001226',
                    backgroundGradientTo: '#000000',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 92, 191, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForLabels: {
                        fontSize: 6,
                    },
                    propsForDots: {
                        r: "3",
                        strokeWidth: "1",
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Return</Text>
            </TouchableOpacity>
        </ScrollView>

        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000000', // Match signed-in page colors
    },
    contentContainer: {
        justifyContent: 'center', // Align items in the content container
        alignItems: 'center', // Align items in the content container
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: '#ccc',
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
export default SearchResultScreen;