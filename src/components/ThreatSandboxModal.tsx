import React from 'react';
import { UrlTrustScannerModal } from './UrlTrustScannerModal';

interface ThreatSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatSandboxModal: React.FC<ThreatSandboxModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <UrlTrustScannerModal
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
