export interface StoreConfig {
    name: string;
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    description: string;
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    header?: {
        backgroundImage?: string;
        backgroundColor?: string;
        textColor?: string;
        height?: number;
        style: 'gradient' | 'solid' | 'image';
    };
}

// Configuração padrão - pode ser alterada por cada empresa
export const storeConfig: StoreConfig = {
    name: 'VendaFácil',
    logo: '/vendafacil/assets/images/VendaFacil.png',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    description: 'Tecnologia Livre para um Comércio Forte',
    contact: {
        email: 'contato@vendafacil.com',
        phone: '(11) 99999-9999',
        address: 'São Paulo, SP'
    },
    header: {
        style: 'image',
        backgroundImage: '/vendafacil/assets/images/VendaFacil.png',
        backgroundColor: '#1976d2',
        textColor: '#ffffff',
        height: 160
    }
};

// Função para carregar configuração personalizada
export const loadStoreConfig = (): StoreConfig => {
    try {
        const customConfig = localStorage.getItem('store_config');
        if (customConfig) {
            return { ...storeConfig, ...JSON.parse(customConfig) };
        }
    } catch (error) {
        console.warn('Erro ao carregar configuração personalizada:', error);
    }
    return storeConfig;
};

// Função para salvar configuração personalizada
export const saveStoreConfig = (config: Partial<StoreConfig>) => {
    try {
        const currentConfig = loadStoreConfig();
        const newConfig = { ...currentConfig, ...config };
        localStorage.setItem('store_config', JSON.stringify(newConfig));
        return newConfig;
    } catch (error) {
        console.warn('Erro ao salvar configuração:', error);
        return storeConfig;
    }
};