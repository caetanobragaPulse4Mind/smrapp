import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DIVISOR_OPTS = ["180", "192", "200", "220", "150", "120", "66", "67", "71", "235-C", "235-D", "384"];
const BASE_APURACAO_OPTS = ["CP", "ARBITRADO", "MISTO"];
const ADICIONAL_OPTS = ["10%", "20%", "50%", "75%", "80%", "90%", "100%", "150%", "% CCT"];
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
const SUMULAS = [
  { id: "sum_60", label: "Súm. 60 — Separar horas em diurnas e noturnas" },
  { id: "sum_340", label: "Súm. 340 — Rcte tem remuneração variável" },
  { id: "sum_264", label: "Súm. 264 — Digitar todas as verbas salariais" },
  { id: "oj_97", label: "OJ 97 — Separar horas em diurnas e noturnas" },
  { id: "art_58", label: "Art. 58" },
  { id: "sum_85", label: "Súm. 85 — Adicional e Hora Adicional" },
];

type SecaoHI = {
  artigo: string;
  fixo_a: string;
  fixo_b: string;
  divisor: string;
  base_apuracao: string;
  limite: string;
  limite_data: string;
  adicional_1: string;
  adicional_1_cct: string;
  adicional_2: string;
  reflexos: string;
  aumento_media: string;
  sumulas: Record<string, boolean>;
  observacao: string;
};

const SECAO_DEFAULT: SecaoHI = {
  artigo: "", fixo_a: "", fixo_b: "", divisor: "", base_apuracao: "",
  limite: "", limite_data: "",
  adicional_1: "", adicional_1_cct: "", adicional_2: "",
  reflexos: "", aumento_media: "",
  sumulas: {}, observacao: "",
};

const SUB_TABS = [
  { id: "secao_1", label: "Intervalares I" },
  { id: "secao_2", label: "Intervalares II" },
  { id: "secao_3", label: "Intervalares III" },
] as const;

type SubTabId = typeof SUB_TABS[number]["id"];

export function HorasIntervalaresSecao({
  onPrev, onNext, prevLabel, nextLabel,
}: {
  onPrev?: () => void; onNext?: () => void; prevLabel?: string; nextLabel?: string;
}) {
  const { verbas, setVerba } = useProcesso();
  const [sub, setSub] = useState<SubTabId>("secao_1");

  const data = verbas.horas_intervalares ?? {};
  const secao: SecaoHI = useMemo(() => ({ ...SECAO_DEFAULT, ...(data[sub] ?? {}) }), [data, sub]);

  function update<K extends keyof SecaoHI>(key: K, value: SecaoHI[K]) {
    setVerba("horas_intervalares", (v) => ({ ...v, [sub]: { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value } }));
  }
  function toggleSumula(sid: string) {
    setVerba("horas_intervalares", (v) => {
      const cur = { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}) };
      return { ...v, [sub]: { ...cur, sumulas: { ...cur.sumulas, [sid]: !cur.sumulas?.[sid] } } };
    });
  }

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
        <Section title="Parâmetros">
          <div className="grid grid-cols-4 gap-4">
            <Field label="Art."><input className="input" value={secao.artigo} onChange={(e) => update("artigo", e.target.value)} /></Field>
            <Field label="Fixo A"><input className="input" value={secao.fixo_a} onChange={(e) => update("fixo_a", e.target.value)} /></Field>
            <Field label="Fixo B"><input className="input" value={secao.fixo_b} onChange={(e) => update("fixo_b", e.target.value)} /></Field>
            <Field label="Divisor"><Select value={secao.divisor} onChange={(v) => update("divisor", v)} options={DIVISOR_OPTS} /></Field>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Field label="Base de apuração"><Select value={secao.base_apuracao} onChange={(v) => update("base_apuracao", v)} options={BASE_APURACAO_OPTS} /></Field>
            <Field label="Limite"><Select value={secao.limite} onChange={(v) => update("limite", v)} options={["Sim", "Não"]} /></Field>
            {secao.limite === "Sim" && (
              <Field label="Data do limite">
                <input type="date" className="input" value={secao.limite_data} onChange={(e) => update("limite_data", e.target.value)} />
              </Field>
            )}
          </div>
        </Section>

        <Section title="Adicionais">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Adicional % (opção 1)">
              <Select value={secao.adicional_1} onChange={(v) => update("adicional_1", v)} options={ADICIONAL_OPTS} />
            </Field>
            {secao.adicional_1 === "% CCT" && (
              <Field label="Qual %?">
                <input className="input" value={secao.adicional_1_cct} onChange={(e) => update("adicional_1_cct", e.target.value)} />
              </Field>
            )}
            <Field label="Adicional % (opção 2)">
              <input className="input" value={secao.adicional_2} onChange={(e) => update("adicional_2", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Reflexos e média">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reflexos"><Select value={secao.reflexos} onChange={(v) => update("reflexos", v)} options={REFLEXOS_OPTS} /></Field>
            <Field label="Aumento da média remunerada?">
              <Select value={secao.aumento_media} onChange={(v) => update("aumento_media", v)} options={["Sim", "Não"]} />
            </Field>
          </div>
        </Section>

        <Section title="Súmulas">
          <div className="space-y-2 rounded-md border bg-card p-4">
            {SUMULAS.map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <label className="text-sm">{s.label}</label>
                <Toggle checked={!!secao.sumulas?.[s.id]} onChange={() => toggleSumula(s.id)} />
              </div>
            ))}
          </div>
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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition",
        checked ? "bg-foreground" : "bg-muted-foreground/30",
      )}
      aria-pressed={checked}
    >
      <span className={cn("inline-block h-4 w-4 transform rounded-full bg-background transition", checked ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}
