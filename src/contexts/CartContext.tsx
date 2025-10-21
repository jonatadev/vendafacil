import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { loadJson, saveJson } from '../utils/storage';

interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    processOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'vf_cart_v1';

const validateCart = (value: unknown): Cart => {
    if (!value || typeof value !== 'object') {
        console.error('Invalid cart data:', value);
        return { items: [], total: 0 };
    }
    try {
        const obj = value as any;
        if (!Array.isArray(obj.items)) {
            console.error('Invalid cart items:', obj.items);
            return { items: [], total: 0 };
        }
        const items: CartItem[] = obj.items
            .filter((it: any) => it && it.product && typeof it.quantity === 'number')
            .map((it: any) => ({ product: it.product as Product, quantity: Number(it.quantity) }));
        const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
        return { items, total };
    } catch (error) {
        console.error('Error validating cart:', error);
        return { items: [], total: 0 };
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart>(() => {
        const raw = loadJson(STORAGE_KEY);
        return validateCart(raw);
    });

    useEffect(() => {
        saveJson(STORAGE_KEY, cart);
    }, [cart]);

    const calculateTotal = (items: CartItem[]): number => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const addToCart = (product: Product) => {
        setCart(currentCart => {
            const existingItem = currentCart.items.find(item => item.product.id === product.id);
            let newItems: CartItem[];

            if (existingItem) {
                newItems = currentCart.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...currentCart.items, { product, quantity: 1 }];
            }

            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(currentCart => {
            const newItems = currentCart.items.filter(item => item.product.id !== productId);
            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 0) return;
        
        setCart(currentCart => {
            const newItems = currentCart.items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            ).filter(item => item.quantity > 0);

            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        });
    };

    const clearCart = () => {
        setCart({ items: [], total: 0 });
    };

    const processOrder = () => {
        // Esta função será chamada quando o pedido for finalizado
        // para atualizar o estoque dos produtos
        clearCart();
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, processOrder }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};