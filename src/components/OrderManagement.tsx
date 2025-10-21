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
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { Visibility, Edit } from '@mui/icons-material';
import { useBackoffice } from '../contexts/BackofficeContext';
import { Order } from '../types';

const OrderManagement = () => {
    const { orders, updateOrderStatus } = useBackoffice();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<Order['status']>('pending');

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'processing': return 'Processando';
            case 'shipped': return 'Enviado';
            case 'delivered': return 'Entregue';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const handleStatusChange = () => {
        if (selectedOrder) {
            updateOrderStatus(selectedOrder.id, newStatus);
            setStatusDialogOpen(false);
            setSelectedOrder(null);
        }
    };

    const openStatusDialog = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setStatusDialogOpen(true);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gerenciar Pedidos
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={getStatusLabel(order.status)} 
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => openStatusDialog(order)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog para visualizar pedido */}
            <Dialog 
                open={Boolean(selectedOrder && !statusDialogOpen)} 
                onClose={() => setSelectedOrder(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Pedido #{selectedOrder?.id}
                </DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Informações do Cliente
                            </Typography>
                            <Typography>Nome: {selectedOrder.customerName}</Typography>
                            <Typography>Email: {selectedOrder.customerEmail}</Typography>
                            <Typography>Telefone: {selectedOrder.customerPhone}</Typography>
                            <Typography>Endereço: {selectedOrder.address}</Typography>
                            
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Itens do Pedido
                            </Typography>
                            <List>
                                {selectedOrder.items.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={item.product.name}
                                            secondary={`Quantidade: ${item.quantity} | Preço: R$ ${item.product.price.toFixed(2)}`}
                                        />
                                        <Typography>
                                            R$ {(item.product.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">R$ {selectedOrder.total.toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrder(null)}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para alterar status */}
            <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
                <DialogTitle>
                    Alterar Status do Pedido #{selectedOrder?.id}
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newStatus}
                            label="Status"
                            onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                        >
                            <MenuItem value="pending">Pendente</MenuItem>
                            <MenuItem value="processing">Processando</MenuItem>
                            <MenuItem value="shipped">Enviado</MenuItem>
                            <MenuItem value="delivered">Entregue</MenuItem>
                            <MenuItem value="cancelled">Cancelado</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleStatusChange} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderManagement;