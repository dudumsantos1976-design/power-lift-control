-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for app settings
CREATE TABLE public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Settings are viewable by everyone"
ON public.app_settings
FOR SELECT
USING (true);

-- Allow everyone to update settings (will be restricted later with authentication)
CREATE POLICY "Settings can be updated by everyone"
ON public.app_settings
FOR UPDATE
USING (true);

-- Allow everyone to insert settings
CREATE POLICY "Settings can be inserted by everyone"
ON public.app_settings
FOR INSERT
WITH CHECK (true);

-- Insert default MQTT settings
INSERT INTO public.app_settings (setting_key, setting_value, description) VALUES
  ('mqtt_broker_url', 'broker.hivemq.com', 'URL do broker MQTT'),
  ('mqtt_broker_port', '8883', 'Porta do broker MQTT (8883 para SSL/TLS)'),
  ('mqtt_username', '', 'Usuário do broker MQTT'),
  ('mqtt_password', '', 'Senha do broker MQTT'),
  ('mqtt_use_ssl', 'true', 'Usar SSL/TLS para conexão MQTT'),
  ('mqtt_topic_prefix', 'forklift/', 'Prefixo dos tópicos MQTT');

-- Create trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();