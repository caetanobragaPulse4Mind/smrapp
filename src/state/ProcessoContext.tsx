import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Reclamada = { nome: string; cnpj: string };

export type BaseData = {
  processo: string;
  vara: string;
  reclamante: string;
  cpf: string;
  reclamadas: Reclamada[];
  ajuizamento: string;
  admissao: string;
  demissao: string;
  demissao_ativo: boolean;
  prescricao: string;
  tipo_demissao: string;
  aviso_previo: string;
  dias_indenizados: string;
  fgts_calculo: string;
  defendemos: string;
  responsabilidade: string;
  periodo_responsabilidade: string;
  reclamada_defendida: string;
  obs_calculista: string;
  obs_digitador: string;
  executor: string;
  revelia: string;
  // Documentos
  pecas: Record<string, { disponivel: boolean; data: string }>;
  documentos: Record<string, boolean>;
  simples_nacional: boolean;
  // Verbas (chips)
  verbas_ativas: string[];
  // Jornada auto-derived (from horas extras base_apuracao) — placeholder editable manually
  jornada_arbitrada: boolean;
  jornada_mista: boolean;
};

export type Processo = {
  id: string;
  numero: string | null;
  reclamante: string | null;
  reclamada: string | null;
  responsavel: string | null;
  status: string;
};

export type AuditEntry = {
  id: string;
  usuario: string | null;
  acao: string;
  secao: string | null;
  timestamp: string;
};

export const DEFAULT_BASE: BaseData = {
  processo: "",
  vara: "",
  reclamante: "",
  cpf: "",
  reclamadas: [{ nome: "", cnpj: "" }],
  ajuizamento: "",
  admissao: "",
  demissao: "",
  demissao_ativo: false,
  prescricao: "",
  tipo_demissao: "",
  aviso_previo: "",
  dias_indenizados: "",
  fgts_calculo: "",
  defendemos: "",
  responsabilidade: "",
  periodo_responsabilidade: "",
  reclamada_defendida: "",
  obs_calculista: "",
  obs_digitador: "",
  executor: "",
  revelia: "",
  pecas: {},
  documentos: {},
  simples_nacional: false,
  verbas_ativas: [],
  jornada_arbitrada: false,
  jornada_mista: false,
};

type Ctx = {
  processo: Processo | null;
  base: BaseData;
  audit: AuditEntry[];
  loading: boolean;
  setBase: (updater: (b: BaseData) => BaseData) => void;
  toggleVerba: (id: string) => void;
  save: (secao?: string) => Promise<void>;
  updateStatus: (status: string) => Promise<void>;
};

const ProcessoContext = createContext<Ctx | null>(null);

export function useProcesso() {
  const ctx = useContext(ProcessoContext);
  if (!ctx) throw new Error("ProcessoContext missing");
  return ctx;
}

export function ProcessoProvider({ id, children }: { id: string; children: React.ReactNode }) {
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [base, setBaseState] = useState<BaseData>(DEFAULT_BASE);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, bRes, aRes] = await Promise.all([
      supabase.from("processos").select("id,numero,reclamante,reclamada,responsavel,status").eq("id", id).single(),
      supabase.from("base").select("dados").eq("processo_id", id).maybeSingle(),
      supabase.from("audit_log").select("id,usuario,acao,secao,timestamp").eq("processo_id", id).order("timestamp", { ascending: false }),
    ]);
    if (pRes.data) setProcesso(pRes.data as Processo);
    if (bRes.data?.dados) setBaseState({ ...DEFAULT_BASE, ...(bRes.data.dados as Partial<BaseData>) });
    if (aRes.data) setAudit(aRes.data as AuditEntry[]);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const setBase = useCallback((updater: (b: BaseData) => BaseData) => {
    setBaseState((prev) => updater(prev));
  }, []);

  const toggleVerba = useCallback((vid: string) => {
    setBaseState((prev) => {
      const has = prev.verbas_ativas.includes(vid);
      return {
        ...prev,
        verbas_ativas: has ? prev.verbas_ativas.filter((x) => x !== vid) : [...prev.verbas_ativas, vid],
      };
    });
  }, []);

  const save = useCallback(async (secao = "BASE") => {
    // Derive summary fields for the processos table
    const reclamadaResumo = base.reclamadas.map((r) => r.nome).filter(Boolean).join(" / ");
    const updates = {
      numero: base.processo || null,
      reclamante: base.reclamante || null,
      reclamada: reclamadaResumo || null,
      responsavel: base.executor || null,
    };

    const { error: e1 } = await supabase.from("processos").update(updates).eq("id", id);
    if (e1) { toast.error(e1.message); return; }

    const { error: e2 } = await supabase
      .from("base")
      .upsert({ processo_id: id, dados: base as never, updated_at: new Date().toISOString() }, { onConflict: "processo_id" });
    if (e2) { toast.error(e2.message); return; }

    const { error: e3 } = await supabase.from("audit_log").insert({
      processo_id: id,
      usuario: base.executor || "Sistema",
      acao: secao === "BASE" ? "BASE atualizada" : `${secao} atualizada`,
      secao,
    });
    if (e3) console.warn(e3);

    toast.success("Salvo");
    load();
  }, [base, id, load]);

  const updateStatus = useCallback(async (status: string) => {
    const { error } = await supabase.from("processos").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setProcesso((p) => (p ? { ...p, status } : p));
  }, [id]);

  const value = useMemo(
    () => ({ processo, base, audit, loading, setBase, toggleVerba, save, updateStatus }),
    [processo, base, audit, loading, setBase, toggleVerba, save, updateStatus],
  );

  return <ProcessoContext.Provider value={value}>{children}</ProcessoContext.Provider>;
}
