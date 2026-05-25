import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SecaoMC = {
  devido: string;
  clausula_cct: string;
  ccts: string[];
  valor_piso: string;
  observacao: string;
};

const SECAO_DEFAULT: SecaoMC = {
  devido: "",
  clausula_cct: "",
  ccts: ["", "", "", "", ""],
  valor_piso: "",
  observacao: "",
};

const SUB_TABS = [
  { id: "secao_1", label: "Multa I" },
  { id: "secao_2", label: "Multa II" },
  { id: "secao_3", label: "Multa III" },
] as const;

type SubTabId = (typeof SUB_TABS)[number]["id"];

export function MultaConvencionalSecao({
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

  const data = verbas.multa_convencional ?? {};
  const secao: SecaoMC = useMemo(
    () => ({
      ...SECAO_DEFAULT,
      ...(data[sub] ?? {}),
      ccts: data[sub]?.ccts ?? ["", "", "", "", ""],
    }),
    [data, sub],
  );

  function update<K extends keyof SecaoMC>(key: K, value: SecaoMC[K]) {
    setVerba("multa_convencional", (v) => ({
      ...v,
      [sub]: { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value },
    }));
  }

  function updateCct(idx: number, value: string) {
    const next = [...secao.ccts];
    next[idx] = value;
    update("ccts", next);
  }

  const currentIdx = SUB_TABS.findIndex((t) => t.id === sub);
  const showDetalhes = secao.devido === "Sim";

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
            <Field label="Devido">
              <Select
                value={secao.devido}
                onChange={(v) => update("devido", v)}
                options={["Sim", "Não"]}
              />
            </Field>
          </div>

          {showDetalhes && (
            <div className="space-y-4">
              <Field label="Cláusula CCT">
                <input
                  className="input"
                  value={secao.clausula_cct}
                  onChange={(e) => update("clausula_cct", e.target.value)}
                  placeholder="Informar cláusula"
                />
              </Field>

              <div className="space-y-2">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  CCTs
                </span>
                {secao.ccts.map((cct, idx) => (
                  <input
                    key={idx}
                    className="input"
                    value={cct}
                    placeholder={`CCT ${idx + 1}`}
                    onChange={(e) => updateCct(idx, e.target.value)}
                  />
                ))}
              </div>

              <Field label="Valor piso">
                <input
                  type="number"
                  className="input max-w-xs"
                  value={secao.valor_piso}
                  onChange={(e) => update("valor_piso", e.target.value)}
                  placeholder="Se cálculo versa sobre piso"
                />
              </Field>
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
