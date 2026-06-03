CREATE TABLE public.list_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  value text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (category, value)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.list_items TO anon, authenticated;
GRANT ALL ON public.list_items TO service_role;

ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all_list_items" ON public.list_items FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER set_list_items_updated_at
BEFORE UPDATE ON public.list_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.list_items (category, value, ordem) VALUES
  ('tipo_demissao', 'SEM JUSTA CAUSA', 1),
  ('tipo_demissao', 'COM JUSTA CAUSA', 2),
  ('tipo_demissao', 'PEDIDO DE DEMISSÃO', 3),
  ('tipo_demissao', 'RESCISÃO INDIRETA', 4),
  ('tipo_demissao', 'ACORDO', 5),
  ('tipo_demissao', 'ANTECIPAÇÃO DO CONTRATO', 6),
  ('aviso_previo', 'TRABALHADO', 1),
  ('aviso_previo', 'INDENIZADO', 2),
  ('aviso_previo', 'DISPENSADO', 3),
  ('aviso_previo', 'TRAB + INDENIZADO', 4),
  ('aviso_previo', 'NÃO APURAR', 5);