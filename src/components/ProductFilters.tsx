import { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Typography,
    Paper,
    InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface ProductFiltersProps {
    onSearchChange: (search: string) => void;
    onPriceRangeChange: (range: [number, number]) => void;
    onSortChange: (sort: string) => void;
    maxPrice: number;
}

const ProductFilters = ({ onSearchChange, onPriceRangeChange, onSortChange, maxPrice }: ProductFiltersProps) => {
    const [search, setSearch] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
    const [sort, setSort] = useState('name');

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onSearchChange(value);
    };

    const handlePriceChange = (value: number | number[]) => {
        const range = value as [number, number];
        setPriceRange(range);
        onPriceRangeChange(range);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        onSortChange(value);
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 250 }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                        value={sort}
                        label="Ordenar por"
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <MenuItem value="name">Nome</MenuItem>
                        <MenuItem value="price-asc">Menor preço</MenuItem>
                        <MenuItem value="price-desc">Maior preço</MenuItem>
                        <MenuItem value="stock">Estoque</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ minWidth: 200 }}>
                    <Typography gutterBottom>
                        Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                    </Typography>
                    <Slider
                        value={priceRange}
                        onChange={(_, value) => handlePriceChange(value)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={maxPrice}
                        step={10}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default ProductFilters;