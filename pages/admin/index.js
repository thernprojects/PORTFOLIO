import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function reorder(list, fromIndex, toIndex) {
  const copy = [...list];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageUploader({ image, label, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64 }),
      });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
      } else {
        alert(data.error || 'Upload failed.');
      }
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <div
        className="shot"
        style={{ cursor: 'pointer' }}
        onClick={() => inputRef.current && inputRef.current.click()}
        title="Click to upload an image"
      >
        {busy ? 'UPLOADING…' : image ? <img src={image} alt="" /> : label}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      {image ? (
        <button type="button" className="btn secondary" style={{ marginTop: 6, fontSize: 10, padding: '4px 8px' }} onClick={() => onChange(null)}>
          Remove
        </button>
      ) : null}
    </div>
  );
}

export default function Admin() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const dragInfo = useRef(null);

  useEffect(() => {
    (async () => {
      const authRes = await fetch('/api/check-auth');
      const authData = await authRes.json();
      if (!authData.authed) {
        router.replace('/admin/login');
        return;
      }
      const contentRes = await fetch('/api/content');
      const contentData = await contentRes.json();
      setContent(contentData);
      setChecking(false);
    })();
  }, [router]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  async function save() {
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
    showToast(res.ok ? 'Saved' : 'Save failed');
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function update(path, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      let target = next;
      for (let i = 0; i < path.length - 1; i++) target = target[path[i]];
      target[path[path.length - 1]] = value;
      return next;
    });
  }

  if (checking || !content) {
    return (
      <div className="admin-shell">
        <p className="mono">Checking session…</p>
      </div>
    );
  }

  const { hero, channels, projects, brand, lens, footer, sectionOrder } = content;
  const sectionLabels = {
    channels: 'Channels Operated',
    projects: 'Build Log',
    brand: '@thernmedia',
    lens: 'Behind the Lens',
  };

  return (
    <>
      <Head>
        <title>Admin · {hero.name}</title>
      </Head>
      <div className="admin-shell">
        <div className="admin-header">
          <h2 className="display">Edit your portfolio</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="btn secondary" href="/" target="_blank" rel="noopener noreferrer">
              View live page
            </a>
            <button className="btn" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button className="btn secondary" onClick={logout}>
              Log out
            </button>
          </div>
        </div>

        {/* SECTION ORDER */}
        <div className="admin-card">
          <h3>Section order (drag to rearrange the page)</h3>
          {sectionOrder.map((key, i) => (
            <div
              className="drag-item"
              key={key}
              draggable
              onDragStart={() => (dragInfo.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragInfo.current === null) return;
                update(['sectionOrder'], reorder(sectionOrder, dragInfo.current, i));
                dragInfo.current = null;
              }}
              style={{ marginBottom: 8 }}
            >
              <div className="drag-handle" style={{ marginBottom: 0 }}>
                <span>⠿ {String(i + 1).padStart(2, '0')} · {sectionLabels[key] || key}</span>
              </div>
            </div>
          ))}
        </div>

        {/* HERO */}
        <div className="admin-card">
          <h3>Hero</h3>
          <div className="field">
            <label>NAME</label>
            <input type="text" value={hero.name} onChange={(e) => update(['hero', 'name'], e.target.value)} />
          </div>
          <div className="field">
            <label>TAGLINE</label>
            <textarea value={hero.tagline} onChange={(e) => update(['hero', 'tagline'], e.target.value)} />
          </div>
          <div className="field">
            <label>STATUS</label>
            <input type="text" value={hero.status} onChange={(e) => update(['hero', 'status'], e.target.value)} />
          </div>
          {hero.meta.map((m, i) => (
            <div className="field" key={i}>
              <label>META LINE {i + 1}</label>
              <input
                type="text"
                value={m}
                onChange={(e) => {
                  const next = [...hero.meta];
                  next[i] = e.target.value;
                  update(['hero', 'meta'], next);
                }}
              />
            </div>
          ))}
        </div>

        {/* CHANNELS */}
        <div className="admin-card">
          <h3>Channels Operated</h3>
          <div className="field">
            <label>SECTION HEADING</label>
            <input type="text" value={channels.heading} onChange={(e) => update(['channels', 'heading'], e.target.value)} />
          </div>
          {channels.platforms.map((p, i) => (
            <div className="field" key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label>PLATFORM {i + 1}</label>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const next = [...channels.platforms];
                    next[i] = e.target.value;
                    update(['channels', 'platforms'], next);
                  }}
                />
              </div>
              <button
                type="button"
                className="btn danger"
                onClick={() => update(['channels', 'platforms'], channels.platforms.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn secondary" onClick={() => update(['channels', 'platforms'], [...channels.platforms, 'New Platform'])}>
            + Add platform
          </button>
          <div className="field" style={{ marginTop: 14 }}>
            <label>DESCRIPTION</label>
            <textarea value={channels.description} onChange={(e) => update(['channels', 'description'], e.target.value)} />
          </div>
        </div>

        {/* PROJECTS */}
        <div className="admin-card">
          <h3>Build Log (drag the handle to reorder)</h3>
          {projects.map((proj, i) => (
            <div
              className="drag-item"
              key={proj.id}
              draggable
              onDragStart={() => (dragInfo.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragInfo.current === null) return;
                update(['projects'], reorder(projects, dragInfo.current, i));
                dragInfo.current = null;
              }}
            >
              <div className="drag-handle">
                <span>⠿ DRAG TO REORDER · #{i + 1}</span>
                <button
                  type="button"
                  className="btn danger"
                  style={{ padding: '3px 8px', fontSize: 10 }}
                  onClick={() => update(['projects'], projects.filter((_, idx) => idx !== i))}
                >
                  Delete
                </button>
              </div>
              <div className="field">
                <label>NAME</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => {
                    const next = [...projects];
                    next[i] = { ...next[i], name: e.target.value };
                    update(['projects'], next);
                  }}
                />
              </div>
              <div className="field">
                <label>TAGLINE</label>
                <input
                  type="text"
                  value={proj.tagline}
                  onChange={(e) => {
                    const next = [...projects];
                    next[i] = { ...next[i], tagline: e.target.value };
                    update(['projects'], next);
                  }}
                />
              </div>
              <div className="field">
                <label>STATUS</label>
                <select
                  value={proj.status}
                  onChange={(e) => {
                    const next = [...projects];
                    next[i] = { ...next[i], status: e.target.value };
                    update(['projects'], next);
                  }}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid var(--line)' }}
                >
                  <option value="shipped">Shipped</option>
                  <option value="progress">In progress</option>
                </select>
              </div>
              <div className="field">
                <label>DESCRIPTION</label>
                <textarea
                  value={proj.body}
                  onChange={(e) => {
                    const next = [...projects];
                    next[i] = { ...next[i], body: e.target.value };
                    update(['projects'], next);
                  }}
                />
              </div>
              <div className="field">
                <label>STACK TAGS, COMMA SEPARATED</label>
                <input
                  type="text"
                  value={proj.stack.join(', ')}
                  onChange={(e) => {
                    const next = [...projects];
                    next[i] = { ...next[i], stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                    update(['projects'], next);
                  }}
                />
              </div>
              <div className="field" style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label>LINK URL</label>
                  <input
                    type="url"
                    value={proj.link}
                    placeholder="https://…"
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = { ...next[i], link: e.target.value };
                      update(['projects'], next);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>LINK LABEL</label>
                  <input
                    type="text"
                    value={proj.linkLabel}
                    onChange={(e) => {
                      const next = [...projects];
                      next[i] = { ...next[i], linkLabel: e.target.value };
                      update(['projects'], next);
                    }}
                  />
                </div>
              </div>
              <ImageUploader
                image={proj.image}
                label="UPLOAD SCREENSHOT"
                onChange={(url) => {
                  const next = [...projects];
                  next[i] = { ...next[i], image: url };
                  update(['projects'], next);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn secondary"
            onClick={() =>
              update(['projects'], [
                ...projects,
                {
                  id: `project-${Date.now()}`,
                  name: 'New Project',
                  tagline: '',
                  status: 'shipped',
                  body: '',
                  stack: [],
                  image: null,
                  link: '',
                  linkLabel: 'View this build',
                },
              ])
            }
          >
            + Add project
          </button>
        </div>

        {/* BRAND */}
        <div className="admin-card">
          <h3>@thernmedia</h3>
          <div className="field">
            <label>HEADING</label>
            <input type="text" value={brand.heading} onChange={(e) => update(['brand', 'heading'], e.target.value)} />
          </div>
          {brand.paragraphs.map((p, i) => (
            <div className="field" key={i}>
              <label>PARAGRAPH {i + 1}</label>
              <textarea
                value={p}
                onChange={(e) => {
                  const next = [...brand.paragraphs];
                  next[i] = e.target.value;
                  update(['brand', 'paragraphs'], next);
                }}
              />
            </div>
          ))}
          <h3 style={{ marginTop: 18 }}>Stats</h3>
          {brand.stats.map((s, i) => (
            <div className="field" key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ width: 100 }}>
                <label>NUMBER</label>
                <input
                  type="text"
                  value={s.num}
                  onChange={(e) => {
                    const next = [...brand.stats];
                    next[i] = { ...next[i], num: e.target.value };
                    update(['brand', 'stats'], next);
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>LABEL</label>
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => {
                    const next = [...brand.stats];
                    next[i] = { ...next[i], label: e.target.value };
                    update(['brand', 'stats'], next);
                  }}
                />
              </div>
              <button type="button" className="btn danger" onClick={() => update(['brand', 'stats'], brand.stats.filter((_, idx) => idx !== i))}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn secondary" onClick={() => update(['brand', 'stats'], [...brand.stats, { num: '0', label: 'New stat' }])}>
            + Add stat
          </button>
          <h3 style={{ marginTop: 18 }}>Carousel samples</h3>
          <div className="gallery">
            {brand.gallery.map((img, i) => (
              <ImageUploader
                key={i}
                image={img}
                label={`SLIDE ${i + 1}`}
                onChange={(url) => {
                  const next = [...brand.gallery];
                  next[i] = url;
                  update(['brand', 'gallery'], next);
                }}
              />
            ))}
          </div>
        </div>

        {/* LENS */}
        <div className="admin-card">
          <h3>Behind the Lens</h3>
          <div className="field">
            <label>HEADING</label>
            <input type="text" value={lens.heading} onChange={(e) => update(['lens', 'heading'], e.target.value)} />
          </div>
          <div className="field">
            <label>PARAGRAPH</label>
            <textarea value={lens.paragraph} onChange={(e) => update(['lens', 'paragraph'], e.target.value)} />
          </div>
          <h3 style={{ marginTop: 18 }}>Photo samples</h3>
          <div className="gallery">
            {lens.gallery.map((img, i) => (
              <ImageUploader
                key={i}
                image={img}
                label={`PHOTO ${i + 1}`}
                onChange={(url) => {
                  const next = [...lens.gallery];
                  next[i] = url;
                  update(['lens', 'gallery'], next);
                }}
              />
            ))}
          </div>
          <h3 style={{ marginTop: 18 }}>Gear (with affiliate links)</h3>
          {lens.gear.map((g, i) => (
            <div className="field" key={g.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label>ITEM NAME</label>
                <input
                  type="text"
                  value={g.name}
                  onChange={(e) => {
                    const next = [...lens.gear];
                    next[i] = { ...next[i], name: e.target.value };
                    update(['lens', 'gear'], next);
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>AFFILIATE LINK</label>
                <input
                  type="url"
                  value={g.link}
                  placeholder="https://…"
                  onChange={(e) => {
                    const next = [...lens.gear];
                    next[i] = { ...next[i], link: e.target.value };
                    update(['lens', 'gear'], next);
                  }}
                />
              </div>
              <button type="button" className="btn danger" onClick={() => update(['lens', 'gear'], lens.gear.filter((_, idx) => idx !== i))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn secondary"
            onClick={() => update(['lens', 'gear'], [...lens.gear, { id: `gear-${Date.now()}`, name: 'New item', link: '' }])}
          >
            + Add gear item
          </button>
        </div>

        {/* FOOTER */}
        <div className="admin-card">
          <h3>Contact</h3>
          <div className="field">
            <label>EMAIL</label>
            <input type="text" value={footer.email} onChange={(e) => update(['footer', 'email'], e.target.value)} />
          </div>
          <div className="field">
            <label>LINKEDIN URL</label>
            <input type="url" value={footer.linkedin} placeholder="https://linkedin.com/in/…" onChange={(e) => update(['footer', 'linkedin'], e.target.value)} />
          </div>
          <div className="field">
            <label>SOCIAL HANDLE</label>
            <input type="text" value={footer.social} onChange={(e) => update(['footer', 'social'], e.target.value)} />
          </div>
        </div>

        <button className="btn" onClick={save} disabled={saving} style={{ marginBottom: 60 }}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
