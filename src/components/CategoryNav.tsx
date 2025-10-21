import { Box, Card, CardContent, Typography, Badge, Grid } from '@mui/material';
import { Pets, SportsEsports, Diamond } from '@mui/icons-material';
import { Category } from '../types';

interface CategoryNavProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    productCounts: Record<string, number>;
}

const CategoryNav = ({ categories, selectedCategory, onCategoryChange, productCounts }: CategoryNavProps) => {
    const categoryIcons = {
        racao: <Pets sx={{ fontSize: 40, color: 'primary.main' }} />,
        brinquedos: <SportsEsports sx={{ fontSize: 40, color: 'primary.main' }} />,
        acessorios: <Diamond sx={{ fontSize: 40, color: 'primary.main' }} />
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Categorias
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Card 
                        sx={{ 
                            cursor: 'pointer',
                            border: selectedCategory === 'all' ? 2 : 1,
                            borderColor: selectedCategory === 'all' ? 'primary.main' : 'divider',
                            '&:hover': { boxShadow: 4 }
                        }}
                        onClick={() => onCategoryChange('all')}
                    >
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h4">🏠</Typography>
                            </Box>
                            <Typography variant="h6">Todos</Typography>
                            <Badge badgeContent={productCounts.all} color="primary" />
                        </CardContent>
                    </Card>
                </Grid>
                {categories.map((category) => (
                    <Grid item xs={3} key={category.id}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                border: selectedCategory === category.id ? 2 : 1,
                                borderColor: selectedCategory === category.id ? 'primary.main' : 'divider',
                                '&:hover': { boxShadow: 4 }
                            }}
                            onClick={() => onCategoryChange(category.id)}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Box sx={{ mb: 1 }}>
                                    {categoryIcons[category.id as keyof typeof categoryIcons]}
                                </Box>
                                <Typography variant="h6">{category.name}</Typography>
                                <Badge 
                                    badgeContent={productCounts[category.id] || 0} 
                                    color="primary" 
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CategoryNav;