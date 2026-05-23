import { useProcesso } from "@/state/ProcessoContext";
import { VERBA_LABEL } from "@/lib/constants";

export function ResumoSecao() {
  const { base, processo, audit } = useProcesso();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Resumo</h2>
        <p className="text-sm text-muted-foreground">Visão geral da ficha processual.</p>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted-foreground">Processo</dt><dd className="font-mono">{base.processo || "—"}</dd></div>
          <div><dt className="text-muted-foreground">Vara</dt><dd>{base.vara || "—"}</dd></div>
          <div><dt className="text-muted-foreground">Reclamante</dt><dd>{base.reclamante || "—"}</dd></div>
          <div><dt className="text-muted-foreground">Status</dt><dd>{processo?.status}</dd></div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Verbas ativas</dt>
            <dd>{base.verbas_ativas.length ? base.verbas_ativas.map((v) => VERBA_LABEL[v]).join(", ") : "Nenhuma"}</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <h3 className="mb-2 text-sm font-semibold">Últimas alterações</h3>
        <ul className="text-sm">
          {audit.slice(0, 5).map((a) => (
            <li key={a.id} className="flex justify-between border-b py-1.5 last:border-0">
              <span>{a.acao}</span>
              <span className="text-muted-foreground">{new Date(a.timestamp).toLocaleString("pt-BR")}</span>
            </li>
          ))}
          {audit.length === 0 && <li className="text-muted-foreground">Nenhuma alteração registrada.</li>}
        </ul>
      </div>
    </div>
  );
}
