import Image from "next/image";

// Fondo de la escena (ADR-0004): el plate 1376×768 es la imagen canónica.
// Server Component: el HTML del LCP sale sin esperar JS de cliente.
// En T5b este componente pasa a ser la capa `background` del SceneStage.
export function SceneStatic({ alt }: { alt: string }) {
  return (
    <Image
      src="/assets/scene-day.png"
      alt={alt}
      width={1376}
      height={768}
      sizes="(max-width: 767px) 100vw, 1168px"
      preload
      className="scene-static"
    />
  );
}
