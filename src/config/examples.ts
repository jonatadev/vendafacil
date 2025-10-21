import { StoreConfig } from './store';

// Exemplos de configuração para diferentes tipos de empresa

export const petShopConfig: StoreConfig = {
    name: 'Pet Shop Amigo Fiel',
    logo: '/assets/images/logo-petshop.png',
    primaryColor: '#4caf50',
    secondaryColor: '#ff9800',
    description: 'Tudo para seu melhor amigo'
};

export const farmaciaConfig: StoreConfig = {
    name: 'Farmácia Saúde & Vida',
    logo: '/assets/images/logo-farmacia.png',
    primaryColor: '#2196f3',
    secondaryColor: '#f44336',
    description: 'Cuidando da sua saúde'
};

export const roupasConfig: StoreConfig = {
    name: 'Moda & Estilo',
    logo: '/assets/images/logo-roupas.png',
    primaryColor: '#9c27b0',
    secondaryColor: '#e91e63',
    description: 'Vista-se com estilo'
};

export const alimentosConfig: StoreConfig = {
    name: 'Mercado Bom Preço',
    logo: '/assets/images/logo-mercado.png',
    primaryColor: '#ff5722',
    secondaryColor: '#4caf50',
    description: 'Qualidade e economia'
};

// Função para aplicar configuração de exemplo
export const applyExampleConfig = (configName: keyof typeof examples) => {
    const examples = {
        petshop: petShopConfig,
        farmacia: farmaciaConfig,
        roupas: roupasConfig,
        alimentos: alimentosConfig
    };
    
    const config = examples[configName];
    if (config) {
        localStorage.setItem('store_config', JSON.stringify(config));
        window.location.reload(); // Recarrega para aplicar mudanças
    }
};