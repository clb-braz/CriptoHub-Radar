// Constants and Configuration
const CONFIG = {
    COINGECKO_API: 'https://api.coingecko.com/api/v3',
    FEAR_GREED_API: 'https://api.alternative.me/fng/',
    REFRESH_INTERVAL: 60000, // 1 minute
    DEFAULT_CURRENCY: 'usd',
    TOP_COINS_LIMIT: 10,
    FEAR_GREED_UPDATE_INTERVAL: 60000 // 60 seconds
};

// Category Configurations with icons and descriptions
const CATEGORIES = {
    infrastructure: {
        title: 'INFRAESTRUTURA E ESCALABILIDADE',
        icon: 'fa-layer-group',
        subcategories: [
            { title: 'Plataforma de Contratos Inteligentes', description: 'Execução automática e segura de contratos digitais sem intermediários.' },
            { title: 'Camada 1 (L1)', description: 'Blockchain base que sustenta ecossistemas cripto completos.' },
            { title: 'Camada 2 (L2)', description: 'Soluções escaláveis para otimizar redes blockchain, reduzindo taxas e tempo de transação.' },
            { title: 'Rollups', description: 'Tecnologia para agrupar múltiplas transações e reduzir custos na blockchain.' },
            { title: 'SideChains', description: 'Blockchain paralelas que aumentam a escalabilidade e flexibilidade das redes principais.' },
            { title: 'Identidade Digital', description: 'Soluções blockchain para autenticação segura e descentralizada de usuários.' }
        ]
    },
    consensus: {
        title: 'CONSENSO E SEGURANÇA',
        icon: 'fa-shield-halved',
        subcategories: [
            { title: 'Proof of Work (PoW)', description: 'Validação de transações baseada em mineração para máxima segurança.' },
            { title: 'Proof of Stake (PoS)', description: 'Método de consenso eficiente, onde validadores garantem a segurança da rede.' },
            { title: 'Conhecimento Zero (ZK)', description: 'Verificações criptográficas que garantem privacidade e segurança em transações.' },
            { title: 'Privacy Blockchain', description: 'Criptomoedas e protocolos focados em anonimato e segurança de dados.' }
        ]
    },
    defi: {
        title: 'FINANÇAS DESCENTRALIZADAS (DEFI)',
        icon: 'fa-chart-line',
        subcategories: [
            { title: 'Finanças Descentralizadas (DeFi)', description: 'Protocolos financeiros sem intermediários, como empréstimos e yield farming.' },
            { title: 'Tokens de Staking Líquido', description: 'Alternativa para obter liquidez ao participar de staking sem bloquear ativos.' },
            { title: 'Formador Automático de Mercado (AMM)', description: 'Plataformas descentralizadas que facilitam a liquidez dos mercados cripto.' },
            { title: 'Stablecoins', description: 'Criptomoedas com preço estável, atreladas a moedas fiduciárias ou ativos.' },
            { title: 'Crypto-backed Stablecoins', description: 'Stablecoins lastreadas diretamente em criptomoedas para estabilidade e descentralização.' },
            { title: 'Farming de Rendimentos', description: 'Gerenciamento de staking para maximizar recompensas e juros em DeFi.' },
            { title: 'Perpétuos', description: 'Contratos futuros sem vencimento para negociação avançada no mercado cripto.' },
            { title: 'Derivados', description: 'Produtos financeiros cripto para negociação avançada, como opções e futuros.' }
        ]
    },
    tokenized: {
        title: 'ATIVOS TOKENIZADOS',
        icon: 'fa-coins',
        subcategories: [
            { title: 'Real World Assets (RWA)', description: 'Tokens lastreados em ativos reais, como imóveis, commodities e ações.' },
            { title: 'Tokens Bancados por Ativos', description: 'Criptomoedas respaldadas por commodities, imóveis e outros bens reais.' },
            { title: 'Tokenized Commodities', description: 'Ouro, prata, petróleo e outros ativos físicos transformados em tokens.' },
            { title: 'NFTs', description: 'Tokens não fungíveis representando arte digital, música e itens exclusivos.' },
            { title: 'Empreendimentos Tokenizados', description: 'Projetos de investimento imobiliário e negócios financiados via blockchain.' }
        ]
    },
    ai: {
        title: 'INTELIGÊNCIA ARTIFICIAL E INOVAÇÃO',
        icon: 'fa-robot',
        subcategories: [
            { title: 'Inteligência Artificial (IA)', description: 'Projetos que integram IA para otimizar operações na blockchain.' },
            { title: 'AI Agents', description: 'Plataformas que usam agentes de IA para automatizar transações e previsões.' },
            { title: 'AI Framework', description: 'Infraestrutura para desenvolvimento de modelos de inteligência artificial baseados em blockchain.' }
        ]
    },
    memes: {
        title: 'MEME COINS E CULTURA CRIPTO',
        icon: 'fa-face-grin-tears',
        subcategories: [
            { title: 'Meme Coins', description: 'Tokens inspirados em memes e cultura da internet, com alta volatilidade.' },
            { title: 'Dog-Themed Tokens', description: 'Tokens inspirados em cachorros, como Dogecoin e Shiba Inu.' },
            { title: 'Elon Musk-Inspired Tokens', description: 'Tokens baseados em tendências e menções de Elon Musk.' },
            { title: 'Frog-Themed Tokens', description: 'Tokens baseados em sapos e virais da cultura cripto.' }
        ]
    },
    gaming: {
        title: 'JOGOS E METAVERSO',
        icon: 'fa-gamepad',
        subcategories: [
            { title: 'Gaming Blockchain', description: 'Infraestrutura descentralizada para jogos Web3 e NFTs in-game.' },
            { title: 'Metaverso', description: 'Plataformas de realidade virtual interligadas à blockchain para experiências digitais.' },
            { title: 'Gaming Utility Tokens', description: 'Tokens utilizados como moedas dentro de ecossistemas de jogos blockchain.' },
            { title: 'Simulation Games', description: 'Projetos focados em simulação e realidade virtual dentro do blockchain.' }
        ]
    },
    transactions: {
        title: 'INFRAESTRUTURA DE TRANSAÇÕES',
        icon: 'fa-wallet',
        subcategories: [
            { title: 'Carteiras Digitais (Wallets)', description: 'Soluções para armazenar e transferir criptomoedas de forma segura.' },
            { title: 'Dex Aggregator', description: 'Plataformas que agregam liquidez de múltiplas DEXs para melhor preço de swap.' },
            { title: 'Corretora Descentralizada (DEX)', description: 'Exchanges sem custódia para negociação direta entre usuários.' },
            { title: 'Corretora Centralizada (CEX)', description: 'Exchanges tradicionais que oferecem serviços de negociação cripto-fiat.' }
        ]
    },
    rwa: {
        title: 'REAL WORLD ASSETS (RWA)',
        icon: 'fa-building-columns',
        subcategories: [
            { title: 'Tokenização de Imóveis', description: 'Como propriedades físicas estão sendo representadas em tokens.' },
            { title: 'Tokenização de Commodities', description: 'Ouro, prata, petróleo e outros ativos físicos convertidos em tokens.' },
            { title: 'Ações e Títulos Financeiros Tokenizados', description: 'A revolução dos mercados financeiros na blockchain.' },
            { title: 'Fundos de Investimento Descentralizados', description: 'Como RWA está moldando o futuro dos investimentos.' },
            { title: 'Stablecoins Lastreadas em Ativos', description: 'Moedas digitais apoiadas em commodities e ativos reais.' },
            { title: 'Regulação e Compliance', description: 'O cenário regulatório das RWAs pelo mundo.' },
            { title: 'Plataformas RWA Líderes', description: 'Protocolos como Ondo, Centrifuge, Maple Finance, entre outros.' },
            { title: 'Casos de Uso', description: 'Exemplos práticos de RWAs transformando o setor financeiro e imobiliário.' }
        ]
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
    async fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json',
                        ...options.headers
                    }
                });
                
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After') || 60;
                    throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                
                if (i === retries - 1) {
                    throw new Error(
                        error.message.includes('Rate limit') 
                            ? error.message 
                            : 'Falha ao conectar com a API. Por favor, verifique sua conexão e tente novamente.'
                    );
                }
                
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    },

    async fetchCoinData(coinId) {
        try {
            return await this.fetchWithRetry(
                `${CONFIG.COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=${CONFIG.DEFAULT_CURRENCY}&include_24h_change=true&include_market_cap=true`
            );
        } catch (error) {
            console.error('Error fetching coin data:', error);
            throw error;
        }
    },

    async fetchCoinDetails(coinId) {
        try {
            return await this.fetchWithRetry(`${CONFIG.COINGECKO_API}/coins/${coinId}`);
        } catch (error) {
            console.error('Error fetching coin details:', error);
            throw error;
        }
    },

    async fetchFearGreedIndex() {
        try {
            const response = await this.fetchWithRetry(CONFIG.FEAR_GREED_API, {
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response || !response.data || !response.data[0]) {
                throw new Error('Dados inválidos recebidos da API');
            }
            
            return {
                value: response.data[0].value,
                classification: response.data[0].value_classification,
                timestamp: response.data[0].timestamp,
                nextUpdate: response.data[0].time_until_update
            };
        } catch (error) {
            console.error('Error fetching Fear & Greed Index:', error);
            throw error;
        }
    },

    async fetchCategoryData(category) {
        try {
            const coins = CATEGORIES[category].coins.join(',');
            return await this.fetchCoinData(coins);
        } catch (error) {
            console.error(`Error fetching ${category} data:`, error);
            throw error;
        }
    }
};

// UI Updates
const UI = {
    updateCard(category) {
        const card = document.querySelector(`[data-category="${category}"]`);
        if (!card) return;

        const categoryInfo = CATEGORIES[category];
        const content = card.querySelector('.card-content');
        
        // Create content for subcategories
        const subcategoriesList = document.createElement('div');
        subcategoriesList.className = 'subcategories-list';
        
        categoryInfo.subcategories.forEach(sub => {
            const subItem = document.createElement('div');
            subItem.className = 'subcategory-item';
            subItem.innerHTML = `
                <h4>${sub.title}</h4>
                <p>${sub.description}</p>
            `;
            subcategoriesList.appendChild(subItem);
        });

        // Update card content
        content.innerHTML = '';
        content.appendChild(subcategoriesList);
    },

    async updateFearGreedIndex(data) {
        const valueElement = document.getElementById('fear-greed-value');
        const textElement = document.getElementById('fear-greed-text');
        const needleElement = document.getElementById('fear-greed-needle');
        
        if (!data) {
            valueElement.innerText = 'N/A';
            textElement.innerHTML = `
                <div style="color: #ff4444; text-align: center;">
                    <i class="fas fa-exclamation-circle"></i><br>
                    Erro ao carregar dados
                    <button onclick="window.updateFearGreedIndex()" 
                            style="display: block; margin: 0.5rem auto; padding: 0.5rem 1rem; 
                                   background: rgba(0, 102, 255, 0.2); border: 1px solid var(--accent-blue);
                                   color: var(--accent-blue); border-radius: 4px; cursor: pointer;
                                   transition: all 0.3s ease;">
                        <i class="fas fa-sync-alt"></i> Atualizar
                    </button>
                </div>
            `;
            return;
        }

        const value = parseInt(data.value);
        const currentValue = parseInt(valueElement.innerText) || 0;
        
        // Animação suave do valor
        const steps = 30;
        const stepValue = (value - currentValue) / steps;
        let currentStep = 0;
        
        const animate = () => {
            if (currentStep < steps) {
                currentStep++;
                const newValue = Math.round(currentValue + (stepValue * currentStep));
                valueElement.innerText = newValue;
                
                // Rotação suave do ponteiro (-90 a 90 graus)
                const rotation = (newValue / 100) * 180 - 90;
                needleElement.style.transform = `rotate(${rotation}deg)`;
                
                requestAnimationFrame(animate);
            } else {
                valueElement.innerText = value;
                const finalRotation = (value / 100) * 180 - 90;
                needleElement.style.transform = `rotate(${finalRotation}deg)`;
            }
        };
        
        requestAnimationFrame(animate);
        
        // Atualiza o texto e a classe de status
        let statusClass = '';
        let statusEmoji = '';
        
        if (value <= 20) {
            statusClass = 'status-extreme-fear';
            statusEmoji = '😨';
        } else if (value <= 40) {
            statusClass = 'status-fear';
            statusEmoji = '😟';
        } else if (value <= 60) {
            statusClass = 'status-neutral';
            statusEmoji = '😐';
        } else if (value <= 80) {
            statusClass = 'status-greed';
            statusEmoji = '🤑';
        } else {
            statusClass = 'status-extreme-greed';
            statusEmoji = '🚀';
        }
        
        textElement.className = statusClass;
        textElement.innerHTML = `
            <div class="status-text">
                ${data.classification} ${statusEmoji}
            </div>
            <div style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                <i class="fas fa-clock"></i> 
                Atualizado: ${new Date().toLocaleTimeString()}
                <div class="next-update" style="font-size: 0.7rem; margin-top: 0.2rem;">
                    <i class="fas fa-sync"></i> Próxima atualização em 60 segundos
                </div>
            </div>
        `;
        
        // Adiciona efeito de pulse no valor quando atualizado
        valueElement.style.animation = 'none';
        valueElement.offsetHeight; // Trigger reflow
        valueElement.style.animation = 'pulse 0.5s ease-in-out';
    },

    updateLastUpdateTime() {
        state.lastUpdate = new Date();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.cyber-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 40px rgba(0, 102, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 32px rgba(0, 102, 255, 0.2)';
        });
    });

    // Initialize Fear & Greed Index
    initializeFearGreedIndex();

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

// Função para inicializar o Fear & Greed Index com atualizações em tempo real
async function initializeFearGreedIndex() {
    try {
        // Primeira carga
        const fearGreedData = await ApiService.fetchFearGreedIndex();
        UI.updateFearGreedIndex(fearGreedData);
        
        // Configura intervalo de atualização dinâmico
        const updateInterval = Math.min(
            (fearGreedData.nextUpdate * 1000) || CONFIG.FEAR_GREED_UPDATE_INTERVAL,
            CONFIG.FEAR_GREED_UPDATE_INTERVAL
        );
        
        // Atualização periódica
        setInterval(async () => {
            try {
                const newData = await ApiService.fetchFearGreedIndex();
                UI.updateFearGreedIndex(newData);
            } catch (error) {
                console.error('Error in Fear & Greed Index update:', error);
                UI.updateFearGreedIndex(null);
            }
        }, updateInterval);
        
    } catch (error) {
        console.error('Error initializing Fear & Greed Index:', error);
        UI.updateFearGreedIndex(null);
    }
}

// Função global para atualização manual do Fear & Greed Index
window.updateFearGreedIndex = async function() {
    try {
        const fearGreedData = await ApiService.fetchFearGreedIndex();
        UI.updateFearGreedIndex(fearGreedData);
    } catch (error) {
        console.error('Error updating Fear & Greed Index:', error);
        UI.updateFearGreedIndex(null);
    }
}; 