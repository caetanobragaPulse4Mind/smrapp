import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: ListaProcessos,
});

type Processo = {
  id: string;
  numero: string | null;
  reclamante: string | null;
  reclamada: string | null;
  responsavel: string | null;
  status: string;
  created_at: string;
};

function ListaProcessos() {
  const router = useRouter();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("processos")
      .select("id,numero,reclamante,reclamada,responsavel,status,created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setProcessos((data ?? []) as Processo[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return processos;
    return processos.filter(
      (p) =>
        (p.numero ?? "").toLowerCase().includes(t) ||
        (p.reclamante ?? "").toLowerCase().includes(t),
    );
  }, [processos, q]);

  async function novoProcesso() {
    setCreating(true);
    const { data, error } = await supabase
      .from("processos")
      .insert({ status: "Aguardando" })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) { toast.error(error?.message ?? "Erro"); return; }
    router.navigate({ to: "/processo/$id", params: { id: data.id } });
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este processo? Esta ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("processos").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Processo excluído");
    load();
  }

  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-right" />
      <TopBar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Processos</h1>
            <p className="text-sm text-muted-foreground">Fichas processuais trabalhistas</p>
          </div>
          <button
            onClick={novoProcesso}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Novo processo
          </button>
        </div>

        <div className="mb-4 relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por número ou reclamante..."
            className="w-full rounded-md border border-input bg-card pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Processo</th>
                <th className="px-4 py-3 font-medium">Reclamante</th>
                <th className="px-4 py-3 font-medium">Reclamada</th>
                <th className="px-4 py-3 font-medium">Responsável</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhum processo encontrado.</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <Link
                      to="/processo/$id"
                      params={{ id: p.id }}
                      className="font-mono text-link hover:underline"
                    >
                      {p.numero || "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{p.reclamante || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3">{p.reclamada || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3">{p.responsavel || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        to="/processo/$id"
                        params={{ id: p.id }}
                        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => excluir(p.id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
