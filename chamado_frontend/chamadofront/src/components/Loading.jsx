export default function Loading({ size = 36 }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '48px 24px', gap: 14,
    }}>
      <div style={{
        width: size, height: size,
        borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
        Carregando…
      </span>
    </div>
  );
}
