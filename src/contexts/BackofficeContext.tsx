import { createContext, useContext, useState, ReactNode } from 'react';
import { Order, Customer, PaymentMethod, ShippingConfig } from '../types';

interface BackofficeContextType {
    orders: Order[];
    customers: Customer[];
    paymentMethods: PaymentMethod[];
    shippingConfig: ShippingConfig;
    addOrder: (order: Omit<Order, 'id'>) => void;
    updateOrderStatus: (id: number, status: Order['status']) => void;
    addCustomer: (customer: Omit<Customer, 'id'>) => void;
    updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
    updateShippingConfig: (config: Partial<ShippingConfig>) => void;
}

const BackofficeContext = createContext<BackofficeContextType | undefined>(undefined);

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
    },
    {
        id: 2,
        items: [{ product: { id: 2, name: 'Brinquedo Corda', price: 25.9, imageUrl: 'brinquedo.png', stock: 15, category: 'brinquedos', description: 'Brinquedo' }, quantity: 1 }],
        total: 25.9,
        status: 'processing',
        customerName: 'Maria Santos',
        customerEmail: 'maria@email.com',
        customerPhone: '(11) 88888-8888',
        address: 'Rua B, 456',
        paymentMethod: 'pix',
        createdAt: new Date('2024-01-20')
    }
];

const mockCustomers: Customer[] = [
    {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua A, 123',
        orders: [mockOrders[0]],
        createdAt: new Date('2024-01-10')
    }
];

const mockPaymentMethods: PaymentMethod[] = [
    { id: 'credit', name: 'Cartão de Crédito', enabled: true },
    { id: 'debit', name: 'Cartão de Débito', enabled: true },
    { id: 'pix', name: 'PIX', enabled: true },
    { id: 'boleto', name: 'Boleto', enabled: false }
];

const mockShippingConfig: ShippingConfig = {
    freeShippingThreshold: 100,
    defaultShippingCost: 15,
    regions: [
        { name: 'São Paulo - Capital', cost: 10 },
        { name: 'São Paulo - Interior', cost: 15 },
        { name: 'Rio de Janeiro', cost: 20 }
    ]
};

export const BackofficeProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('backoffice_orders');
        return saved ? JSON.parse(saved) : mockOrders;
    });
    const [customers, setCustomers] = useState<Customer[]>(() => {
        const saved = localStorage.getItem('backoffice_customers');
        return saved ? JSON.parse(saved) : mockCustomers;
    });
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
    const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(mockShippingConfig);

    const addOrder = (orderData: Omit<Order, 'id'>) => {
        const newId = Math.max(...orders.map(o => o.id), 0) + 1;
        const newOrder = { ...orderData, id: newId };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('backoffice_orders', JSON.stringify(updatedOrders));
    };

    const updateOrderStatus = (id: number, status: Order['status']) => {
        const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
        setOrders(updatedOrders);
        localStorage.setItem('backoffice_orders', JSON.stringify(updatedOrders));
    };

    const addCustomer = (customerData: Omit<Customer, 'id'>) => {
        const newId = Math.max(...customers.map(c => c.id), 0) + 1;
        const newCustomer = { ...customerData, id: newId };
        const updatedCustomers = [...customers, newCustomer];
        setCustomers(updatedCustomers);
        localStorage.setItem('backoffice_customers', JSON.stringify(updatedCustomers));
    };

    const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
        setPaymentMethods(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const updateShippingConfig = (config: Partial<ShippingConfig>) => {
        setShippingConfig(prev => ({ ...prev, ...config }));
    };

    return (
        <BackofficeContext.Provider value={{
            orders,
            customers,
            paymentMethods,
            shippingConfig,
            addOrder,
            updateOrderStatus,
            addCustomer,
            updatePaymentMethod,
            updateShippingConfig
        }}>
            {children}
        </BackofficeContext.Provider>
    );
};

export const useBackoffice = () => {
    const context = useContext(BackofficeContext);
    if (!context) {
        throw new Error('useBackoffice must be used within BackofficeProvider');
    }
    return context;
};