import Link from "next/link";

// 404 localizado dentro de [lang]: por convención not-found.tsx no recibe el
// params del segmento y se prerenderiza, así que el texto es bilingüe (ES/EN)
// en un solo bloque en vez de depender de cookies o detección de idioma.
export default function NotFound() {
  return (
    <section className="placeholder-page">
      <h1>404</h1>
      <p>
        Esta pieza no está en la fábrica. Vuelve al inicio para recorrerla
        completa.
        <br />
        This piece is not in the factory. Go back home to tour it all.
      </p>
      <Link href="/es">Volver al inicio · Back home</Link>
    </section>
  );
}
