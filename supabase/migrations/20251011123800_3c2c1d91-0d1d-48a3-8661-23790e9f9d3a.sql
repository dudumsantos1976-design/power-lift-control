-- Create operators table
CREATE TABLE public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forklifts table with status
CREATE TYPE forklift_status AS ENUM ('available', 'in_use', 'maintenance');

CREATE TABLE public.forklifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  status forklift_status DEFAULT 'available',
  esp32_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create usage logs table
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES public.operators(id) NOT NULL,
  forklift_id UUID REFERENCES public.forklifts(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forklifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public access for demonstration (adjust based on your auth requirements)
CREATE POLICY "Operators are viewable by everyone" ON public.operators FOR SELECT USING (true);
CREATE POLICY "Forklifts are viewable by everyone" ON public.forklifts FOR SELECT USING (true);
CREATE POLICY "Forklifts can be updated by everyone" ON public.forklifts FOR UPDATE USING (true);
CREATE POLICY "Usage logs are viewable by everyone" ON public.usage_logs FOR SELECT USING (true);
CREATE POLICY "Usage logs can be created by everyone" ON public.usage_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Usage logs can be updated by everyone" ON public.usage_logs FOR UPDATE USING (true);

-- Insert sample operators
INSERT INTO public.operators (username, full_name) VALUES
  ('joao.silva', 'João Silva'),
  ('maria.santos', 'Maria Santos'),
  ('carlos.oliveira', 'Carlos Oliveira');

-- Insert sample forklifts
INSERT INTO public.forklifts (name, code, status, esp32_id) VALUES
  ('Empilhadeira 01', 'EMP-001', 'available', 'ESP32-001'),
  ('Empilhadeira 02', 'EMP-002', 'in_use', 'ESP32-002'),
  ('Empilhadeira 03', 'EMP-003', 'maintenance', 'ESP32-003'),
  ('Empilhadeira 04', 'EMP-004', 'available', 'ESP32-004');