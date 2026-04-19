import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScan }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Clear any previous instances before rendering
    let scanner = null;
    try {
      scanner = new Html5QrcodeScanner(
        "barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 150 }, disableFlip: false },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          // Success callback
          scanner.clear();
          onScan(decodedText);
        },
        (err) => {
          // We can ignore frame errors as it just means no barcode in frame
        }
      );
    } catch (e) {
      setError('Could not initialize camera. Please check permissions.');
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Failed to clear html5QrcodeScanner. ", e));
      }
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" style={{ zIndex: 9999 }}>
      <div className="receipt" style={{ padding: '20px', maxWidth: '400px', width: '90%', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <X size={24} />
        </button>
        <h3 style={{ marginBottom: '15px', textAlign: 'center', marginTop: '10px' }}>📷 Scan Barcode</h3>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
          Point your camera at a product barcode to scan it.
        </p>
        <div id="barcode-reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
        {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center', fontSize: '0.85rem' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
