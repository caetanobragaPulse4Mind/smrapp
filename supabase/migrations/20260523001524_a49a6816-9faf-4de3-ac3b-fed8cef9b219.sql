
-- Processos principais
CREATE TABLE public.processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT,
  reclamante TEXT,
  reclamada TEXT,
  responsavel TEXT,
  status TEXT NOT NULL DEFAULT 'Aguardando',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Dados da BASE
CREATE TABLE public.base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE,
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE,
  usuario TEXT,
  acao TEXT NOT NULL,
  secao TEXT,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função helper para criar tabelas de verbas (executa inline)
CREATE TABLE public.horas_extras (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.horas_intervalares (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.adicional_noturno (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.adicionais_condicionais (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.jornada_arbitrada (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.jornada_mista (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.dif_salariais (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.devolucao_descontos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.multa_convencional (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.vales (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.verbas_rescisorias (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.honorarios (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.danos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.pensao_vitalicia (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.plr (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.reintegracao (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.deducoes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE UNIQUE, dados JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

-- Habilita RLS em todas as tabelas com policies públicas (sem auth nesta fase)
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'processos','base','audit_log',
    'horas_extras','horas_intervalares','adicional_noturno','adicionais_condicionais',
    'jornada_arbitrada','jornada_mista','dif_salariais','devolucao_descontos',
    'multa_convencional','vales','verbas_rescisorias','honorarios','danos',
    'pensao_vitalicia','plr','reintegracao','deducoes'
  ])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "public_all_%s" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

-- Trigger para updated_at em processos
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_processos_updated_at
  BEFORE UPDATE ON public.processos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
