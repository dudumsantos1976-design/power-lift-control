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

      navigate("/dashboard");
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
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <TruckIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Sistema de Controle</CardTitle>
            <CardDescription className="text-base mt-2">
              Gestão de Empilhadeiras
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Login do Operador
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base"
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold"
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
          <div className="mt-6 pt-6 border-t border-border">
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