const career = [
  {
    when: "2026 — in progress",
    what: "BSc Software Engineering",
    where: "Atlantic International University",
  },
  {
    when: "2021 — present",
    what: "Head of AI Engineering",
    where: "Agrosurkapital LLC",
  },
  {
    when: "2022 — 2025",
    what: "Adjunct Professor, Software Development",
    where: "CESDE",
  },
  {
    when: "2024",
    what: "BA Social Communication — Journalism",
    where: "Universidad de Antioquia",
  },
  {
    when: "2019 — present",
    what: "Co-Founder & CTO",
    where: "Giroplay S.A.S.",
  },
  {
    when: "2021",
    what: "Associate Degree, Software & App Development",
    where: "CESDE",
  },
];

export default function CareerSection() {
  return (
    <section id="career">
      <div className="cmd-line">
        <span className="prompt">$</span> git log --oneline career.git
      </div>
      <div className="out">
        <div className="log">
          {career.map((e) => (
            <div className="log-entry" key={`${e.when}-${e.what}`}>
              <div className="when">{e.when}</div>
              <div className="what">
                <b>{e.what}</b> — {e.where}
              </div>
            </div>
          ))}
        </div>
        <div className="actions">
          <a className="btn" href="/cv-jorge-grisales.pdf" download>
            ↓ download cv.pdf
          </a>
        </div>
      </div>
    </section>
  );
}
