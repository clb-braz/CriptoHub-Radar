// Constants and Configuration
const CONFIG = {
    COINGECKO_API: 'https://api.coingecko.com/api/v3',
    FEAR_GREED_API: 'https://api.alternative.me/fng/',
    REFRESH_INTERVAL: 60000, // 1 minute
    DEFAULT_CURRENCY: 'usd',
    TOP_COINS_LIMIT: 10
};

// Category Configurations with icons and descriptions
const CATEGORIES = {
    ai: {
        title: 'IA & Blockchain',
        icon: 'fa-robot',
        description: 'Projetos que combinam IA e Blockchain',
        coins: ['ocean-protocol', 'fetch-ai', 'singularitynet', 'numeraire', 'graph']
    },
    rwa: {
        title: 'Real World Assets',
        icon: 'fa-building',
        description: 'Tokens lastreados em ativos reais',
        coins: ['maker', 'centrifuge', 'ondo-finance', 'real-world-assets', 'tangible']
    },
    defi: {
        title: 'DeFi',
        icon: 'fa-chart-line',
        description: 'Finanças descentralizadas',
        coins: ['aave', 'uniswap', 'curve-dao-token', 'compound-governance-token', 'maker']
    },
    staking: {
        title: 'Staking',
        icon: 'fa-piggy-bank',
        description: 'Projetos com staking ativo',
        coins: ['ethereum', 'cardano', 'solana', 'polkadot', 'cosmos']
    },
    gems: {
        title: 'Gemas & Low Caps',
        icon: 'fa-gem',
        description: 'Projetos promissores de baixa capitalização',
        coins: ['injective', 'render-token', 'fetch-ai', 'immutable', 'sui']
    },
    memes: {
        title: 'Memecoins',
        icon: 'fa-rocket',
        description: 'Tokens baseados em memes',
        coins: ['dogecoin', 'shiba-inu', 'pepe', 'floki', 'bonk']
    }
};

// State Management
const state = {
    marketData: {},
    fearGreedIndex: null,
    lastUpdate: null,
    activeCard: null
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

    async fetchCoinDetails(coinId) {
        try {
            const response = await fetch(`${CONFIG.COINGECKO_API}/coins/${coinId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching coin details:', error);
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
            const coins = CATEGORIES[category].coins.join(',');
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
    async updateCard(category, data) {
        const card = document.querySelector(`[data-category="${category}"]`);
        if (!card) return;

        const content = card.querySelector('.card-content');
        if (!data) {
            content.innerHTML = '<div class="error-message">Erro ao carregar dados</div>';
            return;
        }

        const categoryInfo = CATEGORIES[category];
        const coins = categoryInfo.coins;
        
        // Create crypto list container
        const cryptoList = document.createElement('div');
        cryptoList.className = 'crypto-list';

        // Add coins to the list
        for (const coinId of coins) {
            const coinData = data[coinId];
            if (!coinData) continue;

            const price = coinData[CONFIG.DEFAULT_CURRENCY];
            const change = coinData[`${CONFIG.DEFAULT_CURRENCY}_24h_change`];
            const changeClass = change >= 0 ? 'positive-change' : 'negative-change';

            // Fetch additional coin details for image
            const details = await ApiService.fetchCoinDetails(coinId);
            const image = details?.image?.thumb || '';

            const cryptoItem = document.createElement('div');
            cryptoItem.className = 'crypto-item';
            cryptoItem.innerHTML = `
                <div class="crypto-name">
                    ${image ? `<img src="${image}" alt="${coinId}">` : ''}
                    <span>${coinId}</span>
                </div>
                <div class="crypto-price">
                    <span>$${price.toLocaleString()}</span>
                    <span class="${changeClass}">${change.toFixed(2)}%</span>
                </div>
            `;
            cryptoList.appendChild(cryptoItem);
        }

        // Update card content
        content.innerHTML = '';
        content.appendChild(cryptoList);

        // Add click event to card
        card.addEventListener('click', () => {
            if (state.activeCard && state.activeCard !== card) {
                state.activeCard.classList.remove('active');
            }
            card.classList.toggle('active');
            state.activeCard = card;
        });
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Close active card when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cyber-card') && state.activeCard) {
            state.activeCard.classList.remove('active');
            state.activeCard = null;
        }
    });

    // Initial data load
    updateMarketData();
    setInterval(updateMarketData, CONFIG.REFRESH_INTERVAL);

    // Initialize TradingView widget
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
});

// Main update function
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