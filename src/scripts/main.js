// Constants and Configuration
const CONFIG = {
    API_BASE_URL: 'https://api.coingecko.com/api/v3',
    REFRESH_INTERVAL: 60000, // 1 minute
    DEFAULT_CURRENCY: 'usd',
    TOP_COINS_LIMIT: 10
};

// State Management
const state = {
    marketData: [],
    selectedCurrency: CONFIG.DEFAULT_CURRENCY,
    lastUpdate: null
};

// API Service
const ApiService = {
    async getTopCoins() {
        try {
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/coins/markets?vs_currency=${state.selectedCurrency}&order=market_cap_desc&per_page=${CONFIG.TOP_COINS_LIMIT}&sparkline=true`
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching top coins:', error);
            return [];
        }
    }
};

// UI Updates
const UI = {
    updateMarketData(data) {
        const marketDataContainer = document.querySelector('.market-data');
        if (!marketDataContainer) return;

        marketDataContainer.innerHTML = data.map(coin => `
            <div class="coin-card">
                <img src="${coin.image}" alt="${coin.name}" width="32" height="32">
                <div class="coin-info">
                    <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
                    <p class="price">$${coin.current_price.toLocaleString()}</p>
                    <p class="change ${coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                </div>
            </div>
        `).join('');
    },

    updateLastUpdateTime() {
        state.lastUpdate = new Date();
        // Você pode adicionar um elemento na UI para mostrar o último tempo de atualização
    }
};

// Event Handlers
function setupEventListeners() {
    // Adicione event listeners conforme necessário
    document.addEventListener('DOMContentLoaded', initialize);
}

// Main Functions
async function updateMarketData() {
    const data = await ApiService.getTopCoins();
    if (data.length > 0) {
        state.marketData = data;
        UI.updateMarketData(data);
        UI.updateLastUpdateTime();
    }
}

function startDataRefresh() {
    // Atualização inicial
    updateMarketData();
    
    // Configurar atualização periódica
    setInterval(updateMarketData, CONFIG.REFRESH_INTERVAL);
}

function initialize() {
    startDataRefresh();
}

// Initialize the application
setupEventListeners(); 