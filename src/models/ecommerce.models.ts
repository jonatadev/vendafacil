export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Ração para Cachorros',
    description: 'Ração nutritiva para cães de todas as idades.',
    price: 99.9,
    imageUrl: '/assets/images/racao_cachorro.png',
  },
  {
    id: 2,
    name: 'Ração Golden',
    description: 'Ração premium para cães com ingredientes selecionados.',
    price: 129.9,
    imageUrl: '/assets/images/racao_golden.png',
  },
  {
    id: 3,
    name: 'Ração Gourmet',
    description: 'Ração gourmet para cães exigentes.',
    price: 149.9,
    imageUrl: '/assets/images/racao_gourmet.png',
  },
];