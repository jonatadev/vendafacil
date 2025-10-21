import { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    TextField,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';
import { useBackoffice } from '../contexts/BackofficeContext';
import { loadStoreConfig, saveStoreConfig, StoreConfig } from '../config/store';
import { resizeImage } from '../utils/imageUtils';

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

const Settings = () => {
    const { paymentMethods, updatePaymentMethod, shippingConfig, updateShippingConfig } = useBackoffice();
    const [tabValue, setTabValue] = useState(0);
    const [storeConfig, setStoreConfig] = useState<StoreConfig>(loadStoreConfig());
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [newCategory, setNewCategory] = useState({ id: '', name: '' });

    const handleStoreConfigChange = (field: keyof StoreConfig, value: string) => {
        const newConfig = { ...storeConfig, [field]: value };
        setStoreConfig(newConfig);
        saveStoreConfig(newConfig);
    };

    const handleContactChange = (field: keyof StoreConfig['contact'], value: string) => {
        const newConfig = {
            ...storeConfig,
            contact: {
                ...storeConfig.contact,
                [field]: value
            }
        };
        setStoreConfig(newConfig);
        saveStoreConfig(newConfig);
    };

    const handleHeaderChange = (field: string, value: string) => {
        const newConfig = {
            ...storeConfig,
            header: {
                ...storeConfig.header,
                [field]: value,
                style: (field === 'style' ? value : storeConfig.header?.style || 'gradient') as 'image' | 'solid' | 'gradient'
            }
        };
        setStoreConfig(newConfig);
        saveStoreConfig(newConfig);
    };

    const handleHeaderImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file, 1920, 160, 0.9);
                handleHeaderChange('backgroundImage', resizedImage);
            } catch (error) {
                console.error('Erro ao redimensionar imagem:', error);
            }
        }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file, 300, 80, 0.9);
                handleStoreConfigChange('logo', resizedImage);
            } catch (error) {
                console.error('Erro ao redimensionar imagem:', error);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Configurações
            </Typography>

            <Paper>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Loja" />
                    <Tab label="Categorias" />
                    <Tab label="Pagamento" />
                    <Tab label="Frete" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h6" gutterBottom>
                        Configurações da Loja
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nome da Loja"
                                value={storeConfig.name}
                                onChange={(e) => handleStoreConfigChange('name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Descrição"
                                value={storeConfig.description}
                                onChange={(e) => handleStoreConfigChange('description', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Cor Primária"
                                type="color"
                                value={storeConfig.primaryColor}
                                onChange={(e) => handleStoreConfigChange('primaryColor', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Cor Secundária"
                                type="color"
                                value={storeConfig.secondaryColor}
                                onChange={(e) => handleStoreConfigChange('secondaryColor', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Informações de Contato
                            </Typography>
                            <TextField
                                fullWidth
                                label="E-mail de Contato"
                                value={storeConfig.contact?.email || ''}
                                onChange={(e) => handleContactChange('email', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                value={storeConfig.contact?.phone || ''}
                                onChange={(e) => handleContactChange('phone', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Endereço/Cidade"
                                value={storeConfig.contact?.address || ''}
                                onChange={(e) => handleContactChange('address', e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Personalização do Header
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Estilo do Header</InputLabel>
                                <Select
                                    value={storeConfig.header?.style || 'gradient'}
                                    label="Estilo do Header"
                                    onChange={(e) => handleHeaderChange('style', e.target.value)}
                                >
                                    <MenuItem value="gradient">Gradiente</MenuItem>
                                    <MenuItem value="solid">Cor Sólida</MenuItem>
                                    <MenuItem value="image">Imagem de Fundo</MenuItem>
                                </Select>
                            </FormControl>
                            
                            {storeConfig.header?.style === 'solid' && (
                                <TextField
                                    fullWidth
                                    label="Cor de Fundo"
                                    type="color"
                                    value={storeConfig.header?.backgroundColor || '#1976d2'}
                                    onChange={(e) => handleHeaderChange('backgroundColor', e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}
                            
                            {storeConfig.header?.style === 'image' && (
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        sx={{ mb: 1 }}
                                    >
                                        Upload Imagem Header
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleHeaderImageUpload}
                                        />
                                    </Button>
                                    {storeConfig.header?.backgroundImage && (
                                        <Box sx={{ mt: 1 }}>
                                            <img
                                                src={storeConfig.header.backgroundImage}
                                                alt="Header Background"
                                                style={{ maxWidth: 200, maxHeight: 60, objectFit: 'cover' }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                            
                            <TextField
                                fullWidth
                                label="Cor do Texto"
                                type="color"
                                value={storeConfig.header?.textColor || '#ffffff'}
                                onChange={(e) => handleHeaderChange('textColor', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Logo da Loja
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                sx={{ mb: 2 }}
                            >
                                Upload Logo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                            </Button>
                            {storeConfig.logo && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={storeConfig.logo}
                                        alt="Logo"
                                        style={{ maxWidth: 200, maxHeight: 100 }}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">
                            Gerenciar Categorias
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setCategoryDialog(true)}
                        >
                            Adicionar Categoria
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>racao</TableCell>
                                    <TableCell>Rações</TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Edit /></IconButton>
                                        <IconButton size="small" color="error"><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>brinquedos</TableCell>
                                    <TableCell>Brinquedos</TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Edit /></IconButton>
                                        <IconButton size="small" color="error"><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>acessorios</TableCell>
                                    <TableCell>Acessórios</TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Edit /></IconButton>
                                        <IconButton size="small" color="error"><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom>
                        Formas de Pagamento
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Método</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentMethods.map((method) => (
                                    <TableRow key={method.id}>
                                        <TableCell>{method.name}</TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={method.enabled}
                                                        onChange={(e) => updatePaymentMethod(method.id, { enabled: e.target.checked })}
                                                    />
                                                }
                                                label={method.enabled ? 'Ativo' : 'Inativo'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small">
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Typography variant="h6" gutterBottom>
                        Configurações de Frete
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Valor Mínimo para Frete Grátis"
                                type="number"
                                value={shippingConfig.freeShippingThreshold}
                                onChange={(e) => updateShippingConfig({ freeShippingThreshold: Number(e.target.value) })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Custo Padrão do Frete"
                                type="number"
                                value={shippingConfig.defaultShippingCost}
                                onChange={(e) => updateShippingConfig({ defaultShippingCost: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Regiões de Entrega
                            </Typography>
                            {shippingConfig.regions.map((region, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                    <TextField
                                        size="small"
                                        value={region.name}
                                        disabled
                                    />
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={region.cost}
                                        disabled
                                    />
                                </Box>
                            ))}
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Dialog para adicionar categoria */}
            <Dialog open={categoryDialog} onClose={() => setCategoryDialog(false)}>
                <DialogTitle>Adicionar Categoria</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="ID da Categoria"
                        value={newCategory.id}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, id: e.target.value }))}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Nome da Categoria"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCategoryDialog(false)}>Cancelar</Button>
                    <Button variant="contained">Adicionar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Settings;