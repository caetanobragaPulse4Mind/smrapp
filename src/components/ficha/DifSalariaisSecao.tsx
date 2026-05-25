import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TIPO_OPTS = [
  "ACUMULO DE FUNÇÃO",
  "ASSIDUIDADE",
  "ATS",
  "COMISSÕES/PRÊMIOS",
  "EQUIPARAÇÃO SALARIAL",
  "GRATIFICAÇÃO",
  "PLUS SALARIAL",
  "PROMOÇÃO",
  "VALOR FIXO",
  "REMUNERAÇÃO",
  "PARADIGMA",
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

export type SecaoDS = {
  tipo: string;
  base: string;
  base_detalhe: string;
  criterio: string;
  reflexos: string;
  reflexos_horas: string;
  observacao: string;
};

const SECAO_DEFAULT: SecaoDS = {
  tipo: "",
  base: "",
  base_detalhe: "",
  criterio: "",
  reflexos: "",
  reflexos_horas: "",
  observacao: "",
};

const SUB_TABS = [
  { id: "secao_1", label: "Dif. Salarial I" },
  { id: "secao_2", label: "Dif. Salarial II" },
  { id: "secao_3", label: "Dif. Salarial III" },
] as const;

type SubTabId = (typeof SUB_TABS)[number]["id"];

export function DifSalariaisSecao({
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

  const data = verbas.dif_salariais ?? {};
  const secao: SecaoDS = useMemo(
    () => ({ ...SECAO_DEFAULT, ...(data[sub] ?? {}) }),
    [data, sub],
  );

  function update<K extends keyof SecaoDS>(key: K, value: SecaoDS[K]) {
    setVerba("dif_salariais", (v) => ({
      ...v,
      [sub]: { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value },
    }));
  }

  const showDetalhe =
    secao.tipo === "REMUNERAÇÃO" || secao.tipo === "PARADIGMA";
  const showAvisoReflexos = secao.reflexos_horas === "Sim";

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
        {/* Configuração */}
        <Section title="Configuração">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Tipo">
              <Select
                value={secao.tipo}
                onChange={(v) => update("tipo", v)}
                options={TIPO_OPTS}
              />
            </Field>
            <Field label="Base">
              <input
                className="input"
                value={secao.base}
                onChange={(e) => update("base", e.target.value)}
                placeholder="Parâmetros do cálculo"
              />
            </Field>
            {showDetalhe && (
              <Field label="Detalhe">
                <input
                  className="input"
                  value={secao.base_detalhe}
                  onChange={(e) => update("base_detalhe", e.target.value)}
                  placeholder="Informar detalhes"
                />
              </Field>
            )}
          </div>

          <Field label="Critério de cálculo">
            <textarea
              rows={3}
              className="input"
              value={secao.criterio}
              onChange={(e) => update("criterio", e.target.value)}
              placeholder="Descreva o critério utilizado para o cálculo..."
            />
          </Field>
        </Section>

        {/* Reflexos */}
        <Section title="Reflexos">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reflexos">
              <Select
                value={secao.reflexos}
                onChange={(v) => update("reflexos", v)}
                options={REFLEXOS_OPTS}
              />
            </Field>
            <Field label="Reflexos nas horas?">
              <Select
                value={secao.reflexos_horas}
                onChange={(v) => update("reflexos_horas", v)}
                options={["Sim", "Não"]}
              />
            </Field>
          </div>

          {showAvisoReflexos && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
              Observar condenação. Se Sim mas sem condenação → digitar qtd hrs
              pagas
            </div>
          )}
        </Section>

        {/* Observação */}
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  options: readonly string[] | string[];
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
