import { Mountain, MapPin, ShieldCheck, Star, Wifi } from 'lucide-react';

const perks = [
  { icon: MapPin,      text: 'Thamel, Boudhha & Patan — all in one place' },
  { icon: ShieldCheck, text: 'Every listing verified by our team'          },
  { icon: Star,        text: 'Honest reviews from real travelers'           },
  { icon: Wifi,        text: 'Free Wi-Fi & 24/7 check-in support'          },
];

const LoginLeftPanel = () => {
  return (
    <div className="login-left">

      {/* ── Brand ── */}
      <div className="login-brand">
        <div className="login-brand-icon">
          <Mountain />
        </div>
        <span className="login-brand-name">
          Hamro<span>Hostel</span>
        </span>
      </div>

      {/* ── Hero ── */}
      <div className="login-hero">

        <div className="login-hero-eyebrow">
          🇳🇵&nbsp;&nbsp;KATHMANDU'S HOSTEL PLATFORM
        </div>

        <h1 className="login-hero-title">
          Welcome<br />
          <span className="login-hero-title-accent">back, explorer</span>
        </h1>

        <p className="login-hero-subtitle">
          Your Kathmandu stay is one login away — trusted hostels
          in Thamel, Boudhha and beyond, ready to book instantly.
        </p>

        {/* Perks */}
        <div className="login-perks">
          {perks.map(({ icon: Icon, text }) => (
            <div key={text} className="login-perk-item">
              <div className="login-perk-icon">
                <Icon size={14} />
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating review ── */}
      <div className="login-floating-review">
        <div className="login-floating-review-stars">★★★★★</div>
        <p className="login-floating-review-text">
          "Booked within 2 minutes, checked in same evening. Best hostel experience in Thamel."
        </p>
        <p className="login-floating-review-author">— Priya M., Mumbai</p>
      </div>

    </div>
  );
};

export default LoginLeftPanel;