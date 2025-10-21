import {
    Box,
    Typography,
    List,
    ListItem,
    IconButton,
    Button,
    TextField,
    Paper,
    Divider,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { resolveProductImage } from '../utils/imageUtils';

interface CartProps {
    onCheckout?: () => void;
}

const Cart = ({ onCheckout }: CartProps) => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

    if (cart.items.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Seu carrinho está vazio
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Adicione alguns produtos para começar suas compras
                </Typography>
            </Paper>
        );
    }

    const subtotal = cart.total;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Carrinho de Compras ({cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'})
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <List>
                    {cart.items.map((item, index) => (
                        <Box key={item.product.id}>
                            <ListItem sx={{ px: 0, py: 2 }}>
                                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    <Avatar
                                        src={resolveProductImage(item.product.imageUrl)}
                                        alt={item.product.name}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                        variant="rounded"
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.product.description}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                            R$ {item.product.price.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mx: 3 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField
                                            size="small"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const value = Math.max(1, parseInt(e.target.value) || 1);
                                                updateQuantity(item.product.id, value);
                                            }}
                                            inputProps={{
                                                style: { textAlign: 'center' },
                                                min: 1,
                                                max: item.product.stock
                                            }}
                                            sx={{ width: 70, mx: 1 }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                                        <Typography variant="h6">
                                            R$ {(item.product.price * item.quantity).toFixed(2)}
                                        </Typography>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeFromCart(item.product.id)}
                                            sx={{ mt: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </ListItem>
                            {index < cart.items.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </Paper>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Resumo do Pedido
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Subtotal:</Typography>
                        <Typography>R$ {subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Frete:</Typography>
                        <Typography color={shipping === 0 ? 'success.main' : 'text.primary'}>
                            {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                        </Typography>
                    </Box>
                    {shipping === 0 && (
                        <Typography variant="caption" color="success.main">
                            Frete grátis para compras acima de R$ 100,00
                        </Typography>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">
                            R$ {total.toFixed(2)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearCart}
                >
                    Limpar Carrinho
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 4 }}
                    onClick={onCheckout}
                >
                    Finalizar Compra
                </Button>
            </Box>
        </Box>
    );
};

export default Cart;