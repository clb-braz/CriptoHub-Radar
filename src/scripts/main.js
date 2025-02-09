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
        const card = document.querySelector('.fear-greed-card');
        const gaugeCover = card.querySelector('.gauge-cover');
        const gaugeStatus = card.querySelector('.fear-greed-status');
        const gaugeFill = card.querySelector('.gauge-fill');
        
        if (!data) {
            gaugeCover.textContent = '--';
            gaugeStatus.textContent = 'Erro ao carregar dados';
            return;
        }

        const value = parseInt(data.value);
        gaugeCover.textContent = value;
        
        // Calcula a rotação do medidor (180 graus é o máximo para o semicírculo)
        const rotation = (value / 100) * 180;
        gaugeFill.style.transform = `rotate(${rotation}deg)`;
        
        // Define o status e a cor com base no índice
        let status = '';
        let statusClass = '';
        let emoji = '';
        
        if (value <= 20) {
            status = 'Medo Extremo';
            statusClass = 'status-extreme-fear';
            emoji = '😨';
        } else if (value <= 40) {
            status = 'Medo';
            statusClass = 'status-fear';
            emoji = '😟';
        } else if (value <= 60) {
            status = 'Neutro';
            statusClass = 'status-neutral';
            emoji = '😐';
        } else if (value <= 80) {
            status = 'Ganância';
            statusClass = 'status-greed';
            emoji = '🤑';
        } else {
            status = 'Ganância Extrema';
            statusClass = 'status-extreme-greed';
            emoji = '🚀';
        }
        
        gaugeStatus.textContent = `${status} ${emoji}`;
        gaugeStatus.className = `fear-greed-status ${statusClass}`;
    },

    updateLastUpdateTime() {
        state.lastUpdate = new Date();
    }
};

// Modal de IA & Blockchain
const aiBlockchainModal = {
    modal: null,
    card: null,
    closeBtn: null,
    updateInterval: null,

    init() {
        this.modal = document.getElementById('ai-blockchain-modal');
        this.card = document.getElementById('ai-blockchain-card');
        this.closeBtn = this.modal.querySelector('.close-modal');
        
        // Event Listeners
        this.card.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Inicializa a atualização automática
        this.startAutoUpdate();
    },

    async openModal() {
        this.modal.style.display = 'flex';
        await this.fetchAIBlockchainData();
    },

    closeModal() {
        this.modal.style.display = 'none';
    },

    startAutoUpdate() {
        // Atualiza a cada 10 minutos
        this.updateInterval = setInterval(() => {
            if (this.modal.style.display === 'flex') {
                this.fetchAIBlockchainData();
            }
        }, 600000);
    },

    async fetchAIBlockchainData() {
        try {
            const response = await fetch(
                `${CONFIG.COINGECKO_API}/coins/markets?vs_currency=usd&category=ai-big-data&order=market_cap_desc&per_page=50&page=1&sparkline=false`
            );
            
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            this.updateTable(data);
        } catch (error) {
            console.error('Erro ao buscar dados de IA & Blockchain:', error);
            document.getElementById('crypto-table').innerHTML = `
                <tr>
                    <td colspan="6">Erro ao carregar dados. Tente novamente mais tarde.</td>
                </tr>
            `;
        }
    },

    updateTable(data) {
        const tableBody = document.getElementById('crypto-table');
        tableBody.innerHTML = '';

        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <img src="${crypto.image}" alt="${crypto.name}" width="20" height="20" style="vertical-align: middle; margin-right: 8px;">
                    ${crypto.name} (${crypto.symbol.toUpperCase()})
                </td>
                <td>$${crypto.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</td>
                <td class="${crypto.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}">
                    ${crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>$${(crypto.market_cap / 1e9).toFixed(2)}B</td>
                <td>$${(crypto.total_volume / 1e6).toFixed(2)}M</td>
            `;
            tableBody.appendChild(row);
        });
    }
};

// Modal de Real World Assets
const rwaModal = {
    modal: null,
    card: null,
    closeBtn: null,
    updateInterval: null,

    init() {
        this.modal = document.getElementById('rwa-modal');
        this.card = document.getElementById('rwa-card');
        this.closeBtn = this.modal.querySelector('.close-modal');
        
        // Event Listeners
        this.card.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Inicializa a atualização automática
        this.startAutoUpdate();
    },

    async openModal() {
        this.modal.style.display = 'flex';
        await this.fetchRWAData();
    },

    closeModal() {
        this.modal.style.display = 'none';
    },

    startAutoUpdate() {
        // Atualiza a cada 10 minutos
        this.updateInterval = setInterval(() => {
            if (this.modal.style.display === 'flex') {
                this.fetchRWAData();
            }
        }, 600000);
    },

    async fetchRWAData() {
        try {
            const response = await fetch(
                `${CONFIG.COINGECKO_API}/coins/markets?vs_currency=usd&category=real-world-assets&order=market_cap_desc&per_page=50&page=1&sparkline=false`
            );
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Nenhuma criptomoeda encontrada na categoria RWA.");
            }
            
            this.updateTable(data);
        } catch (error) {
            console.error('Erro ao buscar dados de Real World Assets:', error);
            document.getElementById('rwa-table').innerHTML = `
                <tr>
                    <td colspan="6">
                        <div style="color: #ff4444; padding: 1rem;">
                            Erro ao carregar dados. Tente novamente mais tarde.<br>
                            <small>${error.message}</small>
                        </div>
                    </td>
                </tr>
            `;
        }
    },

    updateTable(data) {
        const tableBody = document.getElementById('rwa-table');
        tableBody.innerHTML = '';

        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            
            // Formata os números para melhor legibilidade
            const price = crypto.current_price.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 8 
            });
            
            const marketCap = crypto.market_cap >= 1e9 
                ? `${(crypto.market_cap / 1e9).toFixed(2)}B` 
                : `${(crypto.market_cap / 1e6).toFixed(2)}M`;
                
            const volume = crypto.total_volume >= 1e9 
                ? `${(crypto.total_volume / 1e9).toFixed(2)}B` 
                : `${(crypto.total_volume / 1e6).toFixed(2)}M`;

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <img src="${crypto.image}" alt="${crypto.name}" width="20" height="20" 
                         style="vertical-align: middle; margin-right: 8px;">
                    ${crypto.name} 
                    <span style="color: #888; font-size: 0.9em;">${crypto.symbol.toUpperCase()}</span>
                </td>
                <td>$${price}</td>
                <td class="${crypto.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}">
                    ${crypto.price_change_percentage_24h ? crypto.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'}
                </td>
                <td>$${marketCap}</td>
                <td>$${volume}</td>
            `;
            
            // Adiciona hover effect na linha
            row.style.transition = 'background-color 0.3s ease';
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
            
            tableBody.appendChild(row);
        });
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

    // Initialize AI & Blockchain modal
    aiBlockchainModal.init();

    // Initialize RWA modal
    rwaModal.init();
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