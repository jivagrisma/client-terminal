import Image from "next/image";

// Fondo de la escena (ADR-0004): plate 2K 2752×1536 (mismo encuadre que el
// plate 1376×768 original). Server Component: el HTML del LCP sale sin
// esperar JS de cliente. Vive dentro de la capa `background` del SceneStage.
export function SceneStatic({ alt }: { alt: string }) {
  return (
    <Image
      src="/assets/scene-day.jpg"
      alt={alt}
      width={2752}
      height={1536}
      // En móvil la escena vive en la tarjeta del home (main con padding):
      // 92vw sirve un candidato más pequeño y barato de decodificar (T10).
      sizes="(max-width: 767px) 92vw, 1168px"
      preload
      fetchPriority="high"
      className="scene-static"
    />
  );
}
