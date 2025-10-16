import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TruckIcon } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu login",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("operators")
        .select("*")
        .eq("username", username.trim())
        .single();

      if (error || !data) {
        toast({
          title: "Acesso Negado",
          description: "Usuário não cadastrado no sistema",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("operator", JSON.stringify(data));
      
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${data.full_name}!`,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
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
              Sistema de Controle
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Gestão de Empilhadeiras
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-foreground">
                Login do Operador
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu login"
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
                  Validando...
                </>
              ) : (
                "Entrar no Sistema"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base transition-smooth hover:bg-secondary"
              onClick={() => navigate("/signup")}
              disabled={loading}
            >
              Criar Nova Conta
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Usuários de teste: joao.silva, maria.santos, carlos.oliveira
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;