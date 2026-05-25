export const TIPO_DEMISSAO = [
  "SEM JUSTA CAUSA",
  "COM JUSTA CAUSA",
  "PEDIDO DE DEMISSÃO",
  "RESCISÃO INDIRETA",
  "ACORDO",
  "ANTECIPAÇÃO DO CONTRATO",
] as const;

export const AVISO_PREVIO = [
  "TRABALHADO",
  "INDENIZADO",
  "DISPENSADO",
  "TRAB + INDENIZADO",
  "NÃO APURAR",
] as const;

export const FGTS_CALCULO = ["CONTA VINCULADA", "NORMAL"] as const;
export const DEFENDEMOS = ["RECLAMANTE", "RECLAMADA", "UNIÃO"] as const;
export const RESPONSABILIDADE = ["SOLIDÁRIA", "SUBSIDIÁRIA", "ÚNICA", "COMPARTILHADA"] as const;
export const EXECUTORES = ["MATEUS RECH", "MATHEUS ESTEVES", "STEPHANIE MARQUES", "TAMIRES LISBOA"] as const;

export const VERBAS_DEFERIDAS_CHIPS = [
  { id: "horas_extras", label: "Horas extras" },
  { id: "horas_intervalares", label: "Horas intervalares" },
  { id: "adicional_noturno", label: "Adicional noturno" },
  { id: "adicionais_condicionais", label: "Adicionais condicionais" },
  { id: "dif_salariais", label: "Dif. salariais" },
  { id: "devolucao_descontos", label: "Devolução de descontos" },
  { id: "multa_convencional", label: "Multa convencional" },
  { id: "vales", label: "Vales VT/VA" },
  { id: "verbas_rescisorias", label: "Verbas rescisórias" },
  { id: "honorarios", label: "Honorários" },
  { id: "danos", label: "Danos" },
  { id: "pensao_vitalicia", label: "Pensão vitalícia" },
  { id: "plr", label: "PLR/PPR" },
  { id: "reintegracao", label: "Reintegração" },
  { id: "deducoes", label: "Deduções" },
] as const;

export const PECAS_JUDICIAIS = [
  "sentenca", "sentenca_ed", "acordao", "acordao_ed", "rr", "tst", "tst_ed",
] as const;
export const PECAS_LABELS: Record<string, string> = {
  sentenca: "Sentença",
  sentenca_ed: "Sentença ED",
  acordao: "Acórdão",
  acordao_ed: "Acórdão ED",
  rr: "RR",
  tst: "TST",
  tst_ed: "TST ED",
};

export const DOCUMENTOS = [
  "trct",
  "contracheques",
  "cartao_ponto",
  "cct",
  "ficha_registro",
  "extrato_fgts",
  "revelia",
] as const;
export const DOCUMENTOS_LABELS: Record<string, string> = {
  trct: "TRCT",
  contracheques: "Contracheques",
  cartao_ponto: "Cartão ponto",
  cct: "CCT",
  ficha_registro: "Ficha de registro",
  extrato_fgts: "Extrato FGTS",
  revelia: "Revelia",
};

export const STATUS_PROCESSO = ["Aguardando", "Em cálculo", "Finalizado", "Cancelado"] as const;
export type StatusProcesso = (typeof STATUS_PROCESSO)[number];

export type VerbaId = (typeof VERBAS_DEFERIDAS_CHIPS)[number]["id"];

export const VERBA_LABEL: Record<string, string> = Object.fromEntries(
  VERBAS_DEFERIDAS_CHIPS.map((v) => [v.id, v.label]),
);
