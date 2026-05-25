import { useState } from "react";
import { useProcesso } from "@/state/ProcessoContext";
import { VERBA_LABEL, STATUS_PROCESSO } from "@/lib/constants";
import { Check, Circle, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

import { BaseSecao } from "./BaseSecao";
import { ResumoSecao } from "./ResumoSecao";
import { VerbaPlaceholder } from "./VerbaPlaceholder";
import { HorasExtrasSecao } from "./HorasExtrasSecao";
import { HorasIntervalaresSecao } from "./HorasIntervalaresSecao";
import { AdicionalNoturnoSecao } from "./AdicionalNoturnoSecao";
import { JornadaArbitradaSecao, JornadaMistaSecao } from "./JornadaSecoes";

type SecaoId = "BASE" | "RESUMO" | string;

export function FichaLayout() {
  const { processo, base, save, updateStatus, loading } = useProcesso();
  const [secao, setSecao] = useState<SecaoId>("BASE");
  const [saving, setSaving] = useState(false);

  if (loading || !processo) {
    return <div className="p-8 text-muted-foreground">Carregando ficha...</div>;
  }

  // Verbas ativas + jornadas auto-derivadas
  const verbasNav: { id: string; label: string }[] = [
    ...base.verbas_ativas.map((id) => ({ id, label: VERBA_LABEL[id] ?? id })),
  ];
  if (base.jornada_arbitrada) verbasNav.push({ id: "jornada_arbitrada", label: "Jornada arbitrada" });
  if (base.jornada_mista) verbasNav.push({ id: "jornada_mista", label: "Jornada mista" });

  // Concluidas: heurística — BASE concluída se processo + reclamante preenchidos
  const baseCompleta = !!(base.processo && base.reclamante);

  async function handleSave() {
    setSaving(true);
    try { await save(secao); } finally { setSaving(false); }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Topbar específica da ficha */}
      <header className="sticky top-0 z-30 bg-topbar text-topbar-foreground">
        <div className="flex h-12 items-center gap-3 px-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-topbar-foreground/80 hover:text-topbar-foreground">
            <ChevronLeft className="h-4 w-4" /> lista
          </Link>
          <div className="flex-1 truncate text-center text-sm">
            <span className="font-mono">{processo.numero || "—"}</span>
            <span className="mx-2 text-topbar-foreground/40">·</span>
            <span>{processo.reclamante || "—"}</span>
          </div>
          <select
            value={processo.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="rounded-md bg-topbar-foreground/10 px-2 py-1 text-xs text-topbar-foreground outline-none"
          >
            {STATUS_PROCESSO.map((s) => <option key={s} value={s} className="text-foreground">{s}</option>)}
          </select>
          <StatusBadge status={processo.status} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="sticky top-12 h-[calc(100vh-3rem)] w-[168px] shrink-0 overflow-y-auto border-r bg-secondary/40 py-4">
          <SidebarSection title="SEÇÕES">
            <SidebarItem
              label="BASE"
              active={secao === "BASE"}
              done={baseCompleta}
              onClick={() => setSecao("BASE")}
            />
          </SidebarSection>

          {verbasNav.length > 0 && (
            <SidebarSection title="VERBAS DEFERIDAS">
              {verbasNav.map((v) => (
                <SidebarItem
                  key={v.id}
                  label={v.label}
                  active={secao === v.id}
                  done={false}
                  onClick={() => setSecao(v.id)}
                />
              ))}
            </SidebarSection>
          )}

          <SidebarSection title="ENCERRAMENTO">
            <SidebarItem
              label="Resumo"
              active={secao === "RESUMO"}
              done={false}
              onClick={() => setSecao("RESUMO")}
            />
          </SidebarSection>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-4xl px-8 py-6">
            {(() => {
              const ordem: { id: string; label: string }[] = [
                { id: "BASE", label: "BASE" },
                ...verbasNav,
                { id: "RESUMO", label: "Resumo" },
              ];
              const idx = ordem.findIndex((o) => o.id === secao);
              const prev = idx > 0 ? ordem[idx - 1] : undefined;
              const next = idx >= 0 && idx < ordem.length - 1 ? ordem[idx + 1] : undefined;
              const goPrev = prev ? () => setSecao(prev.id) : undefined;
              const goNext = next ? () => setSecao(next.id) : undefined;

              if (secao === "BASE") return <BaseSecao />;
              if (secao === "RESUMO") return <ResumoSecao />;
              if (secao === "horas_extras") {
                return (
                  <HorasExtrasSecao
                    onPrev={goPrev} onNext={goNext}
                    prevLabel={prev?.label} nextLabel={next?.label}
                  />
                );
              }
              if (secao === "horas_intervalares") {
                return (
                  <HorasIntervalaresSecao
                    onPrev={goPrev} onNext={goNext}
                    prevLabel={prev?.label} nextLabel={next?.label}
                  />
                );
              }
              if (secao === "jornada_arbitrada") {
                return (
                  <JornadaArbitradaSecao
                    onPrev={goPrev} onNext={goNext}
                    prevLabel={prev?.label} nextLabel={next?.label}
                  />
                );
              }
              if (secao === "jornada_mista") {
                return (
                  <JornadaMistaSecao
                    onPrev={goPrev} onNext={goNext}
                    prevLabel={prev?.label} nextLabel={next?.label}
                  />
                );
              }
              return <VerbaPlaceholder verbaId={secao} label={VERBA_LABEL[secao] ?? secao} />;
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="space-y-0.5 px-2">{children}</div>
    </div>
  );
}

function SidebarItem({ label, active, done, onClick }: { label: string; active: boolean; done: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs",
        active
          ? "bg-card font-medium text-foreground ring-1 ring-border"
          : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
      )}
    >
      {done ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-[color:var(--success)]" />
      ) : (
        <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}
