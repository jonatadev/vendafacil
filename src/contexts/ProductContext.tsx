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
        name: 'Ração para Cachorros',
        description: 'Ração nutritiva para cães de todas as idades.',
        price: 99.9,
        imageUrl: 'racao_cachorro.png',
        stock: 10,
        category: 'racao'
    },
    {
        id: 2,
        name: 'Ração Golden',
        description: 'Ração premium para cães com ingredientes selecionados.',
        price: 129.9,
        imageUrl: 'racao_golden.png',
        stock: 5,
        category: 'racao'
    },
    {
        id: 3,
        name: 'Ração Gourmet',
        description: 'Ração gourmet para cães exigentes.',
        price: 149.9,
        imageUrl: 'racao_gourmet.png',
        stock: 8,
        category: 'racao'
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