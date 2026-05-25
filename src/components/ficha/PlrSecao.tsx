import { useMemo } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_OPTS = [
  "SAL. MÍNIMO",
  "SAL. BASE",
  "REMUNERAÇÃO",
  "PISO CCT",
  "VALOR FIXO",
];

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

export type PlrData = {
  base: string;
  base_valor: string;
  percentual: string;
  reflexos: string;
  anos_completos: string;
  anos_proporcionais: string;
  observacao: string;
};

const DEFAULT_DATA: PlrData = {
  base: "",
  base_valor: "",
  percentual: "",
  reflexos: "",
  anos_completos: "",
  anos_proporcionais: "",
  observacao: "",
};

export function PlrSecao({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const { verbas, setVerba } = useProcesso();

  const data: PlrData = useMemo(
    () => ({ ...DEFAULT_DATA, ...(verbas.plr ?? {}) }),
    [verbas.plr],
  );

  function update<K extends keyof PlrData>(key: K, value: PlrData[K]) {
    setVerba("plr", (v) => ({ ...DEFAULT_DATA, ...v, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <Section title="Base">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Base">
              <Select
                value={data.base}
                onChange={(v) => update("base", v)}
                options={BASE_OPTS}
              />
            </Field>
            {data.base === "VALOR FIXO" && (
              <Field label="Valor (R$)">
                <input
                  type="number"
                  className="input"
                  value={data.base_valor}
                  onChange={(e) => update("base_valor", e.target.value)}
                />
              </Field>
            )}
            <Field label="Percentual (%)">
              <input
                type="number"
                className="input"
                value={data.percentual}
                onChange={(e) => update("percentual", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Reflexos">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reflexos">
              <Select
                value={data.reflexos}
                onChange={(v) => update("reflexos", v)}
                options={REFLEXOS_OPTS}
              />
            </Field>
          </div>
        </Section>

        <Section title="Anos">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Anos completos">
              <input
                type="number"
                className="input"
                value={data.anos_completos}
                onChange={(e) => update("anos_completos", e.target.value)}
              />
            </Field>
            <Field label="Anos proporcionais">
              <input
                type="number"
                className="input"
                value={data.anos_proporcionais}
                onChange={(e) => update("anos_proporcionais", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Observação">
          <textarea
            rows={4}
            className="input"
            value={data.observacao}
            onChange={(e) => update("observacao", e.target.value)}
          />
        </Section>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={() => onPrev?.()}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          {prevLabel ?? "Anterior"}
        </button>
        <button
          onClick={() => onNext?.()}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          {nextLabel ?? "Próxima"}
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

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input bg-card">
      <option value="">—</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
