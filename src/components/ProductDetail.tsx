import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
    TextField,
    Chip,
    Divider
} from '@mui/material';
import { ArrowBack, Add, Remove } from '@mui/icons-material';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { resolveProductImage } from '../utils/imageUtils';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
    relatedProducts: Product[];
    onProductClick: (product: Product) => void;
}

const ProductDetail = ({ product, onBack, relatedProducts, onProductClick }: ProductDetailProps) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setQuantity(1);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">
                    {product.name}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <img
                            src={resolveProductImage(product.imageUrl)}
                            alt={product.name}
                            style={{
                                width: '100%',
                                maxWidth: 400,
                                height: 'auto',
                                borderRadius: 8
                            }}
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sem+imagem';
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {product.name}
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {product.description}
                        </Typography>

                        <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                            R$ {product.price.toFixed(2)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                Em estoque: {product.stock} unidades
                            </Typography>
                            <Chip 
                                label={product.stock > 0 ? 'Disponível' : 'Esgotado'} 
                                color={product.stock > 0 ? 'success' : 'error'}
                                size="small"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                Quantidade:
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Remove />
                            </IconButton>
                            <TextField
                                size="small"
                                value={quantity}
                                onChange={(e) => {
                                    const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
                                    setQuantity(value);
                                }}
                                inputProps={{
                                    style: { textAlign: 'center' },
                                    min: 1,
                                    max: product.stock
                                }}
                                sx={{ width: 80, mx: 1 }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                disabled={quantity >= product.stock}
                            >
                                <Add />
                            </IconButton>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            sx={{ mb: 2 }}
                        >
                            Adicionar ao Carrinho
                        </Button>

                        <Typography variant="body2" color="text.secondary">
                            Frete grátis para compras acima de R$ 100,00
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {relatedProducts.length > 0 && (
                <>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h5" gutterBottom>
                        Produtos Relacionados
                    </Typography>
                    <Grid container spacing={2}>
                        {relatedProducts.slice(0, 4).map((relatedProduct) => (
                            <Grid item xs={6} sm={3} key={relatedProduct.id}>
                                <Paper 
                                    sx={{ 
                                        p: 2, 
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 4 }
                                    }}
                                    onClick={() => onProductClick(relatedProduct)}
                                >
                                    <img
                                        src={resolveProductImage(relatedProduct.imageUrl)}
                                        alt={relatedProduct.name}
                                        style={{
                                            width: '100%',
                                            height: 120,
                                            objectFit: 'cover',
                                            borderRadius: 4,
                                            marginBottom: 8
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/200x120?text=Sem+imagem';
                                        }}
                                    />
                                    <Typography variant="body2" noWrap>
                                        {relatedProduct.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        R$ {relatedProduct.price.toFixed(2)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default ProductDetail;