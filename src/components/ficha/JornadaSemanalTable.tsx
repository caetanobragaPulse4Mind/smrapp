import { cn } from "@/lib/utils";

export type LinhaJornada = { entrada: string; saida: string; intervalo: string };
export type LinhaJornadaDupla = { a: LinhaJornada; b: LinhaJornada; quantos?: string };

export type JornadaSemanal = {
  segunda: LinhaJornada;
  terca: LinhaJornada;
  quarta: LinhaJornada;
  quinta: LinhaJornada;
  sexta: LinhaJornada;
  sabado: LinhaJornadaDupla;
  domingo: LinhaJornadaDupla;
  feriados: LinhaJornadaDupla;
};

const LINHA_DEFAULT: LinhaJornada = { entrada: "", saida: "", intervalo: "" };
const DUPLA_DEFAULT: LinhaJornadaDupla = { a: LINHA_DEFAULT, b: LINHA_DEFAULT, quantos: "" };

export const JORNADA_DEFAULT: JornadaSemanal = {
  segunda: LINHA_DEFAULT, terca: LINHA_DEFAULT, quarta: LINHA_DEFAULT,
  quinta: LINHA_DEFAULT, sexta: LINHA_DEFAULT,
  sabado: DUPLA_DEFAULT, domingo: DUPLA_DEFAULT, feriados: DUPLA_DEFAULT,
};

const DIAS_SIMPLES: { id: keyof Pick<JornadaSemanal, "segunda" | "terca" | "quarta" | "quinta" | "sexta">; label: string }[] = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
];
const DIAS_DUPLOS: { id: keyof Pick<JornadaSemanal, "sabado" | "domingo" | "feriados">; label: string; quantos: boolean }[] = [
  { id: "sabado", label: "Sábado", quantos: false },
  { id: "domingo", label: "Domingo", quantos: true },
  { id: "feriados", label: "Feriados", quantos: true },
];

export function JornadaSemanalTable({
  value,
  onChange,
}: {
  value: JornadaSemanal;
  onChange: (next: JornadaSemanal) => void;
}) {
  function setSimples(dia: keyof JornadaSemanal, field: keyof LinhaJornada, v: string) {
    const cur = (value[dia] as LinhaJornada) ?? LINHA_DEFAULT;
    onChange({ ...value, [dia]: { ...cur, [field]: v } });
  }
  function setDupla(dia: keyof JornadaSemanal, slot: "a" | "b", field: keyof LinhaJornada, v: string) {
    const cur = (value[dia] as LinhaJornadaDupla) ?? DUPLA_DEFAULT;
    onChange({ ...value, [dia]: { ...cur, [slot]: { ...(cur[slot] ?? LINHA_DEFAULT), [field]: v } } });
  }
  function setQuantos(dia: keyof JornadaSemanal, v: string) {
    const cur = (value[dia] as LinhaJornadaDupla) ?? DUPLA_DEFAULT;
    onChange({ ...value, [dia]: { ...cur, quantos: v } });
  }

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="w-[110px] px-3 py-2 font-medium">Dia</th>
            <th className="px-3 py-2 font-medium">Entrada</th>
            <th className="px-3 py-2 font-medium">Saída</th>
            <th className="px-3 py-2 font-medium">Intervalo</th>
            <th className="w-[100px] px-3 py-2 font-medium">Quantos?</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {DIAS_SIMPLES.map((d) => {
            const l = (value[d.id] as LinhaJornada) ?? LINHA_DEFAULT;
            return (
              <tr key={d.id}>
                <td className="px-3 py-2 font-medium">{d.label}</td>
                <td className="px-3 py-1.5"><input type="time" className="input" value={l.entrada} onChange={(e) => setSimples(d.id, "entrada", e.target.value)} /></td>
                <td className="px-3 py-1.5"><input type="time" className="input" value={l.saida} onChange={(e) => setSimples(d.id, "saida", e.target.value)} /></td>
                <td className="px-3 py-1.5"><input type="time" className="input" value={l.intervalo} onChange={(e) => setSimples(d.id, "intervalo", e.target.value)} /></td>
                <td className="px-3 py-1.5 text-muted-foreground/40">—</td>
              </tr>
            );
          })}
          {DIAS_DUPLOS.map((d) => {
            const l = (value[d.id] as LinhaJornadaDupla) ?? DUPLA_DEFAULT;
            return (
              <tr key={d.id} className={cn("align-top")}>
                <td className="px-3 py-2 font-medium">{d.label}</td>
                <td className="px-3 py-1.5">
                  <div className="space-y-1.5">
                    <Labelled tag="A"><input type="time" className="input" value={l.a?.entrada ?? ""} onChange={(e) => setDupla(d.id, "a", "entrada", e.target.value)} /></Labelled>
                    <Labelled tag="B"><input type="time" className="input" value={l.b?.entrada ?? ""} onChange={(e) => setDupla(d.id, "b", "entrada", e.target.value)} /></Labelled>
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  <div className="space-y-1.5">
                    <Labelled tag="A"><input type="time" className="input" value={l.a?.saida ?? ""} onChange={(e) => setDupla(d.id, "a", "saida", e.target.value)} /></Labelled>
                    <Labelled tag="B"><input type="time" className="input" value={l.b?.saida ?? ""} onChange={(e) => setDupla(d.id, "b", "saida", e.target.value)} /></Labelled>
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  <div className="space-y-1.5">
                    <Labelled tag="A"><input type="time" className="input" value={l.a?.intervalo ?? ""} onChange={(e) => setDupla(d.id, "a", "intervalo", e.target.value)} /></Labelled>
                    <Labelled tag="B"><input type="time" className="input" value={l.b?.intervalo ?? ""} onChange={(e) => setDupla(d.id, "b", "intervalo", e.target.value)} /></Labelled>
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  {d.quantos ? (
                    <input type="number" min={0} className="input" value={l.quantos ?? ""} onChange={(e) => setQuantos(d.id, e.target.value)} />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Labelled({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 text-[10px] font-semibold text-muted-foreground">{tag}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
