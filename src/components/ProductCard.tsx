import { Card, CardContent, CardMedia, Typography, Button, CardActions, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { resolveProductImage } from '../utils/imageUtils';

interface ProductCardProps {
    product: Product;
    onProductClick?: (product: Product) => void;
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300?text=Sem+imagem';



const ProductCard = ({ product, onProductClick }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { user, wishlist, addToWishlist, removeFromWishlist } = useUser();
    const [imgError, setImgError] = useState(false);
    
    const isInWishlist = wishlist.some(p => p.id === product.id);
    
    const handleWishlistToggle = () => {
        if (!user) return;
        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <Card sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="160"
                image={imgError ? FALLBACK_IMAGE : resolveProductImage(product.imageUrl)}
                alt={product.name}
                onError={() => setImgError(true)}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    cursor: onProductClick ? 'pointer' : 'default',
                    p: 2
                }}
                onClick={() => onProductClick?.(product)}
            >
                <Typography gutterBottom variant="h6" component="h2" sx={{ fontSize: '1.1rem' }}>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem' }}>
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1, fontSize: '1.2rem' }}>
                    R$ {product.price.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Estoque: {product.stock}
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    color="primary" 
                    variant="contained"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    sx={{ flexGrow: 1 }}
                >
                    Comprar
                </Button>
                {user && (
                    <IconButton
                        color={isInWishlist ? 'error' : 'default'}
                        onClick={handleWishlistToggle}
                    >
                        {isInWishlist ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                )}
            </CardActions>
        </Card>
    );
};

export default ProductCard;