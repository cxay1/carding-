export default function SecurityBadges() {
  const badges = [
    { label: "PCI DSS Compliant", icon: "🔒" },
    { label: "AES-256 Encryption", icon: "🛡️" },
    { label: "24/7 Support", icon: "🎧" },
  ];

  return (
    <div className="flex justify-center gap-8 mt-6">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2 text-slate-400">
          <span>{badge.icon}</span>
          <span className="text-sm">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}