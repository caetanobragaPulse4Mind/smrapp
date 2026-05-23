import { createFileRoute } from "@tanstack/react-router";
import { ProcessoProvider } from "@/state/ProcessoContext";
import { FichaLayout } from "@/components/ficha/FichaLayout";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/processo/$id")({
  component: ProcessoPage,
});

function ProcessoPage() {
  const { id } = Route.useParams();
  return (
    <ProcessoProvider id={id}>
      <Toaster richColors position="top-right" />
      <FichaLayout />
    </ProcessoProvider>
  );
}
