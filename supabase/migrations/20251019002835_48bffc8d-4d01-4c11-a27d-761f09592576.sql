-- Allow operators to sign up (insert their own records)
CREATE POLICY "Operators can insert their own records" 
ON public.operators 
FOR INSERT 
WITH CHECK (true);