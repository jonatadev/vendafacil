import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Paper } from '@mui/material';
import { Category } from '../types';

interface CategoryNavProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    productCounts: Record<string, number>;
}

const CategoryNav = ({ categories, selectedCategory, onCategoryChange, productCounts }: CategoryNavProps) => {
    return (
        <Paper sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
                Categorias
            </Typography>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedCategory === 'all'}
                        onClick={() => onCategoryChange('all')}
                    >
                        <ListItemText 
                            primary={`Todos (${productCounts.all})`}
                        />
                    </ListItemButton>
                </ListItem>
                {categories.map((category) => (
                    <ListItem key={category.id} disablePadding>
                        <ListItemButton
                            selected={selectedCategory === category.id}
                            onClick={() => onCategoryChange(category.id)}
                        >
                            <ListItemText 
                                primary={`${category.name} (${productCounts[category.id] || 0})`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CategoryNav;