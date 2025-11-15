import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginHero from "@/assets/login-hero.png";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto, apenas redireciona para a página principal
    navigate("/");
  };

  const handleEmailSignup = () => {
    // Implementar cadastro/login com email
    console.log("Cadastro/Login com email");
  };

  const handleGoogleLogin = () => {
    // Implementar login com Google
    console.log("Login com Google");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-[#f5d5d5] via-[#ead5d5] to-[#e5c8c8] px-4 py-8">
      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#3d1f47] mb-8 text-center">
        Gestor de Salão
      </h1>

      {/* Imagem Hero */}
      <div className="w-full max-w-md mb-6">
        <img 
          src={loginHero} 
          alt="Gestor de Salão" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Formulário de Login */}
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login" className="sr-only">Login</Label>
          <Input
            id="login"
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="h-14 bg-[#4a4a4a] text-white placeholder:text-gray-300 border-none rounded-2xl text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha" className="sr-only">Senha</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="h-14 bg-[#4a4a4a] text-white placeholder:text-gray-300 border-none rounded-2xl text-lg"
          />
        </div>

        {/* Botão Cadastre-se */}
        <Button
          type="button"
          onClick={handleEmailSignup}
          variant="outline"
          className="w-full h-16 bg-[#2d2d40] hover:bg-[#3d3d50] text-[#5ba3e8] hover:text-[#6bb3f8] border-none rounded-3xl text-base font-medium"
        >
          Cadastre-se ou faça login com telefone/e-mail
        </Button>

        {/* Botão Google */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-16 bg-transparent hover:bg-white/10 text-[#5ba3e8] hover:text-[#6bb3f8] border-2 border-transparent rounded-3xl text-lg font-medium"
        >
          Entrar com Google
        </Button>
      </form>
    </div>
  );
};

export default Login;
