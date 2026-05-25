import { useEffect, useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TIPO_OPTS = [
  "INSALUBRIDADE",
  "PERICULOSIDADE",
  "ACUMULO DE FUNÇÃO",
  "ASSIDUIDADE",
  "ATS",
  "COMISSÕES/PRÊMIOS",
  "EQUIPARAÇÃO SALARIAL",
  "GRATIFICAÇÃO",
  "PLUS SALARIAL",
  "PROMOÇÃO",
  "VALOR FIXO",
];
const GRAU_OPTS = ["GRAU MÍNIMO", "GRAU MÉDIO", "GRAU MÁXIMO"];
const BASE_OPTS = ["SAL. MÍNIMO", "SAL. BASE", "REMUNERAÇÃO", "PISO CCT", "PARADIGMA", "VALOR FIXO"];
const REFLEXOS_OPTS = [
  "RSR, FER, 13, AP, FGTS+40%",
  "RSR, FER, 13, AP, FGTS",
  "RSR, FER, 13, FGTS+40%",
  "RSR, FER, 13, FGTS",
  "RSR, FER, 13",
  "FER, 13, AP, FGTS+40%",
  "FER, 13, FGTS",
  "FGTS+40%",
  "FGTS",
];

export type SecaoAC = {
  tipo: string;
  percentual: string;
  grau: string;
  base: string;
  detalhe: string;
  reflexos: string;
  reflexos_horas: string;
  observacao: string;
};

const SECAO_DEFAULT: SecaoAC = {
  tipo: "", percentual: "", grau: "", base: "", detalhe: "",
  reflexos: "", reflexos_horas: "", observacao: "",
};

const SUB_TABS = [
  { id: "secao_1", label: "Adicional I" },
  { id: "secao_2", label: "Adicional II" },
  { id: "secao_3", label: "Adicional III" },
] as const;

type SubTabId = typeof SUB_TABS[number]["id"];

export function AdicionaisCondicionaisSecao({
  onPrev, onNext, prevLabel, nextLabel,
}: {
  onPrev?: () => void; onNext?: () => void; prevLabel?: string; nextLabel?: string;
}) {
  const { verbas, setVerba } = useProcesso();
  const [sub, setSub] = useState<SubTabId>("secao_1");

  const data = verbas.adicionais_condicionais ?? {};
  const secao: SecaoAC = useMemo(() => ({ ...SECAO_DEFAULT, ...(data[sub] ?? {}) }), [data, sub]);

  // Auto-preenche grau de insalubridade com base no percentual
  useEffect(() => {
    if (secao.tipo === "INSALUBRIDADE") {
      const pct = secao.percentual.replace(/[^0-9]/g, "");
      let grau = secao.grau;
      if (pct === "10") grau = "GRAU MÍNIMO";
      else if (pct === "20") grau = "GRAU MÉDIO";
      else if (pct === "40") grau = "GRAU MÁXIMO";
      if (grau && grau !== secao.grau) {
        update("grau", grau);
      }
    }
  }, [secao.percentual, secao.tipo]);

  function update<K extends keyof SecaoAC>(key: K, value: SecaoAC[K]) {
    setVerba("adicionais_condicionais", (v) => ({
      ...v,
      [sub]: { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value },
    }));
  }

  const showPercentual = secao.tipo !== "";
  const showGrau = secao.tipo === "INSALUBRIDADE";
  const showDetalhe = secao.base === "REMUNERAÇÃO" || secao.base === "PARADIGMA";
  const showAviso = secao.reflexos_horas === "Sim";

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 border-b">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition",
              sub === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <Section title="Configuração">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Tipo">
              <Select value={secao.tipo} onChange={(v) => update("tipo", v)} options={TIPO_OPTS} />
            </Field>
            {showPercentual && (
              <Field label="Percentual">
                <input className="input" value={secao.percentual} onChange={(e) => update("percentual", e.target.value)} />
              </Field>
            )}
            {showGrau && (
              <Field label="Grau">
                <Select value={secao.grau} onChange={(v) => update("grau", v)} options={GRAU_OPTS} />
              </Field>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Base">
              <Select value={secao.base} onChange={(v) => update("base", v)} options={BASE_OPTS} />
            </Field>
            {showDetalhe && (
              <Field label="Detalhe">
                <input className="input" value={secao.detalhe} onChange={(e) => update("detalhe", e.target.value)} />
              </Field>
            )}
          </div>
        </Section>

        <Section title="Reflexos">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reflexos">
              <Select value={secao.reflexos} onChange={(v) => update("reflexos", v)} options={REFLEXOS_OPTS} />
            </Field>
            <Field label="Reflexos nas horas?">
              <Select value={secao.reflexos_horas} onChange={(v) => update("reflexos_horas", v)} options={["Sim", "Não"]} />
            </Field>
          </div>
          {showAviso && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
              Observar condenação. Se Sim mas sem condenação → digitar qtd hrs pagas
            </div>
          )}
        </Section>

        <Section title="Observação">
          <textarea
            rows={4}
            className="input"
            value={secao.observacao}
            onChange={(e) => update("observacao", e.target.value)}
          />
        </Section>
      </div>

      {/* Navegação rodapé */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={() => {
            const idx = SUB_TABS.findIndex((t) => t.id === sub);
            if (idx > 0) setSub(SUB_TABS[idx - 1].id);
            else onPrev?.();
          }}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          {sub === "secao_1" ? (prevLabel ?? "BASE") : SUB_TABS[SUB_TABS.findIndex((t) => t.id === sub) - 1].label}
        </button>
        <button
          onClick={() => {
            const idx = SUB_TABS.findIndex((t) => t.id === sub);
            if (idx < SUB_TABS.length - 1) setSub(SUB_TABS[idx + 1].id);
            else onNext?.();
          }}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          {sub === "secao_3" ? (nextLabel ?? "Próxima") : SUB_TABS[SUB_TABS.findIndex((t) => t.id === sub) + 1].label}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] | string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input bg-card">
      <option value="">—</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
