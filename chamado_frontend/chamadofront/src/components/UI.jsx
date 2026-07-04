/* UI.jsx — componentes base com estilo atualizado (layout/CSS apenas) */

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, loading, type = 'button', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-body)', fontWeight: 600,
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.55 : 1,
    letterSpacing: '-0.01em',
    ...style,
  };
  const sizes = {
    sm: { padding: '6px 14px',  fontSize: 13, borderRadius: 8 },
    md: { padding: '10px 20px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '13px 28px', fontSize: 15, borderRadius: 12 },
  };
  const variants = {
    primary:   { background: 'var(--accent)',    color: '#fff', boxShadow: '0 2px 8px rgba(220,38,38,0.25)' },
    secondary: { background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
    danger:    { background: '#dc2626',          color: '#fff', boxShadow: '0 2px 8px rgba(220,38,38,0.25)' },
    ghost:     { background: 'transparent',      color: 'var(--accent)', border: '1px solid var(--accent-border)' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.filter = 'brightness(0.92)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
    >
      {loading
        ? <span style={{ width: 15, height: 15, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
        : children
      }
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          {label}
        </label>
      )}
      <input
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: `1px solid ${error ? '#dc2626' : 'var(--border)'}`,
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.10)'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#dc2626' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 2 }}>{error}</span>}
    </div>
  );
}

export function Select({ label, options, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          {label}
        </label>
      )}
      <select
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: `1px solid ${error ? '#dc2626' : 'var(--border)'}`,
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
        }}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 2 }}>{error}</span>}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: 24,
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }}>
      {children}
    </div>
  );
}

const statusColors = {
  ABERTO:          { bg: '#fef3c7', color: '#92400e' },
  EM_ATENDIMENTO:  { bg: '#dbeafe', color: '#1e40af' },
  CONCLUIDO:       { bg: '#dcfce7', color: '#166534' },
  CANCELADO:       { bg: '#fee2e2', color: '#991b1b' },
  DISPONIVEL:      { bg: '#dcfce7', color: '#166534' },
  EM_DESLOCAMENTO: { bg: '#dbeafe', color: '#1e40af' },
  MANUTENCAO:      { bg: '#fee2e2', color: '#991b1b' },
  BAIXA:           { bg: '#dcfce7', color: '#166534' },
  MEDIA:           { bg: '#fef3c7', color: '#92400e' },
  ALTA:            { bg: '#ffedd5', color: '#9a3412' },
  CRITICA:         { bg: '#fee2e2', color: '#991b1b' },
};

export function Badge({ label }) {
  const colors = statusColors[label] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: colors.bg,
      color: colors.color,
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap',
    }}>
      {label?.replace(/_/g, ' ')}
    </span>
  );
}

export function FormGrid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{children}</div>;
}

export function FormFull({ children }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>;
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '18px 0' }} />;
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: 24,
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>{title}</h1>
        {subtitle && (
          <p style={{ margin: '5px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '56px 24px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.7 }}>{icon}</div>
      <h3 style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        color: 'var(--text-primary)',
        fontSize: 17,
      }}>{title}</h3>
      {subtitle && (
        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>
      )}
    </div>
  );
}
