import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, updates: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
    updateStock: (id: number, newStock: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
    {
        id: 1,
        name: 'Adubo NPK 10.10.10 - 1kg',
        description: 'Fertilizante completo NPK para nutrição balanceada das plantas.',
        price: 25.90,
        imageUrl: 'adubo_NPK 10.10.10-1kg.jpg',
        stock: 15,
        category: 'fertilizantes'
    },
    {
        id: 2,
        name: 'Rolo de Arame Farpado 100m',
        description: 'Arame farpado galvanizado para cercamento rural, 100 metros.',
        price: 189.90,
        imageUrl: 'arame_Rolo de Arame Farpado, 100 Metros, Aço Galvanizado.jpg',
        stock: 8,
        category: 'cercamento'
    },
    {
        id: 3,
        name: 'Esterco Bovino Curtido 15kg',
        description: 'Esterco bovino curtido para enriquecimento do solo, 15kg.',
        price: 32.50,
        imageUrl: 'esterco_Esterco Bovino Curtido 15kg Solo Fértil Marcon.jpg',
        stock: 20,
        category: 'fertilizantes'
    },
    {
        id: 4,
        name: 'Fertilizante NPK Concentrado 120ml',
        description: 'Fertilizante líquido concentrado NPK 10-10-10 para plantas.',
        price: 18.90,
        imageUrl: 'fertilizante_Fertilizante NPK 10-10-10 Concentrado - 120ml.jpg',
        stock: 25,
        category: 'fertilizantes'
    },
    {
        id: 5,
        name: 'Vaso Cachepô Decorativo 15x13cm',
        description: 'Vaso decorativo redondo para plantas, 15x13cm.',
        price: 24.90,
        imageUrl: 'vaso_Vaso Cachepô Redondo Decorativo 15x13cm.jpg',
        stock: 12,
        category: 'vasos'
    },
    {
        id: 6,
        name: 'Ração para Cachorros',
        description: 'Ração nutritiva para cães de todas as idades.',
        price: 99.90,
        imageUrl: 'racao_cachorro.png',
        stock: 10,
        category: 'racoes'
    },
    {
        id: 7,
        name: 'Ração Golden',
        description: 'Ração premium para cães com ingredientes selecionados.',
        price: 129.90,
        imageUrl: 'racao_golden.png',
        stock: 5,
        category: 'racoes'
    },
    {
        id: 8,
        name: 'Ração Gourmet',
        description: 'Ração gourmet para cães exigentes.',
        price: 149.90,
        imageUrl: 'racao_gourmet.png',
        stock: 8,
        category: 'racoes'
    }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newId = Math.max(...products.map(p => p.id)) + 1;
        const newProduct = { ...productData, id: newId };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (id: number, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateStock = (id: number, newStock: number) => {
        updateProduct(id, { stock: newStock });
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, updateStock }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
};