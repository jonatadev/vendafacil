import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useBackoffice } from '../contexts/BackofficeContext';

interface CheckoutProps {
    onBack: () => void;
}

const Checkout = ({ onBack }: CheckoutProps) => {
    const { cart, processOrder } = useCart();
    const { user, addUserOrder } = useUser();
    const { addOrder, addCustomer } = useBackoffice();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        paymentMethod: 'credit'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cep: user.cep || '',
                address: user.address,
                number: user.number || '',
                complement: user.complement || '',
                neighborhood: user.neighborhood || '',
                city: user.city || '',
                state: user.state || ''
            }));
        }
    }, [user]);

    const subtotal = cart.total;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Criar pedido
        const newOrder = {
            items: cart.items,
            total,
            status: 'pending' as const,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            address: `${formData.address}, ${formData.number} ${formData.complement ? '- ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city}/${formData.state}, CEP: ${formData.cep}`,
            paymentMethod: formData.paymentMethod,
            createdAt: new Date()
        };
        
        // Adicionar ao backoffice
        addOrder(newOrder);
        
        // Adicionar ao histórico do usuário se logado
        if (user) {
            addUserOrder({ ...newOrder, id: Date.now() });
        } else {
            // Criar cliente se não estiver logado
            addCustomer({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: newOrder.address,
                orders: [],
                createdAt: new Date()
            });
        }
        
        let message = 'Pedido realizado com sucesso!\n\n';
        
        switch (formData.paymentMethod) {
            case 'credit':
            case 'debit':
                message += `Pagamento: Cartão ${formData.paymentMethod === 'credit' ? 'de Crédito' : 'de Débito'}\n`;
                message += 'Cartão: **** **** **** 3456\n';
                message += 'Status: Aprovado (Teste)';
                break;
            case 'pix':
                message += 'Pagamento: PIX\n';
                message += 'Chave: teste@vendafacil.com\n';
                message += 'Status: Aguardando pagamento (Teste)';
                break;
            case 'boleto':
                message += 'Pagamento: Boleto Bancário\n';
                message += `Vencimento: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n`;
                message += 'Status: Gerado (Teste)';
                break;
        }
        
        message += `\n\nTotal: R$ ${total.toFixed(2)}`;
        alert(message);
        processOrder();
        onBack();
    };

    const isFormValid = formData.name && formData.email && formData.phone && 
                       formData.cep && formData.address && formData.city;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">
                    Finalizar Compra
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Dados Pessoais
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="E-mail"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Endereço de Entrega
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="CEP"
                                    value={formData.cep}
                                    onChange={(e) => handleInputChange('cep', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Endereço"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    fullWidth
                                    label="Número"
                                    value={formData.number}
                                    onChange={(e) => handleInputChange('number', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Complemento"
                                    value={formData.complement}
                                    onChange={(e) => handleInputChange('complement', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Bairro"
                                    value={formData.neighborhood}
                                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    label="Cidade"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={formData.state}
                                        label="Estado"
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                    >
                                        <MenuItem value="AC">Acre</MenuItem>
                                        <MenuItem value="AL">Alagoas</MenuItem>
                                        <MenuItem value="AP">Amapá</MenuItem>
                                        <MenuItem value="AM">Amazonas</MenuItem>
                                        <MenuItem value="BA">Bahia</MenuItem>
                                        <MenuItem value="CE">Ceará</MenuItem>
                                        <MenuItem value="DF">Distrito Federal</MenuItem>
                                        <MenuItem value="ES">Espírito Santo</MenuItem>
                                        <MenuItem value="GO">Goiás</MenuItem>
                                        <MenuItem value="MA">Maranhão</MenuItem>
                                        <MenuItem value="MT">Mato Grosso</MenuItem>
                                        <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                                        <MenuItem value="MG">Minas Gerais</MenuItem>
                                        <MenuItem value="PA">Pará</MenuItem>
                                        <MenuItem value="PB">Paraíba</MenuItem>
                                        <MenuItem value="PR">Paraná</MenuItem>
                                        <MenuItem value="PE">Pernambuco</MenuItem>
                                        <MenuItem value="PI">Piauí</MenuItem>
                                        <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                                        <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                                        <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                                        <MenuItem value="RO">Rondônia</MenuItem>
                                        <MenuItem value="RR">Roraima</MenuItem>
                                        <MenuItem value="SC">Santa Catarina</MenuItem>
                                        <MenuItem value="SP">São Paulo</MenuItem>
                                        <MenuItem value="SE">Sergipe</MenuItem>
                                        <MenuItem value="TO">Tocantins</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Forma de Pagamento
                        </Typography>
                        <RadioGroup
                            value={formData.paymentMethod}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        >
                            <FormControlLabel 
                                value="credit" 
                                control={<Radio />} 
                                label="Cartão de Crédito" 
                            />
                            <FormControlLabel 
                                value="debit" 
                                control={<Radio />} 
                                label="Cartão de Débito" 
                            />
                            <FormControlLabel 
                                value="pix" 
                                control={<Radio />} 
                                label="PIX" 
                            />
                            <FormControlLabel 
                                value="boleto" 
                                control={<Radio />} 
                                label="Boleto Bancário" 
                            />
                        </RadioGroup>

                        {(formData.paymentMethod === 'credit' || formData.paymentMethod === 'debit') && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Dados do Cartão (Teste)
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Número do Cartão"
                                            placeholder="1234 5678 9012 3456"
                                            disabled
                                            value="1234 5678 9012 3456"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Validade"
                                            placeholder="12/25"
                                            disabled
                                            value="12/25"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="CVV"
                                            placeholder="123"
                                            disabled
                                            value="123"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Nome no Cartão"
                                            placeholder="NOME TESTE"
                                            disabled
                                            value="NOME TESTE"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {formData.paymentMethod === 'pix' && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    PIX (Teste)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Chave PIX: teste@vendafacil.com
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Valor: R$ {total.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    * Dados fictícios para demonstração
                                </Typography>
                            </Box>
                        )}

                        {formData.paymentMethod === 'boleto' && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Boleto Bancário (Teste)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Código de barras: 12345.67890 12345.678901 12345.678901 1 23456789012345
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Vencimento: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    * Dados fictícios para demonstração
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Resumo do Pedido
                            </Typography>
                            
                            {cart.items.map((item) => (
                                <Box key={item.product.id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">
                                            {item.product.name} x{item.quantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            R$ {(item.product.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal:</Typography>
                                <Typography>R$ {subtotal.toFixed(2)}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Frete:</Typography>
                                <Typography color={shipping === 0 ? 'success.main' : 'text.primary'}>
                                    {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" color="primary">
                                    R$ {total.toFixed(2)}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={!isFormValid}
                            >
                                Finalizar Pedido
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Checkout;