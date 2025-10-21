import { StoreConfig } from './store';

// Exemplos de configuração para diferentes tipos de empresa

export const petShopConfig: StoreConfig = {
    name: 'Pet Shop Amigo Fiel',
    logo: '/vendafacil/assets/images/logo-petshop.png',
    primaryColor: '#4caf50',
    secondaryColor: '#ff9800',
    description: 'Tudo para seu melhor amigo',
    contact: {
        email: 'contato@petshop.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123'
    }
};

export const farmaciaConfig: StoreConfig = {
    name: 'Farmácia Saúde & Vida',
    logo: '/vendafacil/assets/images/logo-farmacia.png',
    primaryColor: '#2196f3',
    secondaryColor: '#f44336',
    description: 'Cuidando da sua saúde',
    contact: {
        email: 'contato@farmacia.com',
        phone: '(11) 88888-8888',
        address: 'Av. Principal, 456'
    }
};

export const roupasConfig: StoreConfig = {
    name: 'Moda & Estilo',
    logo: '/vendafacil/assets/images/logo-roupas.png',
    primaryColor: '#9c27b0',
    secondaryColor: '#e91e63',
    description: 'Vista-se com estilo',
    contact: {
        email: 'contato@modaestilo.com',
        phone: '(11) 77777-7777',
        address: 'Shopping Center, Loja 10'
    }
};

export const alimentosConfig: StoreConfig = {
    name: 'Mercado Bom Preço',
    logo: '/vendafacil/assets/images/logo-mercado.png',
    primaryColor: '#ff5722',
    secondaryColor: '#4caf50',
    description: 'Qualidade e economia',
    contact: {
        email: 'contato@mercado.com',
        phone: '(11) 66666-6666',
        address: 'Rua do Comércio, 789'
    }
};

const examples = {
    petshop: petShopConfig,
    farmacia: farmaciaConfig,
    roupas: roupasConfig,
    alimentos: alimentosConfig
};

// Função para aplicar configuração de exemplo
export const applyExampleConfig = (configName: keyof typeof examples) => {
    const config = examples[configName];
    if (config) {
        localStorage.setItem('store_config', JSON.stringify(config));
        window.location.reload(); // Recarrega para aplicar mudanças
    }
};