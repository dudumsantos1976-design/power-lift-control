import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruckIcon, AlertCircle, CheckCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Forklift {
  id: string;
  name: string;
  code: string;
  status: "available" | "in_use" | "maintenance";
  esp32_id: string;
}

interface ForkliftCardProps {
  forklift: Forklift;
  onSelect: () => void;
}

const statusConfig = {
  available: {
    label: "Disponível",
    icon: CheckCircle,
    color: "bg-status-available",
    textColor: "text-status-available",
    badge: "bg-status-available/10 text-status-available border-status-available/20",
  },
  in_use: {
    label: "Em Uso",
    icon: AlertCircle,
    color: "bg-status-inUse",
    textColor: "text-status-inUse",
    badge: "bg-status-inUse/10 text-status-inUse border-status-inUse/20",
  },
  maintenance: {
    label: "Manutenção",
    icon: Wrench,
    color: "bg-status-maintenance",
    textColor: "text-status-maintenance",
    badge: "bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20",
  },
};

export const ForkliftCard = ({ forklift, onSelect }: ForkliftCardProps) => {
  const config = statusConfig[forklift.status];
  const Icon = config.icon;
  const isAvailable = forklift.status === "available";

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isAvailable && "cursor-pointer hover:border-primary",
        !isAvailable && "opacity-75"
      )}
      onClick={isAvailable ? onSelect : undefined}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.color)}>
              <TruckIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {forklift.name}
              </h3>
              <p className="text-sm text-muted-foreground">{forklift.code}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="outline" className={cn("font-medium", config.badge)}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">ID do Módulo</p>
            <p className="text-sm font-mono font-medium text-foreground">
              {forklift.esp32_id}
            </p>
          </div>

          {isAvailable && (
            <Button 
              className="w-full mt-4 font-semibold"
              size="lg"
            >
              Selecionar Empilhadeira
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};