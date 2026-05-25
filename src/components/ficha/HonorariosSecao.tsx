import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ParteHonorario = {
  percentual: string;
  base: string;
};

type HonorariosAdvocaticios = {
  rcda: ParteHonorario;
  rcte: ParteHonorario;
  valor_fixo: string;
  suspenso: string;
  observacao: string;
};

type HonorariosPericiais = {
  responsabilidade_pagamento: string;
  rcda_data: string;
  rcda_valor: string;
  rcte_data: string;
  rcte_valor: string;
  suspenso: string;
  desconto_credito: string;
  observacao: string;
};

export type HonorariosData = {
  advocaticios: HonorariosAdvocaticios;
  periciais_1: HonorariosPericiais;
  periciais_2: HonorariosPericiais;
};

// ─── Defaults ────────────────────────────────────────────────────────────────

const PARTE_DEFAULT: ParteHonorario = { percentual: "", base: "" };

const ADVOCATICIOS_DEFAULT: HonorariosAdvocaticios = {
  rcda: { ...PARTE_DEFAULT },
  rcte: { ...PARTE_DEFAULT },
  valor_fixo: "",
  suspenso: "",
  observacao: "",
};

const PERICIAIS_DEFAULT: HonorariosPericiais = {
  responsabilidade_pagamento: "",
  rcda_data: "",
  rcda_valor: "",
  rcte_data: "",
  rcte_valor: "",
  suspenso: "",
  desconto_credito: "",
  observacao: "",
};

const DEFAULT_DATA: HonorariosData = {
  advocaticios: ADVOCATICIOS_DEFAULT,
  periciais_1: PERICIAIS_DEFAULT,
  periciais_2: PERICIAIS_DEFAULT,
};

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────

const SUB_TABS = [
  { id: "advocaticios",  label: "Honorários advocatícios" },
  { id: "periciais_1",  label: "Honorários periciais 1" },
  { id: "periciais_2",  label: "Honorários periciais 2" },
] as const;

type SubTabId = (typeof SUB_TABS)[number]["id"];

// ─── Componente principal ─────────────────────────────────────────────────────

export function HonorariosSecao({
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
  const [sub, setSub] = useState<SubTabId>("advocaticios");

  const data: HonorariosData = useMemo(
    () => ({ ...DEFAULT_DATA, ...(verbas.honorarios ?? {}) }),
    [verbas.honorarios],
  );

  function updateAdvocaticios<K extends keyof HonorariosAdvocaticios>(
    key: K,
    value: HonorariosAdvocaticios[K],
  ) {
    setVerba("honorarios", (v) => ({
      ...DEFAULT_DATA,
      ...v,
      advocaticios: { ...ADVOCATICIOS_DEFAULT, ...(v?.advocaticios ?? {}), [key]: value },
    }));
  }

  function updateParte(
    secao: "advocaticios",
    parte: "rcda" | "rcte",
    field: keyof ParteHonorario,
    value: string,
  ) {
    setVerba("honorarios", (v) => {
      const cur = { ...ADVOCATICIOS_DEFAULT, ...(v?.advocaticios ?? {}) };
      return {
        ...DEFAULT_DATA,
        ...v,
        advocaticios: {
          ...cur,
          [parte]: { ...(cur[parte] ?? PARTE_DEFAULT), [field]: value },
        },
      };
    });
  }

  function updatePericiais(
    secaoKey: "periciais_1" | "periciais_2",
    field: keyof HonorariosPericiais,
    value: string,
  ) {
    setVerba("honorarios", (v) => ({
      ...DEFAULT_DATA,
      ...v,
      [secaoKey]: { ...PERICIAIS_DEFAULT, ...(v?.[secaoKey] ?? {}), [field]: value },
    }));
  }

  const currentIdx = SUB_TABS.findIndex((t) => t.id === sub);
  const adv = data.advocaticios;
  const showSuspenso = !!(adv.rcda.percentual || adv.rcte.percentual);

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

      {/* ── Advocatícios ── */}
      {sub === "advocaticios" && (
        <div className="space-y-8">
          <Section title="RCDA (Reclamada)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Percentual (%)">
                <input
                  type="number"
                  className="input"
                  value={adv.rcda.percentual}
                  onChange={(e) => updateParte("advocaticios", "rcda", "percentual", e.target.value)}
                  placeholder="Ex: 15"
                />
              </Field>
              {adv.rcda.percentual && (
                <Field label="Base de cálculo">
                  <input
                    className="input"
                    value={adv.rcda.base}
                    onChange={(e) => updateParte("advocaticios", "rcda", "base", e.target.value)}
                  />
                </Field>
              )}
            </div>
          </Section>

          <Section title="RCTE (Reclamante)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Percentual (%)">
                <input
                  type="number"
                  className="input"
                  value={adv.rcte.percentual}
                  onChange={(e) => updateParte("advocaticios", "rcte", "percentual", e.target.value)}
                  placeholder="Ex: 15"
                />
              </Field>
              {adv.rcte.percentual && (
                <Field label="Base de cálculo">
                  <input
                    className="input"
                    value={adv.rcte.base}
                    onChange={(e) => updateParte("advocaticios", "rcte", "base", e.target.value)}
                  />
                </Field>
              )}
            </div>
          </Section>

          <Section title="Valor fixo">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Valor fixo (R$)">
                <input
                  type="number"
                  className="input"
                  value={adv.valor_fixo}
                  onChange={(e) => updateAdvocaticios("valor_fixo", e.target.value)}
                  placeholder="Alternativa ao percentual"
                />
              </Field>
            </div>
          </Section>

          {showSuspenso && (
            <Section title="Suspensão">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Suspenso?">
                  <Select
                    value={adv.suspenso}
                    onChange={(v) => updateAdvocaticios("suspenso", v)}
                    options={["Sim", "Não"]}
                  />
                </Field>
              </div>
            </Section>
          )}

          <Section title="Observação">
            <textarea
              rows={4}
              className="input"
              value={adv.observacao}
              onChange={(e) => updateAdvocaticios("observacao", e.target.value)}
            />
          </Section>
        </div>
      )}

      {/* ── Periciais 1 e 2 ── */}
      {(sub === "periciais_1" || sub === "periciais_2") && (
        <PeriaisForm
          data={data[sub]}
          onChange={(field, value) => updatePericiais(sub, field, value)}
        />
      )}

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

// ─── Subcomponente periciais (reutilizado nas seções 1 e 2) ──────────────────

function PeriaisForm({
  data,
  onChange,
}: {
  data: HonorariosPericiais;
  onChange: (field: keyof HonorariosPericiais, value: string) => void;
}) {
  const showDescontoCred = !!data.rcte_data;

  return (
    <div className="space-y-8">
      <Section title="Responsabilidade pelo pagamento">
        <Field label="Responsabilidade">
          <input
            className="input"
            value={data.responsabilidade_pagamento}
            onChange={(e) => onChange("responsabilidade_pagamento", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="RCDA (Reclamada)">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data">
            <input
              type="date"
              className="input"
              value={data.rcda_data}
              onChange={(e) => onChange("rcda_data", e.target.value)}
            />
          </Field>
          <Field label="Valor fixo (R$)">
            <input
              type="number"
              className="input"
              value={data.rcda_valor}
              onChange={(e) => onChange("rcda_valor", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="RCTE (Reclamante)">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data">
            <input
              type="date"
              className="input"
              value={data.rcte_data}
              onChange={(e) => onChange("rcte_data", e.target.value)}
            />
          </Field>
          <Field label="Valor fixo (R$)">
            <input
              type="number"
              className="input"
              value={data.rcte_valor}
              onChange={(e) => onChange("rcte_valor", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Opções">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Suspenso?">
            <Select
              value={data.suspenso}
              onChange={(v) => onChange("suspenso", v)}
              options={["Sim", "Não"]}
            />
          </Field>
          {showDescontoCred && (
            <Field label="Desconto de crédito?">
              <Select
                value={data.desconto_credito}
                onChange={(v) => onChange("desconto_credito", v)}
                options={["Sim", "Não"]}
              />
            </Field>
          )}
        </div>
      </Section>

      <Section title="Observação">
        <textarea
          rows={4}
          className="input"
          value={data.observacao}
          onChange={(e) => onChange("observacao", e.target.value)}
        />
      </Section>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
