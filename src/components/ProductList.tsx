import { Grid } from '@mui/material';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    onProductClick?: (product: Product) => void;
}

const ProductList = ({ products, onProductClick }: ProductListProps) => {
    return (
        <Grid container spacing={3} padding={2}>
            {products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={product} onProductClick={onProductClick} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;