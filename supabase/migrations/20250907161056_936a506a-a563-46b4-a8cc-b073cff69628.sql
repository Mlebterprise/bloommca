-- Create wheel of life entries table
CREATE TABLE public.wheel_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- For future authentication
  month DATE NOT NULL, -- First day of the month
  area TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  what_went_well TEXT DEFAULT '',
  what_can_be_improved TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one entry per area per month per user
  UNIQUE(user_id, month, area)
);

-- Enable Row Level Security
ALTER TABLE public.wheel_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for future authentication
CREATE POLICY "Users can view their own wheel entries" 
ON public.wheel_entries 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL); -- Allow null user_id for now

CREATE POLICY "Users can create their own wheel entries" 
ON public.wheel_entries 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR user_id IS NULL); -- Allow null user_id for now

CREATE POLICY "Users can update their own wheel entries" 
ON public.wheel_entries 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL); -- Allow null user_id for now

CREATE POLICY "Users can delete their own wheel entries" 
ON public.wheel_entries 
FOR DELETE 
USING (user_id = auth.uid() OR user_id IS NULL); -- Allow null user_id for now

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_wheel_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wheel_entries_updated_at
  BEFORE UPDATE ON public.wheel_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wheel_entries_updated_at();