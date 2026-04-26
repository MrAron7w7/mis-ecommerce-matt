interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Overlay({ isOpen, onClose }: OverlayProps) {
  return (
    <div
      onClick={onClose}
      aria-hidden="true"
      className={`
        fixed inset-0 bg-black z-40
        transition-opacity duration-300 ease-in-out
        ${isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    />
  );
}
