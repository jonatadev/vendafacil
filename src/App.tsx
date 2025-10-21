import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Toolbar, Typography, IconButton, Badge, Box, ThemeProvider, createTheme } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { CartProvider, useCart } from './contexts/CartContext';
import { ProductProvider, useProducts } from './contexts/ProductContext';
import { BackofficeProvider } from './contexts/BackofficeContext';
import { UserProvider } from './contexts/UserContext';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductFilters from './components/ProductFilters';
import CategoryNav from './components/CategoryNav';
import Breadcrumbs from './components/Breadcrumbs';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import Backoffice from './components/Backoffice';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import MainNavigation from './components/MainNavigation';
import UserMenu from './components/UserMenu';
import UserLogin from './components/UserLogin';
import UserAccount from './components/UserAccount';
import { Product, Category } from './types';
import { loadStoreConfig, StoreConfig } from './config/store';

const categories: Category[] = [
    { id: 'racao', name: 'Rações' },
    { id: 'brinquedos', name: 'Brinquedos' },
    { id: 'acessorios', name: 'Acessórios' }
];



function Header({ isCartOpen, setIsCartOpen, config, onLoginClick, onAccountClick }: { 
    isCartOpen: boolean, 
    setIsCartOpen: (open: boolean) => void, 
    config: StoreConfig,
    onLoginClick: () => void,
    onAccountClick: () => void
}) {
  const { cart } = useCart();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ minHeight: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {config.logo && (
            <img 
              src={config.logo} 
              alt={config.name}
              style={{ 
                height: 80, 
                maxWidth: 300, 
                marginRight: 16,
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <Typography 
            variant="h6" 
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            {config.name}
          </Typography>
        </Box>
        <IconButton
          color="inherit"
          aria-label="Abrir carrinho"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <Badge color="secondary" badgeContent={itemCount}>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <UserMenu 
          onLoginClick={onLoginClick} 
          onAccountClick={onAccountClick}
        />
      </Toolbar>
    </AppBar>
  );
}

function StorePage() {
    const { products } = useProducts();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [sortBy, setSortBy] = useState('name');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCheckout, setIsCheckout] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [config, setConfig] = useState<StoreConfig>(loadStoreConfig());

    useEffect(() => {
        setConfig(loadStoreConfig());
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: config.primaryColor,
            },
            secondary: {
                main: config.secondaryColor,
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        ...(config.header?.style === 'gradient' && {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }),
                        ...(config.header?.style === 'solid' && {
                            backgroundColor: config.header.backgroundColor || config.primaryColor
                        }),
                        ...(config.header?.style === 'image' && config.header.backgroundImage && {
                            backgroundImage: `url(${config.header.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }),
                        color: config.header?.textColor || '#ffffff',
                        minHeight: config.header?.height || 160,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                }
            }
        }
    });

    const productCounts = useMemo(() => {
        const counts: Record<string, number> = { all: products.length };
        categories.forEach(category => {
            counts[category.id] = products.filter(p => p.category === category.id).length;
        });
        return counts;
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesPrice && matchesCategory;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'stock': return b.stock - a.stock;
                default: return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [products, searchTerm, priceRange, sortBy, selectedCategory]);

    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 200;

    const getRelatedProducts = (product: Product) => {
        return products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
    };

    const handleCheckout = () => {
        setIsCheckout(true);
    };

    const handleBackFromCheckout = () => {
        setIsCheckout(false);
    };





    return (
        <ThemeProvider theme={theme}>
            <CartProvider>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header 
                        isCartOpen={isCartOpen} 
                        setIsCartOpen={setIsCartOpen} 
                        config={config}
                        onLoginClick={() => setShowLogin(true)}
                        onAccountClick={() => setShowAccount(true)}
                    />
                    <MainNavigation
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={(categoryId) => {
                            setSelectedCategory(categoryId);
                            setSelectedProduct(null);
                            setIsCartOpen(false);
                            setIsCheckout(false);
                            setShowLogin(false);
                            setShowAccount(false);
                        }}
                        productCounts={productCounts}
                    />
                    <Container sx={{ flex: 1 }}>
                        <Box sx={{ mt: 4 }}>
                    {showLogin ? (
                        <UserLogin onClose={() => setShowLogin(false)} />
                    ) : showAccount ? (
                        <UserAccount onBack={() => setShowAccount(false)} />
                    ) : isCheckout ? (
                        <Checkout onBack={handleBackFromCheckout} />
                    ) : isCartOpen ? (
                        <Cart onCheckout={handleCheckout} />
                    ) : selectedProduct ? (
                        <ProductDetail
                            product={selectedProduct}
                            onBack={handleBackToList}
                            relatedProducts={getRelatedProducts(selectedProduct)}
                            onProductClick={handleProductClick}
                        />
                    ) : (
                        <>
                            <Breadcrumbs
                                selectedCategory={selectedCategory}
                                categories={categories}
                                onCategoryChange={setSelectedCategory}
                            />
                            <CategoryNav
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                productCounts={productCounts}
                            />
                            <ProductFilters
                                onSearchChange={setSearchTerm}
                                onPriceRangeChange={setPriceRange}
                                onSortChange={setSortBy}
                                maxPrice={maxPrice}
                            />
                            <ProductList 
                                products={filteredProducts} 
                                onProductClick={handleProductClick}
                            />
                        </>
                    )}
                        </Box>
                    </Container>
                    <Footer config={config} />
                </Box>
            </CartProvider>
        </ThemeProvider>
    );
}

function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('admin_logged') === 'true';
    });
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_logged');
        setIsLoggedIn(false);
        navigate('/');
    };

    if (!isLoggedIn) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return <Backoffice onBack={handleLogout} />;
}

function App() {
    return (
        <Router basename="/vendafacil">
            <UserProvider>
                <ProductProvider>
                    <BackofficeProvider>
                        <Routes>
                            <Route path="/" element={<StorePage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BackofficeProvider>
                </ProductProvider>
            </UserProvider>
        </Router>
    );
}

export default App;