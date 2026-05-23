import { STATUS_PROCESSO, type StatusProcesso } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<StatusProcesso, string> = {
  "Aguardando": "bg-[color:var(--info)]/10 text-[color:var(--info)] ring-[color:var(--info)]/30",
  "Em cálculo": "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)] ring-[color:var(--warning)]/40",
  "Finalizado": "bg-[color:var(--success)]/10 text-[color:var(--success)] ring-[color:var(--success)]/30",
  "Cancelado": "bg-destructive/10 text-destructive ring-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  const s = (STATUS_PROCESSO.includes(status as StatusProcesso) ? status : "Aguardando") as StatusProcesso;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        STATUS_CLASSES[s],
      )}
    >
      {s}
    </span>
  );
}
