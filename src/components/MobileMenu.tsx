import { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Typography,
    Divider,
    Collapse
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    Category,
    LocalOffer,
    ContactMail,
    ExpandLess,
    ExpandMore,
    Pets,
    SportsEsports,
    Diamond
} from '@mui/icons-material';
import { Category as CategoryType } from '../types';

interface MobileMenuProps {
    categories: CategoryType[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

const MobileMenu = ({ categories, selectedCategory, onCategoryChange }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const categoryIcons = {
        racao: <Pets />,
        brinquedos: <SportsEsports />,
        acessorios: <Diamond />
    };

    const handleCategoryClick = (categoryId: string) => {
        onCategoryChange(categoryId);
        setIsOpen(false);
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={() => setIsOpen(true)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                anchor="left"
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Box sx={{ width: 280, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Menu
                    </Typography>
                    <Divider />

                    <List>
                        <ListItem button onClick={() => handleCategoryClick('all')}>
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText primary="Início" />
                        </ListItem>

                        <ListItem button onClick={() => setCategoriesOpen(!categoriesOpen)}>
                            <ListItemIcon><Category /></ListItemIcon>
                            <ListItemText primary="Categorias" />
                            {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {categories.map((category) => (
                                    <ListItem 
                                        key={category.id}
                                        button 
                                        sx={{ pl: 4 }}
                                        onClick={() => handleCategoryClick(category.id)}
                                        selected={selectedCategory === category.id}
                                    >
                                        <ListItemIcon>
                                            {categoryIcons[category.id as keyof typeof categoryIcons]}
                                        </ListItemIcon>
                                        <ListItemText primary={category.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>

                        <ListItem button>
                            <ListItemIcon><LocalOffer /></ListItemIcon>
                            <ListItemText primary="Ofertas" />
                        </ListItem>

                        <ListItem button>
                            <ListItemIcon><ContactMail /></ListItemIcon>
                            <ListItemText primary="Contato" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default MobileMenu;