export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    category: string;
}

export interface Category {
    id: string;
    name: string;
    icon?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

export interface Order {
    id: number;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    paymentMethod: string;
    createdAt: Date;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    orders: Order[];
    createdAt: Date;
}

export interface PaymentMethod {
    id: string;
    name: string;
    enabled: boolean;
    config?: any;
}

export interface ShippingConfig {
    freeShippingThreshold: number;
    defaultShippingCost: number;
    regions: { name: string; cost: number }[];
}