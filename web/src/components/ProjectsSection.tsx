import { experimentalProjects, productionProjects } from "@/lib/projects";

function Row({ name, url, desc, perm }: { name: string; url: string; desc: string; perm: string }) {
  return (
    <a className="listing-row" href={url} target="_blank" rel="noopener">
      <span className="perm">{perm}</span>
      <span className="name">{name}</span>
      <span className="desc">{desc}</span>
    </a>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="cmd-line">
        <span className="prompt">$</span> ls ~/projects --live
      </div>

      <div className="listing-group-label">production</div>
      <div className="listing">
        {productionProjects.map((p) => (
          <Row key={p.url} {...p} perm="drwxr-xr-x" />
        ))}
      </div>

      <div className="listing-group-label">experimental</div>
      <div className="listing">
        {experimentalProjects.map((p) => (
          <Row key={p.url} {...p} perm="-rw-r--r--" />
        ))}
      </div>
    </section>
  );
}
