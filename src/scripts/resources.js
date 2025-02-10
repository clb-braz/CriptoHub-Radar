// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    initializeNewsSection();
    initializeProjectsGrid();
    initializeNotifications();
    initializeSecurityTools();
    setupEventListeners();
    initializeToolsGrid();
    initializeAcademyModules();
    initializeReportsGrid();
    initializeCommunityFeatures();
    initializeAPIOptions();
});

// Ferramentas e Calculadoras
function initializeToolsGrid() {
    const tools = [
        {
            icon: 'exchange-alt',
            name: 'Conversor Cripto-Fiat',
            description: 'Converta instantaneamente entre criptomoedas e moedas fiduciárias'
        },
        {
            icon: 'chart-line',
            name: 'Calculadora de Lucros',
            description: 'Calcule seus ganhos com dados históricos precisos'
        },
        {
            icon: 'coins',
            name: 'Simulador de Staking',
            description: 'Compare rendimentos entre diferentes plataformas'
        },
        {
            icon: 'file-invoice-dollar',
            name: 'Calculadora de Impostos',
            description: 'Estime suas obrigações tributárias globais'
        },
        {
            icon: 'gas-pump',
            name: 'Análise de Gas Fees',
            description: 'Monitore taxas em diferentes redes blockchain'
        }
    ];

    const toolsGrid = document.querySelector('.tools-grid');
    if (!toolsGrid) return;

    tools.forEach(tool => {
        const toolItem = document.createElement('div');
        toolItem.className = 'tool-item';
        toolItem.innerHTML = `
            <i class="fas fa-${tool.icon}"></i>
            <h4>${tool.name}</h4>
            <p>${tool.description}</p>
        `;
        toolsGrid.appendChild(toolItem);
    });
}

// Academia CryptoHub
function initializeAcademyModules() {
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        const button = module.querySelector('a');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (module.classList.contains('premium')) {
                showPremiumAlert('módulo');
            } else {
                alert('Redirecionando para o módulo gratuito...');
            }
        });
    });
}

// Notícias
function initializeNewsSection() {
    const mockNews = [
        {
            title: 'Bitcoin atinge nova máxima histórica',
            category: 'Bitcoin',
            timestamp: '2h atrás',
            source: 'CryptoNews'
        },
        {
            title: 'Nova regulamentação DeFi na Europa',
            category: 'DeFi',
            timestamp: '4h atrás',
            source: 'DeFi Daily'
        },
        {
            title: 'SEC aprova novos ETFs de Bitcoin',
            category: 'Regulação',
            timestamp: '6h atrás',
            source: 'Crypto Insider'
        }
    ];

    const newsFeed = document.getElementById('newsFeed');
    if (!newsFeed) return;

    mockNews.forEach(news => {
        const newsItem = createNewsItem(news);
        newsFeed.appendChild(newsItem);
    });

    setupNewsFilters();
}

function createNewsItem(news) {
    const div = document.createElement('div');
    div.className = `news-item ${news.category.toLowerCase()}`;
    div.innerHTML = `
        <span class="news-category">${news.category}</span>
        <h4>${news.title}</h4>
        <div class="news-meta">
            <span>${news.timestamp}</span>
            <span>Fonte: ${news.source}</span>
        </div>
    `;
    return div;
}

function setupNewsFilters() {
    const newsFilters = document.querySelector('.news-filters');
    if (!newsFilters) return;

    newsFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const buttons = newsFilters.querySelectorAll('button');
            buttons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterNews(e.target.textContent.toLowerCase());
        }
    });
}

function filterNews(category) {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        if (category === 'todas' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Relatórios
function initializeReportsGrid() {
    const reports = document.querySelectorAll('.report-item a');
    reports.forEach(report => {
        report.addEventListener('click', (e) => {
            e.preventDefault();
            showPremiumAlert('relatório');
        });
    });
}

// Comunidade
function initializeCommunityFeatures() {
    const communityButtons = document.querySelectorAll('.community-features .premium-button');
    communityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showPremiumAlert('recurso da comunidade');
        });
    });
}

// Projetos
function initializeProjectsGrid() {
    const mockProjects = [
        {
            name: 'AI Chain',
            category: 'IA & Blockchain',
            description: 'Inteligência artificial descentralizada',
            marketCap: '$50M',
            growth: '+15%'
        },
        {
            name: 'DeFi Yield',
            category: 'DeFi',
            description: 'Protocolo de yield farming automatizado',
            marketCap: '$100M',
            growth: '+8%'
        },
        {
            name: 'Real Estate Token',
            category: 'RWA',
            description: 'Tokenização de imóveis premium',
            marketCap: '$75M',
            growth: '+5%'
        }
    ];

    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    mockProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });

    setupProjectsFilters();
}

function createProjectCard(project) {
    const div = document.createElement('div');
    div.className = `project-card ${project.category.toLowerCase().replace(/\s+/g, '-')}`;
    div.innerHTML = `
        <span class="project-category">${project.category}</span>
        <h4>${project.name}</h4>
        <p>${project.description}</p>
        <div class="project-meta">
            <span>Market Cap: ${project.marketCap}</span>
            <span class="${project.growth.startsWith('+') ? 'positive' : 'negative'}">${project.growth}</span>
        </div>
    `;
    return div;
}

function setupProjectsFilters() {
    const projectsFilters = document.querySelector('.projects-filters');
    if (!projectsFilters) return;

    projectsFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const buttons = projectsFilters.querySelectorAll('button');
            buttons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterProjects(e.target.textContent);
        }
    });
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        if (category === 'Todos' || card.querySelector('.project-category').textContent === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Segurança
function initializeSecurityTools() {
    const securityButtons = document.querySelectorAll('.security-tools .action-button');
    securityButtons.forEach(button => {
        button.addEventListener('click', handleSecurityAction);
    });
}

function handleSecurityAction(e) {
    const action = e.target.textContent.toLowerCase();
    switch (action) {
        case 'verificar':
            runSecurityCheck();
            break;
        case 'analisar':
            analyzeContract();
            break;
        case 'ativar alertas':
            toggleScamAlerts();
            break;
    }
}

function runSecurityCheck() {
    alert('Iniciando verificação de segurança da carteira...');
}

function analyzeContract() {
    const contractAddress = prompt('Digite o endereço do contrato:');
    if (contractAddress) {
        alert(`Analisando contrato ${contractAddress}...`);
    }
}

function toggleScamAlerts() {
    alert('Alertas de scam ativados! Você receberá notificações em tempo real.');
}

// API & Automação
function initializeAPIOptions() {
    const apiButtons = document.querySelectorAll('.api-tier .premium-button');
    apiButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showPremiumAlert('API');
        });
    });
}

// Notificações
function initializeNotifications() {
    const notificationOptions = document.querySelector('.notification-options');
    if (!notificationOptions) return;

    const categories = ['Bitcoin', 'Ethereum', 'DeFi', 'NFTs', 'Regulação'];
    categories.forEach(category => {
        const option = createNotificationOption(category);
        notificationOptions.appendChild(option);
    });
}

function createNotificationOption(category) {
    const div = document.createElement('div');
    div.className = 'notification-option';
    div.innerHTML = `
        <label>
            <input type="checkbox" value="${category.toLowerCase()}">
            ${category}
        </label>
    `;
    return div;
}

// Event Listeners Gerais
function setupEventListeners() {
    // Animações de hover nos cards
    document.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 40px rgba(0, 102, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 32px rgba(0, 102, 255, 0.2)';
        });
    });

    // Botão de upgrade premium
    const premiumButton = document.querySelector('.premium-upgrade-card .premium-button');
    if (premiumButton) {
        premiumButton.addEventListener('click', (e) => {
            e.preventDefault();
            showPremiumUpgradeModal();
        });
    }
}

// Utilitários
function showPremiumAlert(type) {
    alert(`Este ${type} é exclusivo para membros premium. Faça upgrade para acessar!`);
}

function showPremiumUpgradeModal() {
    alert('Redirecionando para a página de upgrade premium...');
} 