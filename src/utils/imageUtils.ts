// Utilitários para gerenciar imagens de produtos

export const saveImageToLocalStorage = (imageData: string, fileName: string): string => {
    try {
        localStorage.setItem(`product_image_${fileName}`, imageData);
        return fileName;
    } catch (error) {
        console.warn('Erro ao salvar imagem:', error);
        return '';
    }
};

export const getImageFromLocalStorage = (fileName: string): string | null => {
    try {
        return localStorage.getItem(`product_image_${fileName}`);
    } catch (error) {
        console.warn('Erro ao carregar imagem:', error);
        return null;
    }
};

export const deleteImageFromLocalStorage = (fileName: string): void => {
    try {
        localStorage.removeItem(`product_image_${fileName}`);
    } catch (error) {
        console.warn('Erro ao deletar imagem:', error);
    }
};

export const resolveProductImage = (imageUrl: string): string => {
    // Primeiro tenta carregar do localStorage
    const localImage = getImageFromLocalStorage(imageUrl);
    if (localImage) {
        return localImage;
    }
    
    // Fallback para imagens da pasta assets
    if (imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    
    // Usar caminho absoluto com base path para GitHub Pages
    return `/vendafacil/assets/images/${imageUrl}`;
};