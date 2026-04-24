export default function GarmentPlaceholder({
  category,
  bgColor,
}: {
  category: string;
  bgColor: string;
}) {
  const isPants = category === 'Pants & Leggings';
  const isSkirt = category === 'Skirts';
  const isLounge = category === 'Lounge';

  return (
    <div className={`w-full h-full flex items-center justify-center ${bgColor}`}>
      {isPants ? (
        <svg viewBox="0 0 120 160" className="w-24 h-32 opacity-80" fill="currentColor">
          <path
            d="M30 10 L90 10 L95 80 L75 160 L60 160 L60 80 L60 80 L60 160 L45 160 L25 80 Z"
            className="text-gray-700"
          />
        </svg>
      ) : isSkirt ? (
        <svg viewBox="0 0 120 120" className="w-24 h-28 opacity-80" fill="currentColor">
          <rect x="30" y="10" width="60" height="12" rx="2" className="text-gray-700" />
          <path d="M25 22 L95 22 L110 120 L10 120 Z" className="text-gray-700" />
        </svg>
      ) : isLounge ? (
        <svg viewBox="0 0 140 160" className="w-24 h-32 opacity-80" fill="currentColor">
          <path
            d="M50 10 Q70 5 90 10 L110 50 L90 55 L90 150 L50 150 L50 55 L30 50 Z"
            className="text-[#8B5E3C]"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 160 180" className="w-28 h-36 opacity-80" fill="currentColor">
          <path
            d="M55 10 Q80 5 105 10 L130 55 L105 65 L105 170 L55 170 L55 65 L30 55 Z"
            className="text-[#BEB0A0]"
          />
        </svg>
      )}
    </div>
  );
}
