import { useState, useCallback, useEffect } from 'react'; // trocou useEffect de lugar

let _addToast;

// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success: (msg) => _addToast?.({ msg, type: 'success' }),
  error: (msg) => _addToast?.({ msg, type: 'error' }),
  info: (msg) => _addToast?.({ msg, type: 'info' }),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ msg, type }) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    _addToast = addToast; // atribuição dentro do useEffect
  }, [addToast]);


  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 20px', borderRadius: 10, fontFamily: 'var(--font-body)',
          fontSize: 14, fontWeight: 500, maxWidth: 340,
          background: t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#0ea5e9',
          color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          animation: 'slideIn 0.3s ease',
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
