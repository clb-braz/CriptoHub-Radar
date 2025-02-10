document.addEventListener("DOMContentLoaded", function () {
    // Configurações iniciais do Chart.js
    Chart.defaults.color = '#ffffff';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    // Fear & Greed Chart
    async function fetchFearGreedIndex() {
        try {
            const response = await fetch('https://api.alternative.me/fng/');
            const data = await response.json();
            updateFearGreedChart(data.data[0].value);
        } catch (error) {
            console.error('Erro ao carregar o Fear & Greed Index:', error);
            document.getElementById('fear-greed-text').innerHTML = `
                <span style="color: #ff4444;">
                    <i class="fas fa-exclamation-circle"></i> Erro ao carregar dados
                </span>
            `;
        }
    }

    function updateFearGreedChart(value) {
        const ctx = document.getElementById("fearGreedChart").getContext("2d");
        
        // Determina as cores baseadas no valor
        const colors = getColorGradient(value);
        
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Medo", "Ganância"],
                datasets: [{
                    data: [100 - value, value],
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                family: 'Poppins',
                                size: 14
                            }
                        }
                    }
                }
            }
        });

        // Atualiza o texto do status
        updateFearGreedText(value);
    }

    function getColorGradient(value) {
        if (value <= 20) return ['#ff4444', '#ff6666'];
        if (value <= 40) return ['#ff8800', '#ffaa00'];
        if (value <= 60) return ['#ffff00', '#ffff66'];
        if (value <= 80) return ['#88ff00', '#aaff00'];
        return ['#00ff00', '#66ff66'];
    }

    function updateFearGreedText(value) {
        let status, emoji;
        if (value <= 20) {
            status = 'Medo Extremo';
            emoji = '😨';
        } else if (value <= 40) {
            status = 'Medo';
            emoji = '😟';
        } else if (value <= 60) {
            status = 'Neutro';
            emoji = '😐';
        } else if (value <= 80) {
            status = 'Ganância';
            emoji = '🤑';
        } else {
            status = 'Ganância Extrema';
            emoji = '🚀';
        }

        document.getElementById('fear-greed-text').innerHTML = `
            <div class="status-text ${status.toLowerCase().replace(' ', '-')}">
                ${status} ${emoji}
            </div>
        `;
    }

    // Métricas On-Chain
    async function fetchMetricsOnChain() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/global');
            const data = await response.json();
            
            // Formata os números para melhor visualização
            const formatNumber = (num) => {
                if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
                if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
                if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
                return `$${num.toFixed(2)}`;
            };

            // Atualiza os valores com animação
            animateValue("volume24h", formatNumber(data.data.total_volume.usd));
            animateValue("marketCap", formatNumber(data.data.total_market_cap.usd));
            animateValue("change24h", `${data.data.market_cap_change_percentage_24h_usd.toFixed(2)}%`);
            animateValue("btcDominance", `${data.data.market_cap_percentage.btc.toFixed(2)}%`);

            // Adiciona classes para valores positivos/negativos
            const change24h = document.getElementById("change24h");
            change24h.className = `metric-value ${data.data.market_cap_change_percentage_24h_usd >= 0 ? 'positive' : 'negative'}`;
        } catch (error) {
            console.error('Erro ao carregar métricas on-chain:', error);
            document.querySelectorAll('.metric-value').forEach(el => {
                el.innerHTML = '<span style="color: #ff4444;">Erro ao carregar</span>';
            });
        }
    }

    function animateValue(elementId, finalValue) {
        const element = document.getElementById(elementId);
        element.classList.add('updating');
        setTimeout(() => {
            element.textContent = finalValue;
            element.classList.remove('updating');
        }, 300);
    }

    // Configuração do TradingView
    function initTradingView() {
        new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": "BINANCE:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "br",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "technicalChart",
            "hide_side_toolbar": false,
            "studies": [
                "MASimple@tv-basicstudies",
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies"
            ]
        });
    }

    // Configuração dos botões de expandir/minimizar
    function setupChartToggle() {
        const chartContainer = document.querySelector("#technicalChartContainer");
        const expandBtn = document.querySelector("#expandChart");
        const minimizeBtn = document.querySelector("#minimizeChart");
        const analysisCard = document.querySelector(".analysis-card.expandable");

        expandBtn.addEventListener("click", () => {
            analysisCard.classList.add('expanded');
            expandBtn.style.display = "none";
            minimizeBtn.style.display = "block";
        });

        minimizeBtn.addEventListener("click", () => {
            analysisCard.classList.remove('expanded');
            expandBtn.style.display = "block";
            minimizeBtn.style.display = "none";
        });
    }

    // Configuração do botão de atualizar métricas
    function setupRefreshButton() {
        const refreshBtn = document.querySelector("#refreshMetrics");
        refreshBtn.addEventListener("click", () => {
            refreshBtn.classList.add('rotating');
            fetchMetricsOnChain().finally(() => {
                setTimeout(() => {
                    refreshBtn.classList.remove('rotating');
                }, 1000);
            });
        });
    }

    // Inicialização
    fetchFearGreedIndex();
    fetchMetricsOnChain();
    initTradingView();
    setupChartToggle();
    setupRefreshButton();

    // Atualização automática
    setInterval(fetchFearGreedIndex, 300000); // 5 minutos
    setInterval(fetchMetricsOnChain, 60000); // 1 minuto

    // Initialize all charts and components
    initSocialSentiment();
    initWhaleMonitoring();
    initTechnicalAnalysis();
    initMarketHeatmap();
    initDefiRanking();
    initProjectsTracker();
    initManipulationAlerts();
    initPerformanceComparison();
    initMarketNarratives();
    initInstitutionalAdoption();

    // Social Sentiment Analysis
    function initSocialSentiment() {
        const ctx = document.getElementById('socialSentimentChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['7 dias atrás', '6 dias', '5 dias', '4 dias', '3 dias', '2 dias', 'Hoje'],
                datasets: [{
                    label: 'Twitter',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#1DA1F2',
                    tension: 0.4
                }, {
                    label: 'Reddit',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: '#FF4500',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Simulated trending tokens
        const trendingTokens = [
            { name: 'Bitcoin', sentiment: 'positive', mentions: 125000 },
            { name: 'Ethereum', sentiment: 'neutral', mentions: 89000 },
            { name: 'Solana', sentiment: 'positive', mentions: 45000 },
            { name: 'Cardano', sentiment: 'negative', mentions: 32000 },
            { name: 'Polygon', sentiment: 'positive', mentions: 28000 }
        ];

        const trendingList = document.getElementById('trendingTokensList');
        trendingTokens.forEach(token => {
            const div = document.createElement('div');
            div.className = `trending-token ${token.sentiment}`;
            div.innerHTML = `
                <span class="token-name">${token.name}</span>
                <span class="token-mentions">${token.mentions.toLocaleString()} menções</span>
            `;
            trendingList.appendChild(div);
        });
    }

    // Whale Monitoring
    function initWhaleMonitoring() {
        const transactions = [
            { type: 'buy', amount: '1,500 BTC', value: '$45,000,000', wallet: '0x1234...5678' },
            { type: 'sell', amount: '12,000 ETH', value: '$22,000,000', wallet: '0x9876...5432' },
            { type: 'buy', amount: '5,000,000 XRP', value: '$2,500,000', wallet: '0x4567...8901' }
        ];

        const feed = document.getElementById('whaleTransactions');
        transactions.forEach(tx => {
            const div = document.createElement('div');
            div.className = `whale-transaction ${tx.type}`;
            div.innerHTML = `
                <div class="transaction-header">
                    <span class="transaction-type">${tx.type.toUpperCase()}</span>
                    <span class="transaction-amount">${tx.amount}</span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-value">${tx.value}</span>
                    <span class="transaction-wallet">${tx.wallet}</span>
                </div>
            `;
            feed.appendChild(div);
        });
    }

    // Technical Analysis
    function initTechnicalAnalysis() {
        new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": "BINANCE:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "br",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "technicalChart",
            "studies": [
                "MASimple@tv-basicstudies",
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies"
            ]
        });

        // Setup indicator buttons
        document.querySelectorAll('.indicator-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                // Here you would toggle the respective indicator on the TradingView chart
            });
        });
    }

    // Market Heatmap
    function initMarketHeatmap() {
        const heatmapSelect = document.getElementById('heatmapMetric');
        heatmapSelect.addEventListener('change', function() {
            updateHeatmap(this.value);
        });

        function updateHeatmap(metric) {
            // Here you would update the heatmap visualization based on the selected metric
            console.log(`Updating heatmap for ${metric}`);
        }

        // Initial heatmap load
        updateHeatmap('volatility');
    }

    // DeFi Ranking
    function initDefiRanking() {
        const protocols = [
            { name: 'Aave', apy: '4.5%', tvl: '$5.2B', type: 'lending' },
            { name: 'Curve', apy: '8.2%', tvl: '$3.8B', type: 'staking' },
            { name: 'Uniswap', apy: '15.5%', tvl: '$4.1B', type: 'farming' }
        ];

        const list = document.getElementById('defiRankingList');
        protocols.forEach(protocol => {
            const div = document.createElement('div');
            div.className = 'defi-protocol';
            div.innerHTML = `
                <div class="protocol-info">
                    <span class="protocol-name">${protocol.name}</span>
                    <span class="protocol-type">${protocol.type}</span>
                </div>
                <div class="protocol-metrics">
                    <span class="protocol-apy">APY: ${protocol.apy}</span>
                    <span class="protocol-tvl">TVL: ${protocol.tvl}</span>
                </div>
            `;
            list.appendChild(div);
        });
    }

    // Projects Tracker
    function initProjectsTracker() {
        const projects = [
            { name: 'Project A', date: '2024-02-15', type: 'ICO', rating: 8.5 },
            { name: 'Project B', date: '2024-02-18', type: 'IDO', rating: 7.8 },
            { name: 'Project C', date: '2024-02-20', type: 'IEO', rating: 9.2 }
        ];

        const timeline = document.getElementById('projectsTimeline');
        projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'project-item';
            div.innerHTML = `
                <div class="project-date">${new Date(project.date).toLocaleDateString()}</div>
                <div class="project-info">
                    <span class="project-name">${project.name}</span>
                    <span class="project-type">${project.type}</span>
                    <span class="project-rating">${project.rating}/10</span>
                </div>
            `;
            timeline.appendChild(div);
        });
    }

    // Market Manipulation Alerts
    function initManipulationAlerts() {
        const alerts = [
            { type: 'pump', symbol: 'TOKEN1', risk: 'high', pattern: 'Wash Trading' },
            { type: 'dump', symbol: 'TOKEN2', risk: 'medium', pattern: 'Spoofing' },
            { type: 'manipulation', symbol: 'TOKEN3', risk: 'low', pattern: 'Layering' }
        ];

        const alertsContainer = document.getElementById('manipulationAlerts');
        alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `manipulation-alert ${alert.risk}`;
            div.innerHTML = `
                <div class="alert-header">
                    <span class="alert-type">${alert.type.toUpperCase()}</span>
                    <span class="alert-symbol">${alert.symbol}</span>
                </div>
                <div class="alert-details">
                    <span class="alert-risk">Risco: ${alert.risk}</span>
                    <span class="alert-pattern">Padrão: ${alert.pattern}</span>
                </div>
            `;
            alertsContainer.appendChild(div);
        });
    }

    // Performance Comparison
    function initPerformanceComparison() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['7 dias atrás', '6 dias', '5 dias', '4 dias', '3 dias', '2 dias', 'Hoje'],
                datasets: [{
                    label: 'BTC',
                    data: [100, 102, 98, 103, 105, 108, 110],
                    borderColor: '#F7931A'
                }, {
                    label: 'ETH',
                    data: [100, 105, 103, 108, 110, 112, 115],
                    borderColor: '#627EEA'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Market Narratives
    function initMarketNarratives() {
        const narratives = [
            { name: 'Real World Assets', strength: 85, tokens: ['RWA1', 'RWA2', 'RWA3'] },
            { name: 'AI & Blockchain', strength: 92, tokens: ['AI1', 'AI2', 'AI3'] },
            { name: 'Layer 2 Solutions', strength: 78, tokens: ['L2A', 'L2B', 'L2C'] }
        ];

        const container = document.getElementById('marketNarratives');
        narratives.forEach(narrative => {
            const div = document.createElement('div');
            div.className = 'narrative-item';
            div.innerHTML = `
                <div class="narrative-header">
                    <span class="narrative-name">${narrative.name}</span>
                    <span class="narrative-strength">Força: ${narrative.strength}%</span>
                </div>
                <div class="narrative-tokens">
                    <span>Tokens Líderes: ${narrative.tokens.join(', ')}</span>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Institutional Adoption
    function initInstitutionalAdoption() {
        const updates = [
            { institution: 'BlackRock', type: 'Investment', amount: '$500M', sector: 'Bitcoin ETF' },
            { institution: 'JPMorgan', type: 'Partnership', amount: 'N/A', sector: 'Blockchain Infrastructure' },
            { institution: 'Fidelity', type: 'Integration', amount: '$200M', sector: 'Custody Solution' }
        ];

        const feed = document.getElementById('institutionalFeed');
        updates.forEach(update => {
            const div = document.createElement('div');
            div.className = 'institutional-update';
            div.innerHTML = `
                <div class="update-header">
                    <span class="institution-name">${update.institution}</span>
                    <span class="update-type">${update.type}</span>
                </div>
                <div class="update-details">
                    <span class="update-amount">${update.amount}</span>
                    <span class="update-sector">${update.sector}</span>
                </div>
            `;
            feed.appendChild(div);
        });
    }
}); 