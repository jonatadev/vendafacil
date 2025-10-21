import { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Button,
    TextField
} from '@mui/material';
import { ArrowBack, Delete, Favorite } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { resolveProductImage } from '../utils/imageUtils';

interface UserAccountProps {
    onBack: () => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const UserAccount = ({ onBack }: UserAccountProps) => {
    const [tabValue, setTabValue] = useState(0);
    const { user, wishlist, userOrders, removeFromWishlist } = useUser();
    const { addToCart } = useCart();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'cancelled': return 'error';
            default: return 'warning';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'processing': return 'Processando';
            case 'shipped': return 'Enviado';
            case 'delivered': return 'Entregue';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    if (!user) return null;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">
                    Minha Conta
                </Typography>
            </Box>

            <Paper>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Perfil" />
                    <Tab label="Meus Pedidos" />
                    <Tab label="Lista de Desejos" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h5" gutterBottom>
                        Informações Pessoais
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nome"
                                value={user.name}
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="E-mail"
                                value={user.email}
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                value={user.phone}
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Endereço"
                                value={user.address}
                                disabled
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Estatísticas
                                </Typography>
                                <Typography>
                                    <strong>Cliente desde:</strong> {user.createdAt.toLocaleDateString()}
                                </Typography>
                                <Typography>
                                    <strong>Total de pedidos:</strong> {userOrders.length}
                                </Typography>
                                <Typography>
                                    <strong>Itens na lista de desejos:</strong> {wishlist.length}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h5" gutterBottom>
                        Histórico de Pedidos
                    </Typography>
                    {userOrders.length === 0 ? (
                        <Typography color="text.secondary">
                            Você ainda não fez nenhum pedido.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Pedido</TableCell>
                                        <TableCell>Data</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Itens</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                            <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={getStatusLabel(order.status)} 
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {order.items.map(item => `${item.product.name} (${item.quantity})`).join(', ')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h5" gutterBottom>
                        Lista de Desejos
                    </Typography>
                    {wishlist.length === 0 ? (
                        <Typography color="text.secondary">
                            Sua lista de desejos está vazia.
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {wishlist.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={resolveProductImage(product.imageUrl)}
                                            alt={product.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {product.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {product.description}
                                            </Typography>
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                R$ {product.price.toFixed(2)}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => addToCart(product)}
                                                    disabled={product.stock === 0}
                                                    sx={{ flexGrow: 1 }}
                                                >
                                                    Adicionar ao Carrinho
                                                </Button>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeFromWishlist(product.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default UserAccount;