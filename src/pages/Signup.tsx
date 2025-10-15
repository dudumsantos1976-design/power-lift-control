import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TruckIcon, UserPlus, ArrowLeft } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !fullName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from("operators")
        .select("username")
        .eq("username", username.trim())
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Erro",
          description: "Este nome de usuário já está em uso",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create new operator
      const { error } = await supabase
        .from("operators")
        .insert([
          {
            username: username.trim(),
            full_name: fullName.trim(),
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso. Faça login para continuar.",
      });

      // Navigate to login after successful signup
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <Card className="w-full max-w-md shadow-elevated relative backdrop-blur-sm border-2 transition-smooth hover:shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-elevated transition-bounce hover:scale-110">
            <TruckIcon className="w-12 h-12 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Criar Conta
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Cadastre-se como operador de empilhadeira
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                Nome Completo
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 text-base transition-smooth focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-foreground">
                Nome de Usuário
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Escolha um nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base transition-smooth focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold gradient-primary border-0 shadow-elevated transition-smooth hover:shadow-2xl hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="w-full h-12 text-base transition-smooth hover:bg-secondary"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar para o Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
