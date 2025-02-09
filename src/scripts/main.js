// Constants and Configuration
const CONFIG = {
    COINGECKO_API: 'https://api.coingecko.com/api/v3',
    FEAR_GREED_API: 'https://api.alternative.me/fng/',
    REFRESH_INTERVAL: 60000, // 1 minute
    DEFAULT_CURRENCY: 'usd',
    TOP_COINS_LIMIT: 10
};

// Category Configurations
const CATEGORIES = {
    ai: ['ocean-protocol', 'fetch-ai', 'singularitynet', 'numeraire', 'graph'],
    rwa: ['maker', 'centrifuge', 'ondo-finance', 'real-world-assets', 'tangible'],
    defi: ['aave', 'uniswap', 'curve-dao-token', 'compound-governance-token', 'maker'],
    staking: ['ethereum', 'cardano', 'solana', 'polkadot', 'cosmos'],
    gems: ['injective', 'render-token', 'fetch-ai', 'immutable', 'sui'],
    memes: ['dogecoin', 'shiba-inu', 'pepe', 'floki', 'bonk']
};

// State Management
const state = {
    marketData: {},
    fearGreedIndex: null,
    lastUpdate: null
};

// API Service
const ApiService = {
    async fetchCoinData(coinId) {
        try {
            const response = await fetch(
                `${CONFIG.COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=${CONFIG.DEFAULT_CURRENCY}&include_24h_change=true&include_market_cap=true`
            );
            
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching coin data:', error);
            return null;
        }
    },

    async fetchFearGreedIndex() {
        try {
            const response = await fetch(CONFIG.FEAR_GREED_API);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.data[0];
        } catch (error) {
            console.error('Error fetching Fear & Greed Index:', error);
            return null;
        }
    },

    async fetchCategoryData(category) {
        try {
            const coins = CATEGORIES[category].join(',');
            const data = await this.fetchCoinData(coins);
            return data;
        } catch (error) {
            console.error(`Error fetching ${category} data:`, error);
            return null;
        }
    }
};

// UI Updates
const UI = {
    updateCard(category, data) {
        const card = document.querySelector(`[data-category="${category}"]`);
        if (!card) return;

        const content = card.querySelector('.card-content');
        if (!data) {
            content.innerHTML = '<div class="error-message">Erro ao carregar dados</div>';
            return;
        }

        const coins = CATEGORIES[category];
        const html = coins.map(coinId => {
            const coinData = data[coinId];
            if (!coinData) return '';

            const price = coinData[CONFIG.DEFAULT_CURRENCY];
            const change = coinData[`${CONFIG.DEFAULT_CURRENCY}_24h_change`];
            const changeClass = change >= 0 ? 'positive-change' : 'negative-change';

            return `
                <div class="coin-info">
                    <span class="coin-name">${coinId}</span>
                    <span class="coin-price">$${price.toLocaleString()}</span>
                    <span class="coin-change ${changeClass}">${change.toFixed(2)}%</span>
                </div>
            `;
        }).join('');

        content.innerHTML = html;
    },

    updateFearGreedIndex(data) {
        const valueElement = document.getElementById('fearGreedValue');
        const gaugeElement = document.getElementById('fearGreedGauge');
        
        if (!data) {
            valueElement.textContent = 'N/A';
            return;
        }

        valueElement.textContent = data.value;
        
        // Update gauge color based on value
        let color;
        if (data.value <= 20) color = '#FF0000';      // Extreme Fear
        else if (data.value <= 40) color = '#FF8C00';  // Fear
        else if (data.value <= 60) color = '#FFD700';  // Neutral
        else if (data.value <= 80) color = '#90EE90';  // Greed
        else color = '#008000';                        // Extreme Greed

        gaugeElement.style.setProperty('--gauge-value', `${data.value}%`);
        gaugeElement.style.setProperty('--gauge-color', color);
    },

    updateLastUpdateTime() {
        state.lastUpdate = new Date();
    }
};

// TradingView Chart
function initTradingViewWidget() {
    new TradingView.widget({
        "width": "100%",
        "height": 400,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "br",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "technicalChart"
    });
}

// Main Functions
async function updateMarketData() {
    // Update Fear & Greed Index
    const fearGreedData = await ApiService.fetchFearGreedIndex();
    UI.updateFearGreedIndex(fearGreedData);

    // Update each category
    for (const category in CATEGORIES) {
        const data = await ApiService.fetchCategoryData(category);
        UI.updateCard(category, data);
    }

    UI.updateLastUpdateTime();
}

function startDataRefresh() {
    updateMarketData();
    setInterval(updateMarketData, CONFIG.REFRESH_INTERVAL);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    startDataRefresh();
    initTradingViewWidget();
}); 