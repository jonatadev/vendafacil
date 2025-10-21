import { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider
} from '@mui/material';
import { Visibility, ShoppingBag } from '@mui/icons-material';
import { useBackoffice } from '../contexts/BackofficeContext';
import { Customer } from '../types';

const CustomerManagement = () => {
    const { customers } = useBackoffice();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const getTotalSpent = (customer: Customer) => {
        return customer.orders.reduce((sum, order) => sum + order.total, 0);
    };

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

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gerenciar Clientes
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Pedidos</TableCell>
                            <TableCell>Total Gasto</TableCell>
                            <TableCell>Cadastro</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>#{customer.id}</TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.orders.length}</TableCell>
                                <TableCell>R$ {getTotalSpent(customer).toFixed(2)}</TableCell>
                                <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => setSelectedCustomer(customer)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog para visualizar cliente */}
            <Dialog 
                open={Boolean(selectedCustomer)} 
                onClose={() => setSelectedCustomer(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShoppingBag sx={{ mr: 1 }} />
                        Cliente: {selectedCustomer?.name}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedCustomer && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Informações Pessoais
                            </Typography>
                            <Typography><strong>Nome:</strong> {selectedCustomer.name}</Typography>
                            <Typography><strong>Email:</strong> {selectedCustomer.email}</Typography>
                            <Typography><strong>Telefone:</strong> {selectedCustomer.phone}</Typography>
                            <Typography><strong>Endereço:</strong> {selectedCustomer.address}</Typography>
                            <Typography><strong>Cliente desde:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</Typography>
                            
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Estatísticas
                            </Typography>
                            <Typography><strong>Total de Pedidos:</strong> {selectedCustomer.orders.length}</Typography>
                            <Typography><strong>Total Gasto:</strong> R$ {getTotalSpent(selectedCustomer).toFixed(2)}</Typography>
                            <Typography><strong>Ticket Médio:</strong> R$ {selectedCustomer.orders.length > 0 ? (getTotalSpent(selectedCustomer) / selectedCustomer.orders.length).toFixed(2) : '0.00'}</Typography>
                            
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Histórico de Pedidos
                            </Typography>
                            <List>
                                {selectedCustomer.orders.map((order) => (
                                    <div key={order.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`Pedido #${order.id} - R$ ${order.total.toFixed(2)}`}
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2">
                                                            Data: {new Date(order.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Itens: {order.items.map(item => `${item.product.name} (${item.quantity})`).join(', ')}
                                                        </Typography>
                                                        <Box sx={{ mt: 1 }}>
                                                            <Chip 
                                                                label={getStatusLabel(order.status)} 
                                                                color={getStatusColor(order.status)}
                                                                size="small"
                                                            />
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </div>
                                ))}
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedCustomer(null)}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerManagement;