import { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography
} from '@mui/material';
import {
    AccountCircle,
    ShoppingBag,
    Favorite,
    Settings,
    Logout,
    Login
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';

interface UserMenuProps {
    onLoginClick: () => void;
    onAccountClick: () => void;
}

const UserMenu = ({ onLoginClick, onAccountClick }: UserMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useUser();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    const handleAccount = () => {
        onAccountClick();
        handleClose();
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ ml: 1 }}
            >
                <Avatar sx={{ width: 32, height: 32 }}>
                    <AccountCircle />
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {user ? (
                    [
                        <MenuItem key="user-info" disabled>
                            <Typography variant="body2" color="text.secondary">
                                Olá, {user.name}
                            </Typography>
                        </MenuItem>,
                        <Divider key="divider1" />,
                        <MenuItem key="account" onClick={handleAccount}>
                            <ListItemIcon><AccountCircle /></ListItemIcon>
                            <ListItemText>Minha Conta</ListItemText>
                        </MenuItem>,
                        <MenuItem key="orders" onClick={handleAccount}>
                            <ListItemIcon><ShoppingBag /></ListItemIcon>
                            <ListItemText>Meus Pedidos</ListItemText>
                        </MenuItem>,
                        <MenuItem key="favorites" onClick={handleAccount}>
                            <ListItemIcon><Favorite /></ListItemIcon>
                            <ListItemText>Lista de Desejos</ListItemText>
                        </MenuItem>,
                        <Divider key="divider2" />,
                        <MenuItem key="logout" onClick={handleLogout}>
                            <ListItemIcon><Logout /></ListItemIcon>
                            <ListItemText>Sair</ListItemText>
                        </MenuItem>
                    ]
                ) : (
                    <MenuItem onClick={() => { onLoginClick(); handleClose(); }}>
                        <ListItemIcon><Login /></ListItemIcon>
                        <ListItemText>Entrar / Cadastrar</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

export default UserMenu;