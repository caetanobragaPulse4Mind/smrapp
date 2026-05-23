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
  pecas: Record<string, { disponivel: boolean; data: string }>;
  documentos: Record<string, boolean>;
  simples_nacional: boolean;
  verbas_ativas: string[];
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
  processo: "", vara: "", reclamante: "", cpf: "",
  reclamadas: [{ nome: "", cnpj: "" }],
  ajuizamento: "", admissao: "", demissao: "", demissao_ativo: false, prescricao: "",
  tipo_demissao: "", aviso_previo: "", dias_indenizados: "",
  fgts_calculo: "", defendemos: "", responsabilidade: "", periodo_responsabilidade: "",
  reclamada_defendida: "", obs_calculista: "", obs_digitador: "", executor: "", revelia: "",
  pecas: {}, documentos: {}, simples_nacional: false,
  verbas_ativas: [], jornada_arbitrada: false, jornada_mista: false,
};

// Tabelas de verbas conhecidas (id da seção → nome da tabela)
const VERBA_TABLES: Record<string, string> = {
  horas_extras: "horas_extras",
  horas_intervalares: "horas_intervalares",
  adicional_noturno: "adicional_noturno",
  adicionais_condicionais: "adicionais_condicionais",
  dif_salariais: "dif_salariais",
  devolucao_descontos: "devolucao_descontos",
  multa_convencional: "multa_convencional",
  vales: "vales",
  verbas_rescisorias: "verbas_rescisorias",
  honorarios: "honorarios",
  danos: "danos",
  pensao_vitalicia: "pensao_vitalicia",
  plr: "plr",
  reintegracao: "reintegracao",
  deducoes: "deducoes",
  jornada_arbitrada: "jornada_arbitrada",
  jornada_mista: "jornada_mista",
};

type Ctx = {
  processo: Processo | null;
  base: BaseData;
  audit: AuditEntry[];
  loading: boolean;
  verbas: Record<string, any>;
  setBase: (updater: (b: BaseData) => BaseData) => void;
  setVerba: (id: string, updater: (v: any) => any) => void;
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
  const [verbas, setVerbas] = useState<Record<string, any>>({});
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

    // Carrega todas as verbas em paralelo
    const verbaIds = Object.keys(VERBA_TABLES);
    const verbaResults = await Promise.all(
      verbaIds.map((vid) =>
        supabase.from(VERBA_TABLES[vid] as any).select("dados").eq("processo_id", id).maybeSingle(),
      ),
    );
    const loaded: Record<string, any> = {};
    verbaIds.forEach((vid, idx) => {
      const d = (verbaResults[idx] as any).data?.dados;
      if (d) loaded[vid] = d;
    });
    setVerbas(loaded);

    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const setBase = useCallback((updater: (b: BaseData) => BaseData) => {
    setBaseState((prev) => updater(prev));
  }, []);

  const setVerba = useCallback((vid: string, updater: (v: any) => any) => {
    setVerbas((prev) => ({ ...prev, [vid]: updater(prev[vid] ?? {}) }));
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
    // Sempre atualiza resumo na tabela processos
    const reclamadaResumo = base.reclamadas.map((r) => r.nome).filter(Boolean).join(" / ");
    const updates = {
      numero: base.processo || null,
      reclamante: base.reclamante || null,
      reclamada: reclamadaResumo || null,
      responsavel: base.executor || null,
    };
    const { error: e1 } = await supabase.from("processos").update(updates).eq("id", id);
    if (e1) { toast.error(e1.message); return; }

    if (secao === "BASE") {
      const { error: e2 } = await supabase
        .from("base")
        .upsert({ processo_id: id, dados: base as never, updated_at: new Date().toISOString() }, { onConflict: "processo_id" });
      if (e2) { toast.error(e2.message); return; }
    } else if (VERBA_TABLES[secao]) {
      const table = VERBA_TABLES[secao];
      const dados = verbas[secao] ?? {};
      const { error: ev } = await supabase
        .from(table as any)
        .upsert({ processo_id: id, dados: dados as never, updated_at: new Date().toISOString() }, { onConflict: "processo_id" });
      if (ev) { toast.error(ev.message); return; }
    }

    const { error: e3 } = await supabase.from("audit_log").insert({
      processo_id: id,
      usuario: base.executor || "Sistema",
      acao: secao === "BASE" ? "BASE atualizada" : `${secao} atualizada`,
      secao,
    });
    if (e3) console.warn(e3);

    toast.success("Salvo");
    load();
  }, [base, verbas, id, load]);

  const updateStatus = useCallback(async (status: string) => {
    const { error } = await supabase.from("processos").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setProcesso((p) => (p ? { ...p, status } : p));
  }, [id]);

  const value = useMemo(
    () => ({ processo, base, audit, loading, verbas, setBase, setVerba, toggleVerba, save, updateStatus }),
    [processo, base, audit, loading, verbas, setBase, setVerba, toggleVerba, save, updateStatus],
  );

  return <ProcessoContext.Provider value={value}>{children}</ProcessoContext.Provider>;
}
