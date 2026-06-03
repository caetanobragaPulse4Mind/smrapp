import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ListCategory = "tipo_demissao" | "aviso_previo";

export type ListItem = {
  id: string;
  category: string;
  value: string;
  ordem: number;
};

export function useListItems(category: ListCategory) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("list_items")
      .select("*")
      .eq("category", category)
      .order("ordem", { ascending: true });
    setItems((data as ListItem[]) ?? []);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    refetch();
    const channel = supabase
      .channel(`list_items_${category}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "list_items", filter: `category=eq.${category}` },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, refetch]);

  return { items, values: items.map((i) => i.value), loading, refetch };
}
