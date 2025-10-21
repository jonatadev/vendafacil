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
    TextField,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { ArrowBack, Delete, Edit, PhotoCamera } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { resolveProductImage, resizeImage } from '../utils/imageUtils';

interface UserAccountProps {
    onBack: () => void;
    initialTab?: number;
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

const UserAccount = ({ onBack, initialTab = 0 }: UserAccountProps) => {
    const [tabValue, setTabValue] = useState(initialTab);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ 
        name: '', 
        phone: '', 
        address: '', 
        cep: '', 
        number: '', 
        complement: '', 
        neighborhood: '', 
        city: '', 
        state: '' 
    });
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const { user, wishlist, userOrders, removeFromWishlist, updateUser } = useUser();
    const { addToCart } = useCart();

    const handleEditStart = () => {
        if (user) {
            setEditData({
                name: user.name,
                phone: user.phone,
                address: user.address,
                cep: user.cep || '',
                number: user.number || '',
                complement: user.complement || '',
                neighborhood: user.neighborhood || '',
                city: user.city || '',
                state: user.state || ''
            });
            setProfilePhoto(user.profilePhoto || null);
            setIsEditing(true);
        }
    };

    const handleEditSave = () => {
        if (user) {
            updateUser({
                ...editData,
                profilePhoto
            });
            setIsEditing(false);
            setShowPasswordFields(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file, 200, 200, 0.8);
                setProfilePhoto(resizedImage);
            } catch (error) {
                console.error('Erro ao redimensionar imagem:', error);
                // Fallback para o método original
                const reader = new FileReader();
                reader.onload = (e) => {
                    setProfilePhoto(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">
                            Informações Pessoais
                        </Typography>
                        {!isEditing ? (
                            <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={handleEditStart}
                            >
                                Editar Perfil
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleEditSave}
                                >
                                    Salvar
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    src={isEditing ? profilePhoto || undefined : user.profilePhoto || undefined}
                                    sx={{ width: 80, height: 80, mr: 2 }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                {isEditing && (
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<PhotoCamera />}
                                        size="small"
                                    >
                                        Alterar Foto
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                        />
                                    </Button>
                                )}
                            </Box>
                            <TextField
                                fullWidth
                                label="Nome"
                                value={isEditing ? editData.name : user.name}
                                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                disabled={!isEditing}
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
                                value={isEditing ? editData.phone : user.phone}
                                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="CEP"
                                value={isEditing ? editData.cep : user.cep || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, cep: e.target.value }))}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Endereço"
                                value={isEditing ? editData.address : user.address}
                                onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Número"
                                    value={isEditing ? editData.number : user.number || ''}
                                    onChange={(e) => setEditData(prev => ({ ...prev, number: e.target.value }))}
                                    disabled={!isEditing}
                                    sx={{ width: '30%' }}
                                />
                                <TextField
                                    label="Complemento"
                                    value={isEditing ? editData.complement : user.complement || ''}
                                    onChange={(e) => setEditData(prev => ({ ...prev, complement: e.target.value }))}
                                    disabled={!isEditing}
                                    sx={{ width: '70%' }}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="Bairro"
                                value={isEditing ? editData.neighborhood : user.neighborhood || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, neighborhood: e.target.value }))}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Cidade"
                                    value={isEditing ? editData.city : user.city || ''}
                                    onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                                    disabled={!isEditing}
                                    sx={{ width: '70%' }}
                                />
                                <FormControl sx={{ width: '30%' }} disabled={!isEditing}>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={isEditing ? editData.state : user.state || ''}
                                        label="Estado"
                                        onChange={(e) => setEditData(prev => ({ ...prev, state: e.target.value }))}
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
                            </Box>
                            {isEditing && (
                                <Button
                                    variant="text"
                                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                                    sx={{ mb: 2 }}
                                >
                                    {showPasswordFields ? 'Cancelar alteração de senha' : 'Alterar senha'}
                                </Button>
                            )}
                            {isEditing && showPasswordFields && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Senha atual"
                                        type="password"
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Nova senha"
                                        type="password"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Confirmar nova senha"
                                        type="password"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                        error={passwordData.new !== passwordData.confirm && passwordData.confirm !== ''}
                                        helperText={passwordData.new !== passwordData.confirm && passwordData.confirm !== '' ? 'Senhas não coincidem' : ''}
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Estatísticas
                                </Typography>
                                <Typography>
                                    <strong>Cliente desde:</strong> {new Date(user.createdAt).toLocaleDateString('pt-BR')}
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
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
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
                                                    Comprar
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