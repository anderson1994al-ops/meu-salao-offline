# 📱 Meu Salão Offline - Aplicativo Android

Sistema de gestão para salões de beleza com suporte para aplicativo Android nativo.

## 🚀 Gerar APK Android

**[→ Clique aqui para ver o guia completo de geração do APK](./ANDROID_BUILD.md)**

### Resumo Rápido:

```bash
# 1. Clone o projeto
git clone <YOUR_GIT_URL>
cd meu-salao-offline

# 2. Instale dependências
npm install

# 3. Adicione Android
npx cap add android

# 4. Build da aplicação
npm run build

# 5. Sincronize
npx cap sync android

# 6. Abra no Android Studio
npx cap open android

# 7. No Android Studio: Build > Build APK(s)
```

O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Project info

**URL**: https://lovable.dev/projects/af5a2ef2-8d98-4de6-9da8-f102f3f51e17

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/af5a2ef2-8d98-4de6-9da8-f102f3f51e17) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn-ui + Tailwind CSS
- **Mobile**: Capacitor (Android nativo)
- **Storage**: LocalStorage (offline-first)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/af5a2ef2-8d98-4de6-9da8-f102f3f51e17) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
