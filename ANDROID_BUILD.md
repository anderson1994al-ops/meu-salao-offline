# 📱 Guia de Geração do APK Android

## 🚀 Passo a Passo para Gerar o APK

### 1️⃣ Preparar o Projeto Localmente

Primeiro, transfira o projeto para seu GitHub:
- Clique em **"Export to Github"** no Lovable
- Clone o repositório no seu computador:
```bash
git clone [URL-DO-SEU-REPOSITORIO]
cd meu-salao-offline
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Adicionar Plataforma Android

```bash
npx cap add android
```

Isso criará a pasta `android/` com todo o projeto Android nativo.

### 4️⃣ Build da Aplicação Web

```bash
npm run build
```

### 5️⃣ Sincronizar com Android

```bash
npx cap sync android
```

### 6️⃣ Abrir no Android Studio

```bash
npx cap open android
```

Ou abra manualmente a pasta `android/` no Android Studio.

### 7️⃣ Gerar o APK no Android Studio

1. **Build > Build Bundle(s)/APK(s) > Build APK(s)**
2. Aguarde a compilação
3. Clique em **"locate"** quando aparecer a notificação
4. O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

### 📦 APK Release (Produção)

Para gerar APK de produção assinado:

1. **Build > Generate Signed Bundle / APK**
2. Escolha **APK**
3. Crie ou selecione sua keystore
4. Escolha **release**
5. APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Requisitos

- **Node.js** (v16+)
- **Android Studio** (última versão)
- **JDK 11+**
- **Android SDK** (API 21+)

## 📱 Testar no Celular

### Emulador:
```bash
npx cap run android
```

### Dispositivo Físico:
1. Ative **Modo Desenvolvedor** no celular
2. Ative **Depuração USB**
3. Conecte via USB
4. Execute: `npx cap run android`

Ou instale o APK diretamente:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔄 Atualizações Futuras

Sempre que fizer alterações no código:

```bash
npm run build
npx cap sync android
```

Depois reconstrua o APK no Android Studio.

## ✅ Estrutura Gerada

O Capacitor criou automaticamente:
- ✅ `android/app/src/main/AndroidManifest.xml`
- ✅ `android/app/build.gradle`
- ✅ `android/build.gradle`
- ✅ `android/app/src/main/res/` (ícones, recursos)
- ✅ `android/app/src/main/java/` (código nativo)
- ✅ WebView otimizado com JavaScript, LocalStorage, Cache habilitados
- ✅ Compatibilidade API 21+
- ✅ Fullscreen automático
- ✅ Permissões de internet configuradas

## 🌐 Modo Desenvolvimento

Durante o desenvolvimento, o app carregará diretamente do servidor Lovable (hot reload).

Para produção, descomente no `capacitor.config.ts`:
```typescript
// Remova ou comente a seção "server" para produção
```

Isso fará o app carregar os arquivos locais de `dist/`.

## 📚 Documentação Completa

Para mais detalhes sobre desenvolvimento mobile com Capacitor:
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Lovable Cloud Docs](https://docs.lovable.dev/features/cloud)

## 🎯 Pronto!

Seu aplicativo Android nativo está configurado e pronto para gerar APK! 🚀
