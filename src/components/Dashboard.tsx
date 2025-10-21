import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { TrendingUp, ShoppingCart, People, Warning } from '@mui/icons-material';
import { useProducts } from '../contexts/ProductContext';
import { useBackoffice } from '../contexts/BackofficeContext';

const Dashboard = () => {
    const { products } = useProducts();
    const { orders, customers } = useBackoffice();

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

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const lowStockProducts = products.filter(p => p.stock <= 5);

    const productSales = products.map(product => {
        const sales = orders.reduce((sum, order) => {
            const item = order.items.find(i => i.product.id === product.id);
            return sum + (item ? item.quantity : 0);
        }, 0);
        return { ...product, sales };
    }).sort((a, b) => b.sales - a.sales);

    const recentOrders = orders.slice(-5).reverse();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TrendingUp color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">R$ {totalRevenue.toFixed(2)}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Receita Total
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ShoppingCart color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{totalOrders}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Pedidos
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <People color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{totalCustomers}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Clientes
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Warning color="error" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{lowStockProducts.length}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Estoque Baixo
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Produtos Mais Vendidos
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="right">Vendas</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productSales.slice(0, 5).map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell align="right">{product.sales}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Estoque Baixo
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="right">Estoque</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lowStockProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell align="right">
                                                    <Chip 
                                                        label={product.stock} 
                                                        color="error" 
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Pedidos Recentes
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Data</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>#{order.id}</TableCell>
                                                <TableCell>{order.customerName}</TableCell>
                                                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={getStatusLabel(order.status)} 
                                                        color={order.status === 'delivered' ? 'success' : 'primary'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;