import "./foundations-atlas.css";

type Token = {
  name: string;
  value: string;
  usage: string;
  tone: string;
};

const tokens: Token[] = [
  { name: "Ember 500", value: "#F4780C", usage: "Commits & primary paths", tone: "#F4780C" },
  { name: "Paper", value: "#FAF7F2", usage: "Working canvas", tone: "#FAF7F2" },
  { name: "Kiln ink", value: "#241C14", usage: "Headlines & machine values", tone: "#241C14" },
  { name: "Porcelain", value: "#FFFFFF", usage: "Lifted work surfaces", tone: "#FFFFFF" },
  { name: "Sage check", value: "#21A366", usage: "Confirmed inventory", tone: "#21A366" },
  { name: "Ochre watch", value: "#D9970F", usage: "Needs an eye", tone: "#D9970F" },
];

const chapters = [
  ["01", "A color with a job"],
  ["02", "A number you can trust"],
  ["03", "A clear next move"],
  ["04", "A quiet wayfinding system"],
];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 6l6 6-6 6" /></svg>;
}

export default function FoundationsAtlas() {
  return (
    <main className="atlas">
      <aside className="atlas-rail">
        <div className="atlas-mark" aria-label="OmniQure Ember">
          <span>OQ</span>
          <i />
        </div>
        <p className="atlas-rail-label">Ember field guide</p>
        <ol>
          {chapters.map(([number, label], index) => (
            <li className={index === 0 ? "is-current" : ""} key={number}>
              <b>{number}</b><span>{label}</span>
            </li>
          ))}
        </ol>
        <div className="atlas-edition">
          <span>Edition</span>
          <strong>01 / 2025</strong>
          <p>For people who keep commerce moving.</p>
        </div>
      </aside>

      <section className="atlas-sheet">
        <header className="atlas-header">
          <p className="atlas-kicker">OmniQure / visual language</p>
          <button type="button" className="atlas-print" onClick={() => window.print()}>Print field guide <Arrow /></button>
        </header>

        <div className="atlas-intro">
          <p className="atlas-index">00—</p>
          <h1>Make the<br /><em>important</em> obvious.</h1>
          <p className="atlas-lede">Ember is a working language for busy operators. It gives urgency a clear home and leaves the rest of the screen room to breathe.</p>
        </div>

        <div className="atlas-rule" />

        <section className="atlas-chapter">
          <div className="atlas-chapter-title">
            <span>01</span>
            <h2>The pigment ledger</h2>
            <p>Color is an instruction, never decoration.</p>
          </div>
          <div className="atlas-token-list">
            {tokens.map((token, index) => (
              <article className="atlas-token" key={token.name}>
                <div className="atlas-swatch" style={{ backgroundColor: token.tone }}>
                  {index === 3 && <span>lift</span>}
                </div>
                <div>
                  <h3>{token.name}</h3>
                  <code>{token.value}</code>
                </div>
                <p>{token.usage}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="atlas-chapter atlas-type-chapter">
          <div className="atlas-chapter-title">
            <span>02</span>
            <h2>Two voices,<br />no noise</h2>
            <p>A human read and a machine read.</p>
          </div>
          <div className="atlas-type-stage">
            <p className="atlas-sans-sample">A shipment should feel<br /><strong>within reach.</strong></p>
            <div className="atlas-mono-sample">
              <span>Order signal</span>
              <strong>$ 983,410.00</strong>
              <small>#INV-2094 &nbsp; / &nbsp; 14:32:08</small>
            </div>
          </div>
        </section>

        <section className="atlas-chapter atlas-actions">
          <div className="atlas-chapter-title">
            <span>03</span>
            <h2>Give the hand<br />a direction</h2>
            <p>Every action explains its consequence.</p>
          </div>
          <div className="atlas-action-stage">
            <button type="button" className="atlas-primary" onClick={() => alert("Order marked ready for dispatch.")}>Ready for dispatch <Arrow /></button>
            <button type="button" className="atlas-secondary" onClick={() => alert("Draft saved for later review.")}>Save for review</button>
            <p>Primary is reserved for the moment that changes the work. Everything else stays on paper.</p>
          </div>
        </section>
      </section>
    </main>
  );
}