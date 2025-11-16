import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import loginHero from "@/assets/login-hero.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Verifica credenciais admin
      if (email === "anderson1994.al@gmail.com" && senha === "Jr85025620") {
        toast.success("Login realizado com sucesso! Bem-vindo, Admin!");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        navigate("/");
      } else {
        toast.error("Email ou senha incorretos");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha || !confirmarSenha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Salva o novo usuário
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      usuarios.push({ nome, email, senha });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      setActiveTab("login");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Título */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg mb-4">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Gestor de Salão
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu salão de beleza com facilidade
          </p>
        </div>

        {/* Imagem Hero */}
        <div className="w-full flex justify-center">
          <img 
            src={loginHero} 
            alt="Gestor de Salão" 
            className="w-48 h-48 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Card de Login/Cadastro */}
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Entrar</CardTitle>
                <CardDescription className="text-center">
                  Digite suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-senha" className="text-sm font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-senha"
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="cadastro">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Cadastrar</CardTitle>
                <CardDescription className="text-center">
                  Crie sua conta para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-nome" className="text-sm font-medium">
                      Nome
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="cadastro-nome"
                        type="text"
                        placeholder="Seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="cadastro-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-senha" className="text-sm font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="cadastro-senha"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-confirmar-senha" className="text-sm font-medium">
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="cadastro-confirmar-senha"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Desenvolvido para profissionais da beleza
        </p>
      </div>
    </div>
  );
};

export default Login;
