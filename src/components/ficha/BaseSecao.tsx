import { useProcesso, type BaseData } from "@/state/ProcessoContext";
import {
  TIPO_DEMISSAO, AVISO_PREVIO, FGTS_CALCULO, DEFENDEMOS, RESPONSABILIDADE, EXECUTORES,
  VERBAS_DEFERIDAS_CHIPS, PECAS_JUDICIAIS, PECAS_LABELS, DOCUMENTOS, DOCUMENTOS_LABELS,
} from "@/lib/constants";
import { maskCPF, maskCNPJ, formatDateBR } from "@/lib/masks";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2 } from "lucide-react";

export function BaseSecao() {
  const { base, setBase, audit } = useProcesso();

  function set<K extends keyof BaseData>(key: K, value: BaseData[K]) {
    setBase((b) => ({ ...b, [key]: value }));
  }

  function updateReclamada(i: number, field: "nome" | "cnpj", v: string) {
    setBase((b) => {
      const next = [...b.reclamadas];
      next[i] = { ...next[i], [field]: field === "cnpj" ? maskCNPJ(v) : v };
      return { ...b, reclamadas: next };
    });
  }

  function addReclamada() {
    setBase((b) => ({ ...b, reclamadas: [...b.reclamadas, { nome: "", cnpj: "" }] }));
  }
  function removeReclamada(i: number) {
    setBase((b) => ({ ...b, reclamadas: b.reclamadas.filter((_, idx) => idx !== i) }));
  }

  function togglePeca(id: string) {
    setBase((b) => {
      const cur = b.pecas[id] ?? { disponivel: false, data: "" };
      return { ...b, pecas: { ...b.pecas, [id]: { ...cur, disponivel: !cur.disponivel } } };
    });
  }
  function setPecaData(id: string, data: string) {
    setBase((b) => {
      const cur = b.pecas[id] ?? { disponivel: false, data: "" };
      return { ...b, pecas: { ...b.pecas, [id]: { ...cur, data } } };
    });
  }
  function toggleDoc(id: string) {
    setBase((b) => ({ ...b, documentos: { ...b.documentos, [id]: !b.documentos[id] } }));
  }
  function toggleVerba(id: string) {
    setBase((b) => {
      const has = b.verbas_ativas.includes(id);
      return { ...b, verbas_ativas: has ? b.verbas_ativas.filter((x) => x !== id) : [...b.verbas_ativas, id] };
    });
  }

  return (
    <div className="space-y-10">
      {/* PARTE 1 - IDENTIFICAÇÃO */}
      <Section title="Identificação do processo">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Processo">
            <input
              value={base.processo}
              maxLength={25}
              onChange={(e) => set("processo", e.target.value)}
              className="input font-mono"
            />
          </Field>
          <Field label="Vara">
            <input value={base.vara} onChange={(e) => set("vara", e.target.value)} className="input" />
          </Field>
          <Field label="Reclamante">
            <input value={base.reclamante} onChange={(e) => set("reclamante", e.target.value)} className="input" />
          </Field>
          <Field label="CPF">
            <input
              value={base.cpf}
              onChange={(e) => set("cpf", maskCPF(e.target.value))}
              placeholder="000.000.000-00"
              className="input font-mono"
            />
          </Field>
        </div>

        <div className="space-y-3">
          {base.reclamadas.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_240px_auto] gap-3 items-end">
              <Field label={`Reclamada ${i + 1}`}>
                <input
                  value={r.nome}
                  onChange={(e) => updateReclamada(i, "nome", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="CNPJ">
                <input
                  value={r.cnpj}
                  onChange={(e) => updateReclamada(i, "cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="input font-mono"
                />
              </Field>
              {base.reclamadas.length > 1 && (
                <button
                  onClick={() => removeReclamada(i)}
                  className="mb-1 rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addReclamada}
            className="inline-flex items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar reclamada
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Field label="Ajuizamento"><input type="date" value={base.ajuizamento} onChange={(e) => set("ajuizamento", e.target.value)} className="input" /></Field>
          <Field label="Admissão"><input type="date" value={base.admissao} onChange={(e) => set("admissao", e.target.value)} className="input" /></Field>
          <Field label="Demissão">
            <input
              type="date"
              value={base.demissao}
              disabled={base.demissao_ativo}
              onChange={(e) => set("demissao", e.target.value)}
              className="input disabled:opacity-50"
            />
            <label className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <input type="checkbox" checked={base.demissao_ativo} onChange={(e) => set("demissao_ativo", e.target.checked)} />
              Ativo (sem demissão)
            </label>
          </Field>
          <Field label="Prescrição"><input type="date" value={base.prescricao} onChange={(e) => set("prescricao", e.target.value)} className="input" /></Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo de demissão">
            <Select value={base.tipo_demissao} onChange={(v) => set("tipo_demissao", v)} options={TIPO_DEMISSAO} />
          </Field>
          <Field label="Aviso prévio">
            <Select value={base.aviso_previo} onChange={(v) => set("aviso_previo", v)} options={AVISO_PREVIO} />
          </Field>
        </div>

        {base.aviso_previo === "TRAB + INDENIZADO" && (
          <Field label="Dias indenizados">
            <input type="number" value={base.dias_indenizados} onChange={(e) => set("dias_indenizados", e.target.value)} className="input max-w-xs" />
          </Field>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Field label="FGTS do cálculo"><Select value={base.fgts_calculo} onChange={(v) => set("fgts_calculo", v)} options={FGTS_CALCULO} /></Field>
          <Field label="Defendemos"><Select value={base.defendemos} onChange={(v) => set("defendemos", v)} options={DEFENDEMOS} /></Field>
          <Field label="Responsabilidade"><Select value={base.responsabilidade} onChange={(v) => set("responsabilidade", v)} options={RESPONSABILIDADE} /></Field>
        </div>

        {base.responsabilidade === "SUBSIDIÁRIA" && (
          <Field label="Período da responsabilidade">
            <input value={base.periodo_responsabilidade} onChange={(e) => set("periodo_responsabilidade", e.target.value)} className="input" />
          </Field>
        )}

        {base.defendemos === "RECLAMADA" && base.reclamadas.length > 1 && (
          <Field label="Reclamada defendida">
            <Select
              value={base.reclamada_defendida}
              onChange={(v) => set("reclamada_defendida", v)}
              options={base.reclamadas.map((r, i) => r.nome || `Reclamada ${i + 1}`)}
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Obs. ao calculista">
            <textarea rows={3} value={base.obs_calculista} onChange={(e) => set("obs_calculista", e.target.value)} className="input" />
          </Field>
          <Field label="Obs. ao digitador">
            <textarea rows={3} value={base.obs_digitador} onChange={(e) => set("obs_digitador", e.target.value)} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Executor da conta"><Select value={base.executor} onChange={(v) => set("executor", v)} options={EXECUTORES} /></Field>
          <Field label="Revelia"><Select value={base.revelia} onChange={(v) => set("revelia", v)} options={["Sim", "Não"]} /></Field>
        </div>
      </Section>

      {/* PARTE 2 - DOCUMENTOS */}
      <Section title="Documentos processuais" hint="Datas das peças + flag de disponibilidade">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Peças judiciais</h4>
            <div className="space-y-2">
              {PECAS_JUDICIAIS.map((id) => {
                const cur = base.pecas[id] ?? { disponivel: false, data: "" };
                return (
                  <div key={id} className="grid grid-cols-[1fr_140px_auto] items-center gap-2">
                    <label className="text-sm">{PECAS_LABELS[id]}</label>
                    <input type="date" value={cur.data} onChange={(e) => setPecaData(id, e.target.value)} className="input" />
                    <Toggle checked={cur.disponivel} onChange={() => togglePeca(id)} />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documentos</h4>
            <div className="space-y-2">
              {DOCUMENTOS.map((id) => (
                <div key={id} className="flex items-center justify-between">
                  <label className="text-sm">{DOCUMENTOS_LABELS[id]}</label>
                  <Toggle checked={!!base.documentos[id]} onChange={() => toggleDoc(id)} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={base.simples_nacional}
            onChange={(e) => set("simples_nacional", e.target.checked)}
          />
          1ª reclamada optante pelo Simples Nacional
        </label>
      </Section>

      {/* PARTE 3 - VERBAS DEFERIDAS */}
      <Section title="Verbas deferidas" hint="Ative/desative; as seções aparecem na sidebar">
        <div className="flex flex-wrap gap-2">
          {VERBAS_DEFERIDAS_CHIPS.map((chip) => {
            const active = base.verbas_ativas.includes(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => toggleVerba(chip.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
                  active
                    ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/10 text-[color:var(--success)]"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {active && <Check className="h-3 w-3" />}
                {chip.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* PARTE 4 - HISTÓRICO */}
      <Section title="Histórico de alterações">
        <div className="overflow-hidden rounded-md border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-3 py-2 font-medium">Ação</th><th className="px-3 py-2 font-medium">Usuário</th><th className="px-3 py-2 font-medium">Data e hora</th></tr>
            </thead>
            <tbody className="divide-y">
              {audit.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">Nenhuma alteração ainda. Clique em Salvar para registrar.</td></tr>
              )}
              {audit.map((a) => (
                <tr key={a.id}>
                  <td className="px-3 py-2">{a.acao}</td>
                  <td className="px-3 py-2">{a.usuario || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{formatDateBR(a.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {hint && <p className="mt-0.5 text-[11px] text-muted-foreground/70">{hint}</p>}
      </header>
      <div className="space-y-5">{children}</div>
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
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-background transition",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
