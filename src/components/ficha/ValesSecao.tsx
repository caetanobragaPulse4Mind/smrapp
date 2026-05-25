import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SecaoVale = {
  vt: string;
  vt_detalhe: string;
  va: string;
  va_detalhe: string;
  observacao: string;
};

const SECAO_DEFAULT: SecaoVale = {
  vt: "",
  vt_detalhe: "",
  va: "",
  va_detalhe: "",
  observacao: "",
};

const SUB_TABS = [
  { id: "secao_1", label: "Vales I" },
  { id: "secao_2", label: "Vales II" },
  { id: "secao_3", label: "Vales III" },
  { id: "secao_4", label: "Vales IV" },
] as const;

type SubTabId = (typeof SUB_TABS)[number]["id"];

export function ValesSecao({
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
  const [sub, setSub] = useState<SubTabId>("secao_1");

  const data = verbas.vales ?? {};
  const secao: SecaoVale = useMemo(
    () => ({ ...SECAO_DEFAULT, ...(data[sub] ?? {}) }),
    [data, sub],
  );

  function update<K extends keyof SecaoVale>(key: K, value: SecaoVale[K]) {
    setVerba("vales", (v) => ({
      ...v,
      [sub]: { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value },
    }));
  }

  const currentIdx = SUB_TABS.findIndex((t) => t.id === sub);

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
        <Section title="Vale Transporte (VT)">
          <div className="grid grid-cols-2 gap-4">
            <Field label="VT devido?">
              <Select
                value={secao.vt}
                onChange={(v) => update("vt", v)}
                options={["Sim", "Não"]}
              />
            </Field>
            {secao.vt === "Sim" && (
              <Field label="Detalhe">
                <input
                  className="input"
                  value={secao.vt_detalhe}
                  onChange={(e) => update("vt_detalhe", e.target.value)}
                  placeholder="Informar detalhes do VT"
                />
              </Field>
            )}
          </div>
        </Section>

        <Section title="Vale Alimentação (VA)">
          <div className="grid grid-cols-2 gap-4">
            <Field label="VA devido?">
              <Select
                value={secao.va}
                onChange={(v) => update("va", v)}
                options={["Sim", "Não"]}
              />
            </Field>
            {secao.va === "Sim" && (
              <Field label="Detalhe">
                <input
                  className="input"
                  value={secao.va_detalhe}
                  onChange={(e) => update("va_detalhe", e.target.value)}
                  placeholder="Informar detalhes do VA"
                />
              </Field>
            )}
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
            if (currentIdx > 0) setSub(SUB_TABS[currentIdx - 1].id);
            else onPrev?.();
          }}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentIdx === 0
            ? (prevLabel ?? "Anterior")
            : SUB_TABS[currentIdx - 1].label}
        </button>
        <button
          onClick={() => {
            if (currentIdx < SUB_TABS.length - 1)
              setSub(SUB_TABS[currentIdx + 1].id);
            else onNext?.();
          }}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          {currentIdx === SUB_TABS.length - 1
            ? (nextLabel ?? "Próxima")
            : SUB_TABS[currentIdx + 1].label}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input bg-card"
    >
      <option value="">—</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
