import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruckIcon, StopCircle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Forklift {
  id: string;
  name: string;
  code: string;
  status: string;
  esp32_id: string;
}

interface Operator {
  id: string;
  username: string;
  full_name: string;
}

interface OperationTimerProps {
  forklift: Forklift;
  operator: Operator;
  onEnd: () => void;
}

export const OperationTimer = ({ forklift, operator, onEnd }: OperationTimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <TruckIcon className="w-12 h-12 text-primary-foreground" />
              </div>
              <div>
                <Badge className="mb-2 bg-status-inUse text-white">
                  Operação em Andamento
                </Badge>
                <h2 className="text-3xl font-bold text-foreground">
                  {forklift.name}
                </h2>
                <p className="text-muted-foreground mt-1">{forklift.code}</p>
              </div>
            </div>

            {/* Timer Display */}
            <div className="bg-muted/50 rounded-2xl p-8 border-2 border-border">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-primary" />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Tempo de Operação
                </p>
              </div>
              <div className="text-6xl font-bold text-primary tabular-nums tracking-tight">
                {formatTime(seconds)}
              </div>
            </div>

            {/* Operator Info */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Operador</p>
              <p className="text-lg font-semibold text-foreground">
                {operator.full_name}
              </p>
              <p className="text-sm text-muted-foreground">@{operator.username}</p>
            </div>

            {/* Module Info */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Módulo ESP32</p>
              <p className="text-base font-mono font-medium text-foreground">
                {forklift.esp32_id}
              </p>
            </div>

            {/* End Operation Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="lg"
                  variant="destructive"
                  className="w-full gap-2 text-lg h-14 font-semibold"
                >
                  <StopCircle className="w-5 h-5" />
                  Finalizar Operação
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Finalização</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deseja realmente finalizar a operação da {forklift.name}?
                    <br />
                    <br />
                    <span className="font-semibold text-foreground">
                      Tempo atual: {formatTime(seconds)}
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onEnd}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};