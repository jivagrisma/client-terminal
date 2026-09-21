export type ProjectLink = {
  name: string;
  url: string;
  desc: string;
};

export const productionProjects: ProjectLink[] = [
  {
    name: "viajemos.co",
    url: "https://viajemos.co/",
    desc: "intermunicipal mobility & tourism platform — Next.js, booking agent, payments",
  },
  {
    name: "viajemos app",
    url: "https://play.google.com/store/apps/details?id=co.viajemos.app",
    desc: "android client — Google Play",
  },
  {
    name: "giroplay.online",
    url: "https://www.giroplay.online/",
    desc: "payment collection infrastructure — REST/JWT, banking-as-a-service",
  },
  {
    name: "agrosurkapital.online",
    url: "https://www.agrosurkapital.online/",
    desc: "AI agents for agri-finance — LLM orchestration",
  },
  {
    name: "motos-web",
    url: "https://motos-web-53117453818.us-central1.run.app/",
    desc: "AI lead-scoring demo — Cloud Run",
  },
  {
    name: "esic-fabrica-ia",
    url: "https://esic-fabrica-ia-985215895070.us-central1.run.app/",
    desc: "AI factory demo — Cloud Run",
  },
  {
    name: "waia",
    url: "https://jivagrisma.github.io/WaIA/",
    desc: "AI agent marketplace — Python/FastAPI backend",
  },
];

export const experimentalProjects: ProjectLink[] = [
  {
    name: "frutos-de-mi-tierra",
    url: "https://jivagrisma.github.io/portafolio-frutos-de-mi-tierra/",
    desc: "rural heritage portfolio site",
  },
  {
    name: "sonora",
    url: "https://jivagrisma.github.io/sonora/",
    desc: "static site experiment",
  },
  {
    name: "el-hombre-de-mis-sue-os",
    url: "https://jivagrisma.github.io/el-hombre-de-mis-sue-os/",
    desc: "static site experiment",
  },
];
