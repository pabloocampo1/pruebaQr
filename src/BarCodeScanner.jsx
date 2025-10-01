import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


const BarcodeScanner = ({ open, onDetected, onClose, preferBackCamera = true }) => {
  const [error, setError] = useState(null);
  const html5QrcodeRef = useRef(null);
  const scannerId = useRef(`html5qr-scanner-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!open) return;

    let isStopped = false;
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
    };

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          setError("No camera found on this device.");
          return;
        }

        const pick = cameras.find((c) =>
          preferBackCamera
            ? /back|rear|environment/i.test(c.label)
            : /front|user/i.test(c.label)
        );
        const cameraId = (pick && pick.id) || cameras[0].id;

        // IMPORTANTE: aseguramos que el div existe antes de crear
        if (!document.getElementById(scannerId.current)) return;

        html5QrcodeRef.current = new Html5Qrcode(scannerId.current);

        await html5QrcodeRef.current.start(
          cameraId,
          config,
          (decodedText) => {
            if (isStopped) return;

            stopScanner().then(() => {
              onDetected?.(decodedText);
              onClose?.();
            });
          },
          (errorMessage) => {
            // los errores de frame son normales
            // console.debug("scan error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Start scanner error:", err);
        setError(err?.message || String(err));
      }
    };

    const stopScanner = async () => {
      isStopped = true;
      if (html5QrcodeRef.current) {
        try {
          await html5QrcodeRef.current.stop();
        } catch {}
        try {
          await html5QrcodeRef.current.clear();
        } catch {}
        html5QrcodeRef.current = null;
      }
    };

    // arranca después que el modal abre y monta el div
    setTimeout(startScanner, 300);

    return () => {
      stopScanner();
    };
  }, [open, preferBackCamera, onDetected, onClose]);

  const handleManualClose = () => {
    if (html5QrcodeRef.current) {
      html5QrcodeRef.current
        .stop()
        .catch(() => {})
        .then(() => html5QrcodeRef.current?.clear().catch(() => {}));
      html5QrcodeRef.current = null;
    }
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleManualClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Scan barcode / QR
        <IconButton
          aria-label="close"
          onClick={handleManualClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <div id={scannerId.current} style={{ width: "100%", minHeight: 320 }} />
        )}
        <Typography variant="caption" color="textSecondary">
          Allow camera access and point to the barcode/QR
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleManualClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;
