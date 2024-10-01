import axios from 'axios';


export const fetchCoinData = async (coinId: string) => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`);
        return response.data[coinId];
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error.message || error)
        throw new Error('Failed to fectch coin data');
    }
};

export const fetchMultipleCoinsData = async (coinIds: string[]) => {
    try {
        const ids = coinIds.join(',');
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching multiple coins data', error);
        throw error;
    }
};