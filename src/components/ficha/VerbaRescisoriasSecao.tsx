import { useMemo } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_OPTS = ["VALOR FIXO", "SAL. MÍNIMO", "SAL. BASE", "REMUNERAÇÃO"];

type ItemRescisorio = {
  devido: string;
  detalhe: string;
};

export type VerbaRescisoria = {
  base: string;
  base_valor: string;
  aviso_previo: ItemRescisorio;
  salario_13: ItemRescisorio;
  salario_13_prop: ItemRescisorio;
  ferias_dobradas: ItemRescisorio;
  ferias_simples: ItemRescisorio;
  dobra_ferias: ItemRescisorio;
  ferias_prop: ItemRescisorio;
  saldo_salario: ItemRescisorio;
  salario_retido: ItemRescisorio & { meses: string };
  multa_40: ItemRescisorio;
  fgts_contratual: ItemRescisorio;
  multa_477: ItemRescisorio;
  multa_467: ItemRescisorio;
  deducao_rescisoria: ItemRescisorio & { valor: string };
};

const ITEM_DEFAULT: ItemRescisorio = { devido: "", detalhe: "" };

const DEFAULT_DATA: VerbaRescisoria = {
  base: "",
  base_valor: "",
  aviso_previo:     { ...ITEM_DEFAULT },
  salario_13:       { ...ITEM_DEFAULT },
  salario_13_prop:  { ...ITEM_DEFAULT },
  ferias_dobradas:  { ...ITEM_DEFAULT },
  ferias_simples:   { ...ITEM_DEFAULT },
  dobra_ferias:     { ...ITEM_DEFAULT },
  ferias_prop:      { ...ITEM_DEFAULT },
  saldo_salario:    { ...ITEM_DEFAULT },
  salario_retido:   { ...ITEM_DEFAULT, meses: "" },
  multa_40:         { ...ITEM_DEFAULT },
  fgts_contratual:  { ...ITEM_DEFAULT },
  multa_477:        { ...ITEM_DEFAULT },
  multa_467:        { ...ITEM_DEFAULT },
  deducao_rescisoria: { ...ITEM_DEFAULT, valor: "" },
};

// Definição das linhas da tabela
const ITENS: {
  key: keyof Omit<VerbaRescisoria, "base" | "base_valor">;
  label: string;
  detalheLabel?: string;
  extraField?: "meses" | "valor";
  extraLabel?: string;
}[] = [
  { key: "aviso_previo",     label: "Aviso prévio",               detalheLabel: "Obs." },
  { key: "salario_13",       label: "13º salário" },
  { key: "salario_13_prop",  label: "13º salário proporcional" },
  { key: "ferias_dobradas",  label: "Férias dobradas + 1/3" },
  { key: "ferias_simples",   label: "Férias simples + 1/3" },
  { key: "dobra_ferias",     label: "Dobra das férias + 1/3" },
  { key: "ferias_prop",      label: "Férias proporcionais + 1/3" },
  { key: "saldo_salario",    label: "Saldo de salário" },
  { key: "salario_retido",   label: "Salário retido",             extraField: "meses", extraLabel: "Meses" },
  { key: "multa_40",         label: "Multa 40%" },
  { key: "fgts_contratual",  label: "FGTS contratual",           detalheLabel: "Base FGTS" },
  { key: "multa_477",        label: "Multa art. 477 CLT" },
  { key: "multa_467",        label: "Multa art. 467 CLT" },
  { key: "deducao_rescisoria", label: "Dedução sobre rescisórias", extraField: "valor", extraLabel: "Valor" },
];

export function VerbaRescisoriasSecao({
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

  const data: VerbaRescisoria = useMemo(
    () => ({ ...DEFAULT_DATA, ...(verbas.verbas_rescisorias ?? {}) }),
    [verbas.verbas_rescisorias],
  );

  function update<K extends keyof VerbaRescisoria>(key: K, value: VerbaRescisoria[K]) {
    setVerba("verbas_rescisorias", (v) => ({
      ...DEFAULT_DATA,
      ...v,
      [key]: value,
    }));
  }

  function updateItem(
    key: keyof Omit<VerbaRescisoria, "base" | "base_valor">,
    field: string,
    value: string,
  ) {
    setVerba("verbas_rescisorias", (v) => {
      const cur = (v?.[key] as any) ?? {};
      return { ...DEFAULT_DATA, ...v, [key]: { ...cur, [field]: value } };
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        {/* Base */}
        <Section title="Base das rescisórias">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Base">
              <Select
                value={data.base}
                onChange={(v) => update("base", v)}
                options={BASE_OPTS}
              />
            </Field>
            {data.base === "VALOR FIXO" && (
              <Field label="Valor">
                <input
                  type="number"
                  className="input"
                  value={data.base_valor}
                  onChange={(e) => update("base_valor", e.target.value)}
                  placeholder="R$"
                />
              </Field>
            )}
          </div>
        </Section>

        {/* Tabela de itens */}
        <Section title="Itens deferidos">
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Verba</th>
                  <th className="w-[100px] px-3 py-2 font-medium">Devido</th>
                  <th className="px-3 py-2 font-medium">Detalhe</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ITENS.map(({ key, label, detalheLabel, extraField, extraLabel }, idx) => {
                  const item = (data[key] as any) ?? {};
                  const showDetalhe = item.devido === "Sim";

                  return (
                    <tr
                      key={key}
                      className={idx % 2 === 1 ? "bg-secondary/20" : ""}
                    >
                      <td className="px-3 py-2 font-medium text-foreground">
                        {label}
                      </td>
                      <td className="px-3 py-1.5">
                        <select
                          value={item.devido ?? ""}
                          onChange={(e) => updateItem(key, "devido", e.target.value)}
                          className="input bg-card text-xs"
                        >
                          <option value="">—</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </td>
                      <td className="px-3 py-1.5">
                        {showDetalhe && (
                          <div className="flex gap-2">
                            {detalheLabel && (
                              <input
                                className="input text-xs"
                                value={item.detalhe ?? ""}
                                onChange={(e) => updateItem(key, "detalhe", e.target.value)}
                                placeholder={detalheLabel}
                              />
                            )}
                            {extraField && (
                              <input
                                type={extraField === "valor" ? "number" : "number"}
                                className="input w-28 text-xs"
                                value={item[extraField] ?? ""}
                                onChange={(e) => updateItem(key, extraField, e.target.value)}
                                placeholder={extraLabel}
                              />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Navegação rodapé */}
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
