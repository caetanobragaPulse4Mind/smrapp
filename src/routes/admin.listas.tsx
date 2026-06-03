import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useListItems, type ListCategory, type ListItem } from "@/hooks/useListItems";
import { Pencil, Trash2, Plus, Check, X, ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/admin/listas")({
  component: ListasAdmin,
});

const CATEGORIAS: { key: ListCategory; label: string }[] = [
  { key: "tipo_demissao", label: "Tipo de demissão" },
  { key: "aviso_previo", label: "Aviso prévio" },
];

function ListasAdmin() {
  const [tab, setTab] = useState<ListCategory>("tipo_demissao");

  return (
    <div className="min-h-screen bg-background">
      <TopBar>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/" className="opacity-80 hover:opacity-100">Processos</Link>
          <span className="opacity-50">/</span>
          <span>Manutenção de listas</span>
        </nav>
      </TopBar>
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-xl font-semibold">Manutenção de listas</h1>

        <div className="mb-4 flex gap-2 border-b">
          {CATEGORIAS.map((c) => (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm ${
                tab === c.key
                  ? "border-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ListEditor category={tab} />
      </main>
    </div>
  );
}

function ListEditor({ category }: { category: ListCategory }) {
  const { items, loading, refetch } = useListItems(category);
  const [novo, setNovo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function add() {
    const v = novo.trim();
    if (!v) return;
    setSaving(true);
    const nextOrdem = (items[items.length - 1]?.ordem ?? 0) + 1;
    const { error } = await supabase
      .from("list_items")
      .insert({ category, value: v, ordem: nextOrdem });
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setNovo("");
    refetch();
  }

  async function saveEdit(item: ListItem) {
    const v = editingValue.trim();
    if (!v) return;
    const { error } = await supabase
      .from("list_items")
      .update({ value: v })
      .eq("id", item.id);
    if (error) {
      alert(error.message);
      return;
    }
    setEditingId(null);
    refetch();
  }

  async function remove(item: ListItem) {
    if (!confirm(`Excluir "${item.value}"?`)) return;
    const { error } = await supabase.from("list_items").delete().eq("id", item.id);
    if (error) {
      alert(error.message);
      return;
    }
    refetch();
  }

  async function move(item: ListItem, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("list_items").update({ ordem: swap.ordem }).eq("id", item.id),
      supabase.from("list_items").update({ ordem: item.ordem }).eq("id", swap.id),
    ]);
    refetch();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Adicionar novo item"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button
          onClick={add}
          disabled={saving || !novo.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum item cadastrado.</p>
      ) : (
        <ul className="divide-y rounded-md border bg-card">
          {items.map((item, idx) => (
            <li key={item.id} className="flex items-center gap-2 px-3 py-2">
              <div className="flex flex-col">
                <button
                  onClick={() => move(item, -1)}
                  disabled={idx === 0}
                  className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => move(item, 1)}
                  disabled={idx === items.length - 1}
                  className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>

              {editingId === item.id ? (
                <>
                  <input
                    className="input flex-1"
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <button
                    onClick={() => saveEdit(item)}
                    className="rounded p-1.5 hover:bg-muted"
                    aria-label="Salvar"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded p-1.5 hover:bg-muted"
                    aria-label="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{item.value}</span>
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditingValue(item.value);
                    }}
                    className="rounded p-1.5 hover:bg-muted"
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(item)}
                    className="rounded p-1.5 text-destructive hover:bg-muted"
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
