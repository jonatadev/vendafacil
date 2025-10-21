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

export const resizeImage = (file: File, maxWidth: number = 400, maxHeight: number = 300, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        
        img.onload = () => {
            // Calcular proporções
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Desenhar imagem redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para base64
            const resizedImage = canvas.toDataURL('image/jpeg', quality);
            resolve(resizedImage);
        };
        
        img.src = URL.createObjectURL(file);
    });
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