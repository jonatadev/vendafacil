import { Box, Typography, Container, Grid, Link } from '@mui/material';
import { StoreConfig } from '../config/store';

interface FooterProps {
    config: StoreConfig;
}

const Footer = ({ config }: FooterProps) => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                mt: 'auto',
                py: 3
            }}
        >
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            {config.name}
                        </Typography>
                        <Typography variant="body2">
                            {config.description}
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Contato
                        </Typography>
                        <Typography variant="body2">
                            📧 {config.contact?.email || `contato@${config.name.toLowerCase().replace(/\s+/g, '')}.com`}
                        </Typography>
                        <Typography variant="body2">
                            📱 {config.contact?.phone || '(11) 99999-9999'}
                        </Typography>
                        <Typography variant="body2">
                            📍 {config.contact?.address || 'São Paulo, SP'}
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Informações
                        </Typography>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
                            Sobre Nós
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
                            Política de Privacidade
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block' }}>
                            Termos de Uso
                        </Link>
                    </Grid>
                </Grid>
                
                <Box sx={{ borderTop: 1, borderColor: 'rgba(255,255,255,0.2)', mt: 3, pt: 2 }}>
                    <Typography variant="body2" textAlign="center">
                        © {new Date().getFullYear()} {config.name}. Todos os direitos reservados.
                    </Typography>
                    <Typography variant="caption" textAlign="center" display="block" sx={{ mt: 1 }}>
                        Desenvolvido com VendaFácil - Sistema Open Source
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;