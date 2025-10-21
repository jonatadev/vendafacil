import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Avatar,
    Tabs,
    Tab
} from '@mui/material';
import { Edit, Delete, Add, ArrowBack, CloudUpload, Dashboard as DashboardIcon, Inventory, ShoppingCart, People, Settings as SettingsIcon } from '@mui/icons-material';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { saveImageToLocalStorage } from '../utils/imageUtils';
import DashboardComponent from './Dashboard';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import Settings from './Settings';

interface BackofficeProps {
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
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const Backoffice = ({ onBack }: BackofficeProps) => {
    const { products, addProduct, updateProduct, deleteProduct, updateStock } = useProducts();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stock: '',
        category: 'racao'
    });
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                imageUrl: product.imageUrl,
                stock: product.stock.toString(),
                category: product.category
            });
            setImagePreview(`/assets/images/${product.imageUrl}`);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                stock: '',
                category: 'racao'
            });
            setImagePreview('');
        }
        setOpenDialog(true);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImagePreview(result);
                // Gerar nome único para a imagem
                const fileName = `produto_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                // Salvar imagem no localStorage
                saveImageToLocalStorage(result, fileName);
                setFormData(prev => ({ ...prev, imageUrl: fileName }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            imageUrl: formData.imageUrl,
            stock: parseInt(formData.stock),
            category: formData.category
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setOpenDialog(false);
    };

    const handleStockUpdate = (id: number, newStock: string) => {
        const stock = parseInt(newStock);
        if (!isNaN(stock) && stock >= 0) {
            updateStock(id, stock);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">
                    Backoffice
                </Typography>
            </Box>

            <Paper>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
                    <Tab icon={<Inventory />} label="Produtos" iconPosition="start" />
                    <Tab icon={<ShoppingCart />} label="Pedidos" iconPosition="start" />
                    <Tab icon={<People />} label="Clientes" iconPosition="start" />
                    <Tab icon={<SettingsIcon />} label="Configurações" iconPosition="start" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <DashboardComponent />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5">
                                Gerenciar Produtos
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => handleOpenDialog()}
                            >
                                Adicionar Produto
                            </Button>
                        </Box>

                        <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Categoria</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Estoque</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                                        sx={{ width: 80 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(product)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                        </TableContainer>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <OrderManagement />
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <CustomerManagement />
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                    <Settings />
                </TabPanel>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nome do Produto"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Preço"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Estoque"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={formData.category}
                                    label="Categoria"
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <MenuItem value="racao">Rações</MenuItem>
                                    <MenuItem value="brinquedos">Brinquedos</MenuItem>
                                    <MenuItem value="acessorios">Acessórios</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUpload />}
                                >
                                    Upload Imagem
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                                {imagePreview && (
                                    <Avatar
                                        src={imagePreview}
                                        sx={{ width: 60, height: 60 }}
                                        variant="rounded"
                                    />
                                )}
                                <TextField
                                    label="Nome da Imagem"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    placeholder="ou digite o nome: produto.png"
                                    sx={{ flexGrow: 1 }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingProduct ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Backoffice;