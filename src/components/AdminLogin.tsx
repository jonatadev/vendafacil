import { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert
} from '@mui/material';

interface AdminLoginProps {
    onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Credenciais simples para demonstração
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            localStorage.setItem('admin_logged', 'true');
            onLogin();
        } else {
            setError('Usuário ou senha incorretos');
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
        }}>
            <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Login Administrativo
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Usuário"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    sx={{ mb: 2 }}
                />
                
                <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    sx={{ mb: 3 }}
                />
                
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    size="large"
                >
                    Entrar
                </Button>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        <strong>Credenciais de teste:</strong><br />
                        Usuário: admin<br />
                        Senha: admin123
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminLogin;