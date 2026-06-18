import Head from 'next/head';
import { getContent } from '../lib/store';

export async function getServerSideProps() {
  const content = await getContent();
  return { props: { content } };
}

function Shot({ image, label }) {
  return (
    <div className="shot">
      {image ? <img src={image} alt="" /> : label}
    </div>
  );
}

function ChannelsSection({ channels, num }) {
  return (
    <section>
      <div className="section-head">
        <span className="num mono">{num}</span>
        <h2>{channels.heading}</h2>
      </div>
      <div className="platform-row">
        {channels.platforms.map((p, i) => (
          <span className="stamp platform" key={i}>
            {p}
          </span>
        ))}
      </div>
      <p style={{ marginTop: 18, color: 'var(--ink-soft)', fontSize: 14, maxWidth: 640 }}>
        {channels.description}
      </p>
    </section>
  );
}

function ProjectsSection({ projects, num }) {
  return (
    <section>
      <div className="section-head">
        <span className="num mono">{num}</span>
        <h2>Build Log: Built With Claude</h2>
      </div>
      {projects.map((proj) => (
        <div className="ticket" key={proj.id}>
          <div className="ticket-top">
            <div>
              <h3>{proj.name}</h3>
              <p className="tagline">{proj.tagline}</p>
            </div>
            <span className={`stamp ${proj.status === 'shipped' ? 'shipped' : 'progress'}`}>
              {proj.status === 'shipped' ? 'SHIPPED' : 'IN PROGRESS'}
            </span>
          </div>
          <p className="body-copy">{proj.body}</p>
          <div className="stack">
            {proj.stack.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <div className="proof">
            <Shot image={proj.image} label="NO IMAGE YET" />
            {proj.link ? (
              <a className="view-link" href={proj.link} target="_blank" rel="noopener noreferrer">
                → {proj.linkLabel || 'View this build'}
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}

function BrandSection({ brand, num }) {
  return (
    <section>
      <div className="section-head">
        <span className="num mono">{num}</span>
        <h2>{brand.heading}</h2>
      </div>
      <div className="brand-grid">
        <div>
          {brand.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: i === 0 ? 15 : 14,
                color: i === 0 ? 'var(--ink)' : 'var(--ink-soft)',
                marginTop: i === 0 ? 0 : 16,
                maxWidth: 520,
              }}
            >
              {p}
            </p>
          ))}
          <div className="gallery">
            {brand.gallery.map((img, i) => (
              <Shot key={i} image={img} label={`SLIDE ${i + 1}`} />
            ))}
          </div>
        </div>
        <div className="stat-block">
          {brand.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="num-big">{s.num}</div>
              <div className="label mono">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LensSection({ lens, num }) {
  return (
    <section>
      <div className="section-head">
        <span className="num mono">{num}</span>
        <h2>{lens.heading}</h2>
      </div>
      <div className="lens-row">
        <div className="copy">
          <p style={{ fontSize: 15, maxWidth: 560 }}>{lens.paragraph}</p>
        </div>
      </div>
      <div className="gallery">
        {lens.gallery.map((img, i) => (
          <Shot key={i} image={img} label={`PHOTO ${i + 1}`} />
        ))}
      </div>
      <div className="gear-row">
        {lens.gear.map((g) => (
          <div className="gear-box" key={g.id}>
            {g.link ? (
              <a href={g.link} target="_blank" rel="noopener noreferrer">
                {g.name}
              </a>
            ) : (
              g.name
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const SECTION_COMPONENTS = {
  channels: ChannelsSection,
  projects: ProjectsSection,
  brand: BrandSection,
  lens: LensSection,
};

export default function Home({ content }) {
  const { hero, channels, projects, brand, lens, footer, sectionOrder } = content;
  const sectionData = { channels, projects, brand, lens };
  const order = sectionOrder && sectionOrder.length ? sectionOrder : ['channels', 'projects', 'brand', 'lens'];

  return (
    <>
      <Head>
        <title>{hero.name}: Builder Manifest</title>
      </Head>
      <div className="wrap">
        <div className="hero">
          <div className="hero-top">
            <div>
              <h1 className="display">{hero.name}</h1>
              <p className="role">{hero.tagline}</p>
            </div>
            <div className="file-tag mono">
              {hero.fileTag}
              <br />
              STATUS: {hero.status}
            </div>
          </div>
          <div className="meta-line mono">
            {hero.meta.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {order.map((key, i) => {
          const Component = SECTION_COMPONENTS[key];
          if (!Component) return null;
          const num = String(i + 1).padStart(2, '0');
          return (
            <div key={key}>
              <Component {...{ [key]: sectionData[key] }} num={num} />
              {i < order.length - 1 ? <div className="section-divider" /> : null}
            </div>
          );
        })}

        <footer>
          <h2 className="display">Let&rsquo;s talk</h2>
          <div className="contact-grid mono">
            <div>
              <span>EMAIL</span>
              <a href={`mailto:${footer.email}`}>{footer.email || 'add your email'}</a>
            </div>
            <div>
              <span>LINKEDIN</span>
              <a href={footer.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                {footer.linkedin || 'add your linkedin'}
              </a>
            </div>
            <div>
              <span>SOCIAL</span>
              <a href={`https://instagram.com/${(footer.social || '').replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                {footer.social}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
