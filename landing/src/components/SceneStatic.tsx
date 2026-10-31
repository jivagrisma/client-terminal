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
      sizes="(max-width: 767px) 100vw, 1168px"
      preload
      className="scene-static"
    />
  );
}
