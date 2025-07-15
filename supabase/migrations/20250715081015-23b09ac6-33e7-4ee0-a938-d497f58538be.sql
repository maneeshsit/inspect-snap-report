-- Create inspections table to store inspection data
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  inspector_name TEXT NOT NULL,
  inspection_date DATE NOT NULL,
  property_address TEXT,
  template TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create inspection_sections table for detailed section data
CREATE TABLE public.inspection_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  notes TEXT,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create inspection_photos table for storing photo data
CREATE TABLE public.inspection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.inspection_sections(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inspections
CREATE POLICY "Users can view their own inspections" 
ON public.inspections FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inspections" 
ON public.inspections FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inspections" 
ON public.inspections FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all inspections"
ON public.inspections FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create RLS policies for sections
CREATE POLICY "Users can view their own sections" 
ON public.inspection_sections FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.inspections 
  WHERE id = inspection_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create sections for their inspections" 
ON public.inspection_sections FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.inspections 
  WHERE id = inspection_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own sections" 
ON public.inspection_sections FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.inspections 
  WHERE id = inspection_id AND user_id = auth.uid()
));

-- Create RLS policies for photos
CREATE POLICY "Users can view their own photos" 
ON public.inspection_photos FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.inspection_sections s
  JOIN public.inspections i ON s.inspection_id = i.id
  WHERE s.id = section_id AND i.user_id = auth.uid()
));

CREATE POLICY "Users can create photos for their sections" 
ON public.inspection_photos FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.inspection_sections s
  JOIN public.inspections i ON s.inspection_id = i.id
  WHERE s.id = section_id AND i.user_id = auth.uid()
));

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_inspections_updated_at
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();