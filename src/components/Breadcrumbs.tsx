import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { Category } from '../types';

interface BreadcrumbsProps {
    selectedCategory: string;
    categories: Category[];
    onCategoryChange: (categoryId: string) => void;
}

const Breadcrumbs = ({ selectedCategory, categories, onCategoryChange }: BreadcrumbsProps) => {
    const currentCategory = categories.find(cat => cat.id === selectedCategory);

    return (
        <MuiBreadcrumbs sx={{ mb: 2 }}>
            <Link
                component="button"
                variant="body2"
                onClick={() => onCategoryChange('all')}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: selectedCategory === 'all' ? 'primary.main' : 'text.primary',
                    '&:hover': { textDecoration: 'underline' }
                }}
            >
                <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Início
            </Link>
            {currentCategory && (
                <Typography color="text.primary">
                    {currentCategory.name}
                </Typography>
            )}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;