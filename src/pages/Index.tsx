import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Shield, Clock, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elevated">
              <Truck className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Sistema de Controle de Empilhadeiras
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie operações, monitore tempo de uso e otimize a produtividade da sua frota
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-card transition-smooth hover:-translate-y-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Controle Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Sistema de autenticação por operador garantindo rastreabilidade completa
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-card transition-smooth hover:-translate-y-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tempo Real</h3>
            <p className="text-sm text-muted-foreground">
              Acompanhe operações em andamento com cronômetro integrado
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-card transition-smooth hover:-translate-y-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
            <p className="text-sm text-muted-foreground">
              Histórico completo de uso e análise de produtividade
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-surface backdrop-blur-sm border-border shadow-elevated animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Comece Agora</h2>
              <p className="text-muted-foreground">
                Faça login ou crie sua conta para acessar o sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-48 h-12 text-base font-medium transition-bounce shadow-lg hover:shadow-elevated"
                >
                  Fazer Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-48 h-12 text-base font-medium transition-bounce hover:bg-secondary"
                >
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
