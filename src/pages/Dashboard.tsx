import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, TruckIcon, Settings } from "lucide-react";
import { ForkliftCard } from "@/components/ForkliftCard";
import { OperationTimer } from "@/components/OperationTimer";

interface Operator {
  id: string;
  username: string;
  full_name: string;
}

interface Forklift {
  id: string;
  name: string;
  code: string;
  status: "available" | "in_use" | "maintenance";
  esp32_id: string;
}

const Dashboard = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [forklifts, setForklifts] = useState<Forklift[]>([]);
  const [selectedForklift, setSelectedForklift] = useState<Forklift | null>(null);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const operatorData = localStorage.getItem("operator");
    if (!operatorData) {
      navigate("/login");
      return;
    }
    setOperator(JSON.parse(operatorData));
    loadForklifts();
  }, [navigate]);

  const loadForklifts = async () => {
    try {
      const { data, error } = await supabase
        .from("forklifts")
        .select("*")
        .order("name");

      if (error) throw error;
      setForklifts(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar empilhadeiras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForklift = async (forklift: Forklift) => {
    if (forklift.status !== "available") {
      toast({
        title: "Empilhadeira Indisponível",
        description: `Status atual: ${
          forklift.status === "in_use" ? "Em uso" : "Em manutenção"
        }`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Create usage log
      const { data: logData, error: logError } = await supabase
        .from("usage_logs")
        .insert({
          operator_id: operator!.id,
          forklift_id: forklift.id,
        })
        .select()
        .single();

      if (logError) throw logError;

      // Update forklift status
      const { error: updateError } = await supabase
        .from("forklifts")
        .update({ status: "in_use" })
        .eq("id", forklift.id);

      if (updateError) throw updateError;

      setCurrentLogId(logData.id);
      setSelectedForklift(forklift);

      // Send MQTT command to ESP32
      const mqttResult = await supabase.functions.invoke('mqtt-control', {
        body: { 
          esp32_id: forklift.esp32_id,
          action: 'login'
        }
      });

      if (mqttResult.error) {
        console.error('MQTT Error:', mqttResult.error);
      } else {
        console.log('MQTT Success:', mqttResult.data);
      }

      toast({
        title: "Empilhadeira Ativada",
        description: `${forklift.name} está pronta para uso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao ativar empilhadeira",
        variant: "destructive",
      });
    }
  };

  const handleEndOperation = async () => {
    if (!selectedForklift || !currentLogId) return;

    try {
      const endTime = new Date();
      
      // Get start time from log
      const { data: logData } = await supabase
        .from("usage_logs")
        .select("start_time")
        .eq("id", currentLogId)
        .single();

      const startTime = new Date(logData!.start_time);
      const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      // Update usage log
      const { error: logError } = await supabase
        .from("usage_logs")
        .update({
          end_time: endTime.toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq("id", currentLogId);

      if (logError) throw logError;

      // Update forklift status
      const { error: updateError } = await supabase
        .from("forklifts")
        .update({ status: "available" })
        .eq("id", selectedForklift.id);

      if (updateError) throw updateError;

      // Send MQTT command to ESP32
      const mqttResult = await supabase.functions.invoke('mqtt-control', {
        body: { 
          esp32_id: selectedForklift.esp32_id,
          action: 'logout'
        }
      });

      if (mqttResult.error) {
        console.error('MQTT Error:', mqttResult.error);
      } else {
        console.log('MQTT Success:', mqttResult.data);
      }

      toast({
        title: "Operação Finalizada",
        description: `Tempo total: ${Math.floor(durationSeconds / 60)}min ${durationSeconds % 60}s`,
      });

      setSelectedForklift(null);
      setCurrentLogId(null);
      loadForklifts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao finalizar operação",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("operator");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <TruckIcon className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Sistema de Controle
                </h1>
                <p className="text-sm text-muted-foreground">
                  Operador: {operator?.full_name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/settings")}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedForklift ? (
          <OperationTimer
            forklift={selectedForklift}
            operator={operator!}
            onEnd={handleEndOperation}
          />
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Empilhadeiras Disponíveis
              </h2>
              <p className="text-muted-foreground">
                Selecione uma empilhadeira para iniciar a operação
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forklifts.map((forklift) => (
                <ForkliftCard
                  key={forklift.id}
                  forklift={forklift}
                  onSelect={() => handleSelectForklift(forklift)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;