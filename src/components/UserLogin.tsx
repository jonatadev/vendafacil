import { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Tabs,
    Tab,
    Grid
} from '@mui/material';
import { useUser } from '../contexts/UserContext';

interface UserLoginProps {
    onClose: () => void;
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

const UserLogin = ({ onClose }: UserLoginProps) => {
    const [tabValue, setTabValue] = useState(0);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { login, register } = useUser();

    const handleLogin = () => {
        if (login(loginData.email, loginData.password)) {
            onClose();
        } else {
            setError('Email ou senha incorretos');
        }
    };

    const handleRegister = () => {
        if (registerData.password !== registerData.confirmPassword) {
            setError('Senhas não coincidem');
            return;
        }
        
        const { confirmPassword, password, ...userData } = registerData;
        if (register(userData)) {
            onClose();
        } else {
            setError('Erro ao criar conta');
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
        }}>
            <Paper sx={{ maxWidth: 500, width: '100%' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered>
                    <Tab label="Entrar" />
                    <Tab label="Cadastrar" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                    </Alert>
                )}

                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h5" gutterBottom textAlign="center">
                        Entrar na Conta
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="E-mail"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Senha"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        sx={{ mb: 3 }}
                    />
                    
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogin}
                        size="large"
                        sx={{ mb: 2 }}
                    >
                        Entrar
                    </Button>

                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Conta de teste:</strong><br />
                            E-mail: joao@email.com<br />
                            Senha: 123456
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h5" gutterBottom textAlign="center">
                        Criar Conta
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nome Completo"
                                value={registerData.name}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="E-mail"
                                type="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefone"
                                value={registerData.phone}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Endereço"
                                value={registerData.address}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Senha"
                                type="password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirmar Senha"
                                type="password"
                                value={registerData.confirmPassword}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </Grid>
                    </Grid>
                    
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleRegister}
                        size="large"
                        sx={{ mt: 3 }}
                    >
                        Criar Conta
                    </Button>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default UserLogin;