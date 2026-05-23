export function VerbaPlaceholder({ verbaId, label }: { verbaId: string; label: string }) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        O formulário desta verba ({verbaId}) será construído em uma próxima etapa.
        Por enquanto, esta seção aparece na navegação porque foi ativada na BASE.
      </p>
    </div>
  );
}
