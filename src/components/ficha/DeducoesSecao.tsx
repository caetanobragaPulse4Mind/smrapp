import { useMemo } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { ChevronLeft } from "lucide-react";

export type DeducoesData = {
  oj_415: string;
  observacao: string;
};

const DEFAULT_DATA: DeducoesData = {
  oj_415: "",
  observacao: "",
};

export function DeducoesSecao({
  onPrev,
  prevLabel,
}: {
  onPrev?: () => void;
  prevLabel?: string;
}) {
  const { verbas, setVerba } = useProcesso();

  const data: DeducoesData = useMemo(
    () => ({ ...DEFAULT_DATA, ...(verbas.deducoes ?? {}) }),
    [verbas.deducoes],
  );

  function update<K extends keyof DeducoesData>(key: K, value: DeducoesData[K]) {
    setVerba("deducoes", (v) => ({ ...DEFAULT_DATA, ...v, [key]: value }));
  }

  const tipoDeducao =
    data.oj_415 === "Sim"
      ? "Dedução Global"
      : data.oj_415 === "Não"
      ? "Limitar a dedução no mês de competência"
      : null;

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <Section title="OJ 415">
          <div className="grid grid-cols-2 gap-4">
            <Field label="OJ 415">
              <Select
                value={data.oj_415}
                onChange={(v) => update("oj_415", v)}
                options={["Sim", "Não"]}
              />
            </Field>
          </div>

          {tipoDeducao && (
            <div className="rounded-md border bg-secondary/40 px-4 py-3 text-sm font-medium text-foreground">
              {tipoDeducao}
            </div>
          )}
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

      {/* Navegação — é a última verba, só tem botão voltar */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={() => onPrev?.()}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          {prevLabel ?? "Anterior"}
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
