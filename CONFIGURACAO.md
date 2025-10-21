# Configuração Personalizada - VendaFácil

Este sistema foi projetado para ser usado por várias pequenas empresas, permitindo personalização completa da marca e aparência.

## Como Personalizar

### 1. Configuração Básica

Edite o arquivo `src/config/store.ts` para personalizar:

```typescript
export const storeConfig: StoreConfig = {
    name: 'Nome da Sua Empresa',
    logo: '/assets/images/seu-logo.png', // Opcional
    primaryColor: '#1976d2', // Cor principal
    secondaryColor: '#dc004e', // Cor secundária
    description: 'Descrição da sua loja'
};
```

### 2. Adicionando Logo

1. Coloque seu logo na pasta `public/assets/images/`
2. Atualize o caminho no arquivo de configuração
3. Recomendado: PNG transparente, altura máxima 40px

### 3. Cores Personalizadas

Use códigos hexadecimais para definir as cores:
- `primaryColor`: Cor principal (header, botões)
- `secondaryColor`: Cor de destaque (badges, links)

### 4. Exemplos Pré-configurados

O sistema inclui exemplos para diferentes tipos de negócio:

#### Pet Shop
```typescript
name: 'Pet Shop Amigo Fiel'
primaryColor: '#4caf50' (verde)
secondaryColor: '#ff9800' (laranja)
```

#### Farmácia
```typescript
name: 'Farmácia Saúde & Vida'
primaryColor: '#2196f3' (azul)
secondaryColor: '#f44336' (vermelho)
```

#### Loja de Roupas
```typescript
name: 'Moda & Estilo'
primaryColor: '#9c27b0' (roxo)
secondaryColor: '#e91e63' (rosa)
```

#### Mercado/Alimentos
```typescript
name: 'Mercado Bom Preço'
primaryColor: '#ff5722' (laranja)
secondaryColor: '#4caf50' (verde)
```

### 5. Aplicando Configuração

Para aplicar uma configuração de exemplo via console do navegador:

```javascript
// Pet Shop
localStorage.setItem('store_config', JSON.stringify({
    name: 'Pet Shop Amigo Fiel',
    primaryColor: '#4caf50',
    secondaryColor: '#ff9800'
}));
window.location.reload();
```

### 6. Personalização Avançada

Para personalizações mais avançadas, você pode:

1. **Produtos**: Editar `sampleProducts` no `App.tsx`
2. **Categorias**: Modificar `categories` no `App.tsx`
3. **Estilos**: Personalizar temas no Material-UI
4. **Funcionalidades**: Adicionar recursos específicos do negócio

### 7. Deploy para Múltiplas Empresas

Para usar o mesmo código para várias empresas:

1. **Método 1**: Diferentes builds com configurações específicas
2. **Método 2**: Configuração dinâmica via URL/subdomínio
3. **Método 3**: Painel administrativo para configuração

## Estrutura de Arquivos

```
src/
├── config/
│   ├── store.ts          # Configuração principal
│   └── examples.ts       # Exemplos pré-configurados
├── components/           # Componentes da aplicação
├── types/               # Tipos TypeScript
└── App.tsx              # Aplicação principal
```

## Suporte

Este sistema é open source e pode ser modificado livremente para atender às necessidades específicas de cada empresa.