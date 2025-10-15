import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SettingValue {
  setting_key: string;
  setting_value: string | null;
  description: string | null;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [mqttBrokerUrl, setMqttBrokerUrl] = useState("");
  const [mqttBrokerPort, setMqttBrokerPort] = useState("");
  const [mqttUsername, setMqttUsername] = useState("");
  const [mqttPassword, setMqttPassword] = useState("");
  const [mqttUseSsl, setMqttUseSsl] = useState(true);
  const [mqttTopicPrefix, setMqttTopicPrefix] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*");

      if (error) throw error;

      if (data) {
        data.forEach((setting: SettingValue) => {
          switch (setting.setting_key) {
            case "mqtt_broker_url":
              setMqttBrokerUrl(setting.setting_value || "");
              break;
            case "mqtt_broker_port":
              setMqttBrokerPort(setting.setting_value || "");
              break;
            case "mqtt_username":
              setMqttUsername(setting.setting_value || "");
              break;
            case "mqtt_password":
              setMqttPassword(setting.setting_value || "");
              break;
            case "mqtt_use_ssl":
              setMqttUseSsl(setting.setting_value === "true");
              break;
            case "mqtt_topic_prefix":
              setMqttTopicPrefix(setting.setting_value || "");
              break;
          }
        });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        { setting_key: "mqtt_broker_url", setting_value: mqttBrokerUrl },
        { setting_key: "mqtt_broker_port", setting_value: mqttBrokerPort },
        { setting_key: "mqtt_username", setting_value: mqttUsername },
        { setting_key: "mqtt_password", setting_value: mqttPassword },
        { setting_key: "mqtt_use_ssl", setting_value: mqttUseSsl.toString() },
        { setting_key: "mqtt_topic_prefix", setting_value: mqttTopicPrefix },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("app_settings")
          .update({ setting_value: update.setting_value })
          .eq("setting_key", update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações do sistema e integração MQTT
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurações MQTT</CardTitle>
            <CardDescription>
              Configure a conexão com o broker MQTT para controlar os ESP32s
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mqtt_broker_url">URL do Broker MQTT</Label>
                <Input
                  id="mqtt_broker_url"
                  placeholder="broker.hivemq.com"
                  value={mqttBrokerUrl}
                  onChange={(e) => setMqttBrokerUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Endereço do servidor MQTT (sem protocolo)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mqtt_broker_port">Porta</Label>
                <Input
                  id="mqtt_broker_port"
                  type="number"
                  placeholder="8883"
                  value={mqttBrokerPort}
                  onChange={(e) => setMqttBrokerPort(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Porta do broker (8883 para SSL/TLS, 1883 para não criptografado)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mqtt_use_ssl">Usar SSL/TLS</Label>
                  <p className="text-xs text-muted-foreground">
                    Conexão segura (recomendado)
                  </p>
                </div>
                <Switch
                  id="mqtt_use_ssl"
                  checked={mqttUseSsl}
                  onCheckedChange={setMqttUseSsl}
                />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="mqtt_username">Usuário (opcional)</Label>
                <Input
                  id="mqtt_username"
                  placeholder="username"
                  value={mqttUsername}
                  onChange={(e) => setMqttUsername(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mqtt_password">Senha (opcional)</Label>
                <Input
                  id="mqtt_password"
                  type="password"
                  placeholder="••••••••"
                  value={mqttPassword}
                  onChange={(e) => setMqttPassword(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="mqtt_topic_prefix">Prefixo dos Tópicos</Label>
                <Input
                  id="mqtt_topic_prefix"
                  placeholder="forklift/"
                  value={mqttTopicPrefix}
                  onChange={(e) => setMqttTopicPrefix(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Exemplo: com prefixo "forklift/", os tópicos serão
                  "forklift/ESP32-001/command"
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Banco de Dados</CardTitle>
            <CardDescription>
              Acesse e gerencie o banco de dados do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Você pode visualizar e gerenciar todas as tabelas do banco de dados
              (operadores, empilhadeiras, registros de uso e configurações).
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">
                Tabelas disponíveis:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>operators - Dados dos operadores</li>
                <li>forklifts - Informações das empilhadeiras</li>
                <li>usage_logs - Histórico de operações</li>
                <li>app_settings - Configurações do sistema</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
