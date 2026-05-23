import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JornadaSemanalTable, JORNADA_DEFAULT, type JornadaSemanal } from "./JornadaSemanalTable";

const PERIODO_OPTS = ["FIXA", "VARIÁVEL", "COMPLETO", "SEPARADO"];
const FORMATO_OPTS = ["5X2", "6X1", "12X36", "OUTRO"];

type PeriodoArb = {
  periodo: string;
  periodo_de: string;
  periodo_ate: string;
  formato: string;
  formato_outro: string;
  folga: string;
  folga_outro: string;
  jornada: JornadaSemanal;
  observacao: string;
};

const PERIODO_DEFAULT: PeriodoArb = {
  periodo: "", periodo_de: "", periodo_ate: "",
  formato: "", formato_outro: "",
  folga: "", folga_outro: "",
  jornada: JORNADA_DEFAULT,
  observacao: "",
};

const SUB_TABS = [
  { id: "periodo_1", label: "Período I" },
  { id: "periodo_2", label: "Período II" },
  { id: "periodo_3", label: "Período III" },
] as const;
type SubTabId = typeof SUB_TABS[number]["id"];

export function JornadaArbitradaSecao({
  onPrev, onNext, prevLabel, nextLabel,
}: {
  onPrev?: () => void; onNext?: () => void; prevLabel?: string; nextLabel?: string;
}) {
  const { verbas, setVerba } = useProcesso();
  const [sub, setSub] = useState<SubTabId>("periodo_1");

  const data = verbas.jornada_arbitrada ?? {};
  const p: PeriodoArb = useMemo(() => ({ ...PERIODO_DEFAULT, ...(data[sub] ?? {}) }), [data, sub]);

  function update<K extends keyof PeriodoArb>(key: K, value: PeriodoArb[K]) {
    setVerba("jornada_arbitrada", (v) => ({ ...v, [sub]: { ...PERIODO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value } }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition",
              sub === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >{t.label}</button>
        ))}
      </div>

      <Section title="Configuração">
        <div className="grid grid-cols-4 gap-4">
          <Field label="Período"><Select value={p.periodo} onChange={(v) => update("periodo", v)} options={PERIODO_OPTS} /></Field>
          {p.periodo === "SEPARADO" && (
            <>
              <Field label="De"><input type="date" className="input" value={p.periodo_de} onChange={(e) => update("periodo_de", e.target.value)} /></Field>
              <Field label="Até"><input type="date" className="input" value={p.periodo_ate} onChange={(e) => update("periodo_ate", e.target.value)} /></Field>
            </>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Field label="Formato"><Select value={p.formato} onChange={(v) => update("formato", v)} options={FORMATO_OPTS} /></Field>
          {p.formato === "OUTRO" && (
            <Field label="Qual? (formato)"><input className="input" value={p.formato_outro} onChange={(e) => update("formato_outro", e.target.value)} /></Field>
          )}
          <Field label="Folga"><Select value={p.folga} onChange={(v) => update("folga", v)} options={FORMATO_OPTS} /></Field>
          {p.folga === "OUTRO" && (
            <Field label="Qual? (folga)"><input className="input" value={p.folga_outro} onChange={(e) => update("folga_outro", e.target.value)} /></Field>
          )}
        </div>
      </Section>

      <Section title="Jornada semanal">
        <JornadaSemanalTable value={p.jornada} onChange={(j) => update("jornada", j)} />
      </Section>

      <Section title="Observação">
        <textarea rows={4} className="input" value={p.observacao} onChange={(e) => update("observacao", e.target.value)} />
      </Section>

      <FooterNav sub={sub} setSub={setSub} onPrev={onPrev} onNext={onNext} prevLabel={prevLabel} nextLabel={nextLabel} />
    </div>
  );
}

// ===== Jornada Mista =====

type PeriodoMisto = {
  periodo_a_de: string;
  periodo_a_ate: string;
  periodo_b_de: string;
  periodo_b_ate: string;
  formato: string;
  formato_outro: string;
  folga: string;
  folga_outro: string;
  jornada: JornadaSemanal;
  observacao: string;
};

const PERIODO_MISTO_DEFAULT: PeriodoMisto = {
  periodo_a_de: "", periodo_a_ate: "", periodo_b_de: "", periodo_b_ate: "",
  formato: "", formato_outro: "", folga: "", folga_outro: "",
  jornada: JORNADA_DEFAULT, observacao: "",
};

export function JornadaMistaSecao({
  onPrev, onNext, prevLabel, nextLabel,
}: {
  onPrev?: () => void; onNext?: () => void; prevLabel?: string; nextLabel?: string;
}) {
  const { verbas, setVerba } = useProcesso();
  const [sub, setSub] = useState<SubTabId>("periodo_1");

  const data = verbas.jornada_mista ?? {};
  const p: PeriodoMisto = useMemo(() => ({ ...PERIODO_MISTO_DEFAULT, ...(data[sub] ?? {}) }), [data, sub]);

  function update<K extends keyof PeriodoMisto>(key: K, value: PeriodoMisto[K]) {
    setVerba("jornada_mista", (v) => ({ ...v, [sub]: { ...PERIODO_MISTO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value } }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition",
              sub === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >{t.label}</button>
        ))}
      </div>

      <Section title="Período A">
        <div className="grid grid-cols-4 gap-4">
          <Field label="De"><input type="date" className="input" value={p.periodo_a_de} onChange={(e) => update("periodo_a_de", e.target.value)} /></Field>
          <Field label="Até"><input type="date" className="input" value={p.periodo_a_ate} onChange={(e) => update("periodo_a_ate", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Período B">
        <div className="grid grid-cols-4 gap-4">
          <Field label="De"><input type="date" className="input" value={p.periodo_b_de} onChange={(e) => update("periodo_b_de", e.target.value)} /></Field>
          <Field label="Até"><input type="date" className="input" value={p.periodo_b_ate} onChange={(e) => update("periodo_b_ate", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Formato e folga">
        <div className="grid grid-cols-4 gap-4">
          <Field label="Formato"><Select value={p.formato} onChange={(v) => update("formato", v)} options={FORMATO_OPTS} /></Field>
          {p.formato === "OUTRO" && (
            <Field label="Qual? (formato)"><input className="input" value={p.formato_outro} onChange={(e) => update("formato_outro", e.target.value)} /></Field>
          )}
          <Field label="Folga"><Select value={p.folga} onChange={(v) => update("folga", v)} options={FORMATO_OPTS} /></Field>
          {p.folga === "OUTRO" && (
            <Field label="Qual? (folga)"><input className="input" value={p.folga_outro} onChange={(e) => update("folga_outro", e.target.value)} /></Field>
          )}
        </div>
      </Section>

      <Section title="Jornada semanal">
        <JornadaSemanalTable value={p.jornada} onChange={(j) => update("jornada", j)} />
      </Section>

      <Section title="Observação">
        <textarea rows={4} className="input" value={p.observacao} onChange={(e) => update("observacao", e.target.value)} />
      </Section>

      <FooterNav sub={sub} setSub={setSub} onPrev={onPrev} onNext={onNext} prevLabel={prevLabel} nextLabel={nextLabel} />
    </div>
  );
}

// ===== Shared helpers =====

function FooterNav({
  sub, setSub, onPrev, onNext, prevLabel, nextLabel,
}: {
  sub: SubTabId; setSub: (s: SubTabId) => void;
  onPrev?: () => void; onNext?: () => void; prevLabel?: string; nextLabel?: string;
}) {
  const idx = SUB_TABS.findIndex((t) => t.id === sub);
  return (
    <div className="flex items-center justify-between border-t pt-4">
      <button
        onClick={() => { if (idx > 0) setSub(SUB_TABS[idx - 1].id); else onPrev?.(); }}
        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        {idx === 0 ? (prevLabel ?? "Anterior") : SUB_TABS[idx - 1].label}
      </button>
      <button
        onClick={() => { if (idx < SUB_TABS.length - 1) setSub(SUB_TABS[idx + 1].id); else onNext?.(); }}
        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
      >
        {idx === SUB_TABS.length - 1 ? (nextLabel ?? "Próxima") : SUB_TABS[idx + 1].label}
        <ChevronRight className="h-4 w-4" />
      </button>
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
