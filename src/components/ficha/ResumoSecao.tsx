import { useProcesso } from "@/state/ProcessoContext";
import { PECAS_LABELS, DOCUMENTOS_LABELS } from "@/lib/constants";
import { formatDateBR } from "@/lib/masks";
import { cn } from "@/lib/utils";
import { Printer, ExternalLink } from "lucide-react";

// ─── Verifica preenchimento de cada verba ────────────────────────────────────
// Lógica espelhando as fórmulas IF da aba RESUMO da planilha original

function checkVerba(verbas: Record<string, any>, id: string): boolean {
  const d = verbas[id];
  if (!d) return false;
  switch (id) {
    case "horas_extras":            return !!(d.secao_1?.exc || d.secao_1?.divisor);
    case "horas_intervalares":      return !!(d.secao_1?.divisor || d.secao_1?.artigo);
    case "adicional_noturno":       return !!(d.exc || d.divisor);
    case "adicionais_condicionais": return !!(d.secao_1?.tipo);
    case "dif_salariais":           return !!(d.secao_1?.tipo);
    case "devolucao_descontos":     return !!(d.secao_1?.em_contracheque);
    case "multa_convencional":      return !!(d.secao_1?.devido);
    case "vales":                   return !!(d.secao_1?.vt || d.secao_1?.va);
    case "verbas_rescisorias":      return !!(d.aviso_previo?.devido || d.base);
    case "danos":                   return !!(d.secao_1?.datas?.[0]?.data || d.secao_1?.valor_piso);
    case "pensao_vitalicia":        return !!(d.base || d.percentual);
    case "plr":                     return !!(d.base || d.percentual);
    case "reintegracao":            return !!(d.base || d.percentual);
    case "honorarios":              return !!(d.advocaticios?.rcda?.percentual || d.advocaticios?.valor_fixo || d.periciais_1?.rcda_valor);
    default:                        return false;
  }
}

// Mapa fiel à planilha: label exibido → id da verba
const CONDENACAO_ITENS: { label: string; id: string }[] = [
  { label: "HORAS EXTRAS",            id: "horas_extras" },
  { label: "INTERVALOS",              id: "horas_intervalares" },
  { label: "ADICIONAL NOTURNO",       id: "adicional_noturno" },
  { label: "ADICIONAIS CONDICIONAIS", id: "adicionais_condicionais" },
  { label: "DIFERENÇA SALARIAL",      id: "dif_salariais" },
  { label: "DEVOLUÇÃO DE DESCONTOS",  id: "devolucao_descontos" },
  { label: "MULTA NORMATIVA",         id: "multa_convencional" },
  { label: "VT E/OU VA",              id: "vales" },
  { label: "VERBAS RESCISÓRIAS",      id: "verbas_rescisorias" },
  { label: "DANOS MORAIS",            id: "danos" },
  { label: "PENSÃO VITALÍCIA",        id: "pensao_vitalicia" },
  { label: "PLR",                     id: "plr" },
  { label: "REINTEGRAÇÃO",            id: "reintegracao" },
  { label: "HONORÁRIOS",              id: "honorarios" },
  { label: "REVELIA",                 id: "revelia" },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function ResumoSecao({ onNavigate }: { onNavigate?: (secao: string) => void }) {
  const { base, verbas } = useProcesso();

  const reclamada1 = base.reclamadas[0]?.nome || "—";
  const cnpj1      = base.reclamadas[0]?.cnpj  || "—";

  function handlePrint() { window.print(); }

  function Row({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
    return (
      <div className="grid grid-cols-[160px_1fr] gap-2 border-b border-dashed border-border/40 py-1.5 text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className={cn("text-foreground", mono && "font-mono text-xs")}>{value || "—"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            SMR Perícia Contábil
          </p>
          <h2 className="text-base font-bold">Ficha Processual — Resumo</h2>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary print:hidden"
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </button>
      </div>

      {/* Corpo — 2 colunas */}
      <div className="grid grid-cols-[1fr_300px] gap-4 rounded-lg border bg-card p-5">

        {/* ── Coluna esquerda ── */}
        <div className="space-y-0">

          <Row label="PROCESSO:"  value={base.processo}  mono />
          <Row label="VARA:"      value={base.vara} />
          <Row label="AUTOR:"     value={base.reclamante} />
          <Row label="CPF:"       value={base.cpf}        mono />
          <Row label="RCDA:"      value={reclamada1} />
          <Row label="CNPJ:"      value={cnpj1}           mono />
          {base.reclamadas.slice(1).map((r, i) => (
            <div key={i}>
              <Row label={`RCDA ${i + 2}:`} value={r.nome} />
              <Row label="CNPJ:" value={r.cnpj} mono />
            </div>
          ))}

          <div className="h-3" />
          <Row label="AJ:"  value={base.ajuizamento ? formatDateBR(base.ajuizamento) : undefined} />
          <Row label="AD:"  value={base.admissao    ? formatDateBR(base.admissao)    : undefined} />
          <Row label="DE:"  value={base.demissao_ativo ? "Ativo" : base.demissao ? formatDateBR(base.demissao) : undefined} />
          <Row label="PR:"  value={base.prescricao  ? formatDateBR(base.prescricao)  : undefined} />

          <div className="h-3" />
          <Row label="TIPO DE DEMISSÃO:" value={base.tipo_demissao} />
          <Row label="AVISO PRÉVIO:"     value={base.aviso_previo} />
          {base.aviso_previo === "TRAB + INDENIZADO" && (
            <Row label="DIAS INDENIZADOS:" value={base.dias_indenizados} />
          )}

          <div className="h-3" />
          {/* Peças judiciais — só exibe as disponíveis */}
          {(["sentenca","sentenca_ed","acordao","acordao_ed","rr","tst","tst_ed"] as const).map((id) => {
            const peca = base.pecas[id];
            if (!peca?.disponivel && !peca?.data) return null;
            return (
              <Row
                key={id}
                label={`${(PECAS_LABELS[id] ?? id).toUpperCase()}:`}
                value={peca.data ? formatDateBR(peca.data) : "Disponível"}
              />
            );
          })}

          <div className="h-3" />
          {/* Documentos */}
          {(["trct","contracheques","cartao_ponto","cct","ficha_registro","extrato_fgts"] as const).map((id) => (
            <Row
              key={id}
              label={`${(DOCUMENTOS_LABELS[id] ?? id).toUpperCase()}:`}
              value={base.documentos[id] ? "Sim" : "Não"}
            />
          ))}

          <div className="h-3" />
          <Row label="REVELIA:"    value={base.revelia} />
          <Row label="DEFENDEMOS:" value={base.defendemos} />
          {base.defendemos === "RECLAMADA" && base.reclamadas.length > 1 && (
            <Row label="QUAL?" value={base.reclamada_defendida} />
          )}
          <Row label="RESP.:" value={base.responsabilidade} />
          {base.responsabilidade === "SUBSIDIÁRIA" && (
            <Row label="PERÍODO:" value={base.periodo_responsabilidade} />
          )}

          <div className="h-3" />
          <Row label="EXECUTOR DA CONTA:"   value={base.executor} />
          <Row label="SIMPLES NACIONAL:"    value={base.simples_nacional ? "Sim" : "Não"} />

          {base.obs_calculista && (
            <div className="pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Obs. ao calculista:
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{base.obs_calculista}</p>
            </div>
          )}
          {base.obs_digitador && (
            <div className="pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Obs. ao digitador:
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{base.obs_digitador}</p>
            </div>
          )}
        </div>

        {/* ── Coluna direita — condenação simplificada ── */}
        <div className="self-start">
          <div className="overflow-hidden rounded-md border">
            <div className="border-b bg-amber-50 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-amber-900">
              Condenação Simplificada
            </div>
            <table className="w-full text-xs">
              <thead className="bg-secondary/60 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-1.5 text-left font-medium">Verba</th>
                  <th className="w-8 px-2 py-1.5 text-center font-medium">Qtd</th>
                  <th className="w-12 px-2 py-1.5 text-center font-medium">Sit.</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CONDENACAO_ITENS.map(({ label, id }, idx) => {
                  const isRevelia = id === "revelia";
                  const ativo = isRevelia
                    ? base.revelia === "Sim"
                    : base.verbas_ativas.includes(id);
                  const preenchido = isRevelia
                    ? base.revelia === "Sim"
                    : ativo && checkVerba(verbas, id);

                  return (
                    <tr key={id} className={idx % 2 === 1 ? "bg-secondary/20" : ""}>
                      <td className="px-3 py-1.5">
                        {ativo && !isRevelia && onNavigate ? (
                          <button
                            onClick={() => onNavigate(id)}
                            className="inline-flex items-center gap-1 text-left text-blue-700 hover:underline"
                          >
                            {label}
                            <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                          </button>
                        ) : (
                          <span className={cn("font-medium", !ativo && "text-muted-foreground/40")}>
                            {label}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-center font-mono">
                        {ativo ? (preenchido ? "1" : "0") : "0"}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        {ativo ? (
                          preenchido ? (
                            <span className="font-semibold text-green-700">Sim</span>
                          ) : (
                            <span className="text-amber-600">Pend.</span>
                          )
                        ) : (
                          <span className="text-muted-foreground/40">Não</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}