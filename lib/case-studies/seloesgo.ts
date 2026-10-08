import { tx } from "./helpers"
import type { CaseStudy } from "./types"

export const seloesgo: CaseStudy = {
  slug: "seloesgo",
  summary: tx(
    "Sistema que gera e distribui sozinho as artes de mais de 630 lotéricas em Goiás, a partir dos dados da ConectaLot.",
    "A system that generates and distributes promotional artwork for more than 630 lottery retailers in Goiás from ConectaLot's data.",
  ),
  seoDescription: tx(
    "Estudo de caso: automação da SELOESGO integrada à API da ConectaLot que gera e distribui artes para mais de 630 lotéricas, de horas para segundos.",
    "Case study: a SELOESGO automation on the ConectaLot API that generates and distributes artwork for 630+ lottery retailers, from hours to seconds.",
  ),
  role: tx("Product Engineer · começou como designer", "Product Engineer · started as a designer"),
  client: "SELOESGO",
  period: tx("set 2021 – atual", "Sep 2021 – present"),
  status: tx("Em uso interno", "In internal use"),
  platform: tx("Automação interna e geração de imagens", "Internal automation and image generation"),
  links: [],
  stack: ["Next.js", "ConectaLot API", "REST APIs", "PostgreSQL", "WhatsApp Business API"],
  challenge: [
    tx(
      "Fui contratado como designer. Cada lotérica atendida precisava das suas artes de divulgação, e elas eram montadas uma a uma. Com centenas de lotéricas, a rotina tomava horas e não tinha como crescer.",
      "I was hired as a designer. Every lottery retailer needed its own promotional artwork, assembled one by one. With hundreds of retailers, the routine took hours and could not grow.",
    ),
  ],
  solution: [
    tx(
      "Em vez de acelerar o trabalho manual, construí um sistema integrado à API da ConectaLot que gera as artes e as distribui automaticamente. O que levava horas passou a levar segundos, para mais de 630 lotéricas em Goiás.",
      "Instead of speeding up the manual work, I built a system on top of the ConectaLot API that generates the artwork and distributes it automatically. What took hours now takes seconds, for more than 630 retailers in Goiás.",
    ),
  ],
  contributions: [
    tx("Ver a oportunidade a partir do próprio trabalho de design", "Spotting the opportunity from inside the design work"),
    tx("Integração com a API da ConectaLot", "Integration with the ConectaLot API"),
    tx("Geração automática das artes", "Automatic artwork generation"),
    tx("Distribuição para as lotéricas", "Distribution to the retailers"),
    tx("Operação e evolução do sistema desde 2021", "Running and evolving the system since 2021"),
  ],
  features: [
    {
      title: tx("Dados da ConectaLot", "ConectaLot data"),
      description: tx("As informações vêm direto da API, sem digitação.", "Information comes straight from the API, with no retyping."),
    },
    {
      title: tx("Artes geradas", "Generated artwork"),
      description: tx("Cada lotérica recebe as suas artes prontas.", "Every retailer gets its own finished artwork."),
    },
    {
      title: tx("Distribuição automática", "Automatic distribution"),
      description: tx("As artes chegam às lotéricas sem envio manual.", "Artwork reaches the retailers without manual sending."),
    },
    {
      title: tx("Escala", "Scale"),
      description: tx("Mais de 630 lotéricas atendidas pelo mesmo processo.", "More than 630 retailers served by the same process."),
    },
  ],
  engineering: [
    {
      title: tx("A API como fonte da verdade", "The API as the source of truth"),
      description: tx(
        "A ConectaLot já tinha os dados; o sistema consome a API em vez de copiar informação à mão.",
        "ConectaLot already held the data; the system reads its API instead of copying information by hand.",
      ),
    },
    {
      title: tx("Imagens geradas por código", "Images generated in code"),
      description: tx(
        "As artes são produzidas a partir dos dados de cada lotérica, com o mesmo padrão visual para todas.",
        "Artwork is produced from each retailer's data, with the same visual standard for all of them.",
      ),
    },
  ],
  highlights: [
    { value: "630+", label: tx("lotéricas em Goiás", "lottery retailers in Goiás") },
    { value: tx("Horas → segundos", "Hours → seconds"), label: tx("tempo para produzir as artes", "time to produce the artwork") },
  ],
  media: {},
}
