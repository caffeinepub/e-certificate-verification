import { useCallback, useState } from "react";

export interface UseQrCodeReturn {
  qrCodeDataUrl: string | null;
  generateQrCode: (text: string) => void;
}

export function useQrCode(): UseQrCodeReturn {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const generateQrCode = useCallback((text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&format=png&margin=10`;
    setQrCodeDataUrl(url);
  }, []);

  return { qrCodeDataUrl, generateQrCode };
}
