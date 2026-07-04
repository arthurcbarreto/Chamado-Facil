export default function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15, 23, 42, 0.50)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: width,
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        animation: 'fadeUp 0.22s ease both',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
        }}>
          <h3 style={{
            margin: 0, fontSize: 16,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 16,
              lineHeight: 1, padding: '4px 8px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >✕</button>
        </div>
        {/* Body */}
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}
