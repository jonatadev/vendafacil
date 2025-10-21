import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order } from '../types';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
}

interface UserContextType {
    user: User | null;
    wishlist: Product[];
    userOrders: Order[];
    login: (email: string, password: string) => boolean;
    register: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
    logout: () => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    addUserOrder: (order: Order) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockUsers = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', address: 'Rua A, 123', createdAt: new Date('2024-01-10') }
];

const mockOrders: Order[] = [
    {
        id: 1,
        items: [{ product: { id: 1, name: 'Ração Premium', price: 99.9, imageUrl: 'racao.png', stock: 10, category: 'racao', description: 'Ração premium' }, quantity: 2 }],
        total: 199.8,
        status: 'delivered',
        customerName: 'João Silva',
        customerEmail: 'joao@email.com',
        customerPhone: '(11) 99999-9999',
        address: 'Rua A, 123',
        paymentMethod: 'credit',
        createdAt: new Date('2024-01-15')
    }
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('current_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [wishlist, setWishlist] = useState<Product[]>(() => {
        const saved = localStorage.getItem('user_wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [userOrders, setUserOrders] = useState<Order[]>(mockOrders);

    const login = (email: string, password: string): boolean => {
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser && password === '123456') {
            setUser(foundUser);
            localStorage.setItem('current_user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const register = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
        const newUser = {
            ...userData,
            id: Date.now(),
            createdAt: new Date()
        };
        setUser(newUser);
        localStorage.setItem('current_user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('current_user');
    };

    const addToWishlist = (product: Product) => {
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        localStorage.setItem('user_wishlist', JSON.stringify(newWishlist));
    };

    const removeFromWishlist = (productId: number) => {
        const newWishlist = wishlist.filter(p => p.id !== productId);
        setWishlist(newWishlist);
        localStorage.setItem('user_wishlist', JSON.stringify(newWishlist));
    };

    const addUserOrder = (order: Order) => {
        setUserOrders(prev => [...prev, order]);
    };

    return (
        <UserContext.Provider value={{
            user,
            wishlist,
            userOrders,
            login,
            register,
            logout,
            addToWishlist,
            removeFromWishlist,
            addUserOrder
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};