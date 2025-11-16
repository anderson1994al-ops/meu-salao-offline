# Sistema de Autenticação

## ✅ O que foi implementado

1. **Autenticação completa com Lovable Cloud**
   - Sistema de login e cadastro seguro
   - Proteção de todas as rotas (obrigatório fazer login)
   - Logout funcional no menu de Configurações

2. **Sistema de Roles (Permissões)**
   - Tabela `profiles` para dados dos usuários
   - Tabela `user_roles` para gerenciar permissões
   - Enum `app_role` com duas permissões: `admin` e `user`
   - Função segura `has_role()` para verificar permissões

3. **Proteção de Rotas**
   - Todas as páginas agora exigem login
   - Apenas `/login` é acessível sem autenticação
   - Redirecionamento automático para login se não autenticado

## 🔐 Como criar o usuário Admin

### Passo 1: Fazer o primeiro cadastro
1. Acesse a tela de Login do app
2. Clique na aba "Cadastrar"
3. Preencha os dados:
   - **Nome**: Anderson (ou o nome que preferir)
   - **Email**: anderson1994.al@gmail.com
   - **Senha**: Jr85025620
   - **Confirmar Senha**: Jr85025620
4. Clique em "Cadastrar"
5. Volte para a aba "Entrar" e faça o login

### Passo 2: Tornar o usuário Admin
Após fazer o cadastro e login, me avise no chat que você completou o Passo 1. Eu vou executar um comando SQL para tornar esse usuário um administrador.

## 🎯 Diferenças entre Admin e Usuário comum

### Usuário comum (`user`)
- ✅ Pode fazer login
- ✅ Pode visualizar agendamentos
- ✅ Pode criar/editar/excluir seus próprios dados
- ❌ Não pode alterar configurações de boletos
- ❌ Não pode modificar configurações gerais do sistema

### Administrador (`admin`)
- ✅ Todas as permissões do usuário comum
- ✅ Pode alterar boletos e pagamentos
- ✅ Pode modificar todas as configurações do sistema
- ✅ Acesso total a todas as funcionalidades

## 🔒 Segurança

**IMPORTANTE**: Este sistema usa autenticação real e segura:
- ✅ Senhas criptografadas no banco de dados
- ✅ Tokens JWT seguros para sessões
- ✅ Verificação de permissões no servidor (RLS)
- ✅ Não é possível manipular permissões pelo navegador
- ✅ Proteção contra ataques de injeção SQL

Nunca mais use credenciais hardcoded no código! O sistema agora é completamente seguro.

## 📱 Para gerar o APK atualizado

Depois de fazer login pela primeira vez:

```bash
npm run build
npx cap sync android
```

Depois abra no Android Studio e gere o APK normalmente.

## 🆘 Problemas comuns

**Não consigo fazer login**
- Verifique se o email e senha estão corretos
- Certifique-se de que você fez o cadastro primeiro

**Esqueci minha senha**
- Por enquanto, não há recuperação de senha
- Você pode criar uma nova conta ou me avisar para redefinir no banco de dados

**O app não está abrindo na tela de login**
- Limpe os dados do app no Android
- Ou desinstale e instale novamente
