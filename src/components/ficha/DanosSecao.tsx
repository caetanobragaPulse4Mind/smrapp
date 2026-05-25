import { useMemo, useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type LinhaDano = {
  data: string;
  valor: string;
  clausula_cct: string;
};

export type SecaoDano = {
  datas: LinhaDano[];
  valor_piso: string;
  observacao: string;
};

const LINHA_DEFAULT: LinhaDano = { data: "", valor: "", clausula_cct: "" };

const SECAO_DEFAULT: SecaoDano = {
  datas: Array(5).fill(null).map(() => ({ ...LINHA_DEFAULT })),
  valor_piso: "",
  observacao: "",
};

const SUB_TABS = [
  { id: "secao_1", label: "Danos I" },
  { id: "secao_2", label: "Danos II" },
  { id: "secao_3", label: "Danos III" },
] as const;

type SubTabId = (typeof SUB_TABS)[number]["id"];

export function DanosSecao({
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

  const data = verbas.danos ?? {};
  const secao: SecaoDano = useMemo(() => {
    const raw = data[sub] ?? {};
    return {
      ...SECAO_DEFAULT,
      ...raw,
      datas: raw.datas
        ? raw.datas.map((d: Partial<LinhaDano>) => ({ ...LINHA_DEFAULT, ...d }))
        : SECAO_DEFAULT.datas,
    };
  }, [data, sub]);

  function update<K extends keyof SecaoDano>(key: K, value: SecaoDano[K]) {
    setVerba("danos", (v) => ({
      ...v,
      [sub]: { ...SECAO_DEFAULT, ...(v?.[sub] ?? {}), [key]: value },
    }));
  }

  function updateLinha(idx: number, field: keyof LinhaDano, value: string) {
    const next = secao.datas.map((l, i) =>
      i === idx ? { ...l, [field]: value } : l,
    );
    update("datas", next);
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
        <Section title="Datas e valores">
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-6 px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Data</th>
                  <th className="px-3 py-2 font-medium">Valor</th>
                  <th className="px-3 py-2 font-medium">Cláusula CCT</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {secao.datas.map((linha, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-secondary/20" : ""}>
                    <td className="px-3 py-1.5 text-muted-foreground text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="date"
                        className="input"
                        value={linha.data}
                        onChange={(e) => updateLinha(idx, "data", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        className="input"
                        value={linha.valor}
                        onChange={(e) => updateLinha(idx, "valor", e.target.value)}
                        placeholder="Valor ou critério"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      {linha.valor && (
                        <input
                          className="input"
                          value={linha.clausula_cct}
                          onChange={(e) => updateLinha(idx, "clausula_cct", e.target.value)}
                          placeholder="Cláusula CCT"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Valor piso">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Valor piso (R$)">
              <input
                type="number"
                className="input"
                value={secao.valor_piso}
                onChange={(e) => update("valor_piso", e.target.value)}
                placeholder="Se cálculo versa sobre piso"
              />
            </Field>
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

      {/* Navegação */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={() => {
            if (currentIdx > 0) setSub(SUB_TABS[currentIdx - 1].id);
            else onPrev?.();
          }}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentIdx === 0 ? (prevLabel ?? "Anterior") : SUB_TABS[currentIdx - 1].label}
        </button>
        <button
          onClick={() => {
            if (currentIdx < SUB_TABS.length - 1) setSub(SUB_TABS[currentIdx + 1].id);
            else onNext?.();
          }}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          {currentIdx === SUB_TABS.length - 1 ? (nextLabel ?? "Próxima") : SUB_TABS[currentIdx + 1].label}
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
