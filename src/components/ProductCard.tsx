import { Card, CardContent, CardMedia, Typography, Button, CardActions, IconButton, Box } from '@mui/material';
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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={imgError ? FALLBACK_IMAGE : resolveProductImage(product.imageUrl)}
                alt={product.name}
                onError={() => setImgError(true)}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    cursor: onProductClick ? 'pointer' : 'default'
                }}
                onClick={() => onProductClick?.(product)}
            >
                <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    R$ {product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Em estoque: {product.stock}
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
                    Adicionar ao Carrinho
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