import { useState, useEffect } from 'react';
import {
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Zoom
} from '@mui/material';
import {
    KeyboardArrowUp,
    Compare,
    Favorite,
    Support,
    Menu as MenuIcon,
    Close
} from '@mui/icons-material';

const QuickActions = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const actions = [
        { icon: <Compare />, name: 'Comparar', onClick: () => console.log('Comparar') },
        { icon: <Favorite />, name: 'Favoritos', onClick: () => console.log('Favoritos') },
        { icon: <Support />, name: 'Suporte', onClick: () => console.log('Suporte') }
    ];

    return (
        <>
            {/* Botão Voltar ao Topo */}
            <Zoom in={showScrollTop}>
                <Fab
                    color="primary"
                    size="small"
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 16,
                        zIndex: 1000
                    }}
                >
                    <KeyboardArrowUp />
                </Fab>
            </Zoom>

            {/* Speed Dial com Ações Rápidas */}
            <SpeedDial
                ariaLabel="Ações rápidas"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
                icon={<SpeedDialIcon openIcon={<Close />} />}
                open={speedDialOpen}
                onOpen={() => setSpeedDialOpen(true)}
                onClose={() => setSpeedDialOpen(false)}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => {
                            action.onClick();
                            setSpeedDialOpen(false);
                        }}
                    />
                ))}
            </SpeedDial>
        </>
    );
};

export default QuickActions;