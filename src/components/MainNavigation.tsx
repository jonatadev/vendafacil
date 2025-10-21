import { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Menu,
    MenuItem,
    Typography,
    Badge
} from '@mui/material';
import { Home, Category, LocalOffer, ContactMail } from '@mui/icons-material';
import { Category as CategoryType } from '../types';

interface MainNavigationProps {
    categories: CategoryType[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    productCounts: Record<string, number>;
}

const MainNavigation = ({ categories, selectedCategory, onCategoryChange, productCounts }: MainNavigationProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentTab, setCurrentTab] = useState(selectedCategory === 'all' ? 0 : 1);

    const handleCategoriesClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCategorySelect = (categoryId: string) => {
        onCategoryChange(categoryId);
        setAnchorEl(null);
        setCurrentTab(categoryId === 'all' ? 0 : 1);
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        if (newValue === 0) {
            onCategoryChange('all');
        }
    };

    return (
        <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: { xs: 'none', md: 'block' }
        }}>
            <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                sx={{ px: 2 }}
            >
                <Tab 
                    icon={<Home />} 
                    label="Início" 
                    iconPosition="start"
                />
                <Tab 
                    icon={<Category />} 
                    label="Categorias" 
                    iconPosition="start"
                    onClick={handleCategoriesClick}
                />
                <Tab 
                    icon={<LocalOffer />} 
                    label="Ofertas" 
                    iconPosition="start"
                />
                <Tab 
                    icon={<ContactMail />} 
                    label="Contato" 
                    iconPosition="start"
                />
            </Tabs>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => handleCategorySelect('all')}>
                    <Typography>Todos os Produtos</Typography>
                    <Badge badgeContent={productCounts.all} color="primary" sx={{ ml: 2 }} />
                </MenuItem>
                {categories.map((category) => (
                    <MenuItem 
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                    >
                        <Typography>{category.name}</Typography>
                        <Badge 
                            badgeContent={productCounts[category.id] || 0} 
                            color="primary" 
                            sx={{ ml: 2 }} 
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default MainNavigation;