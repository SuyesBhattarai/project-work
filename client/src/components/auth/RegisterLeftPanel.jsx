import { Mountain, MapPin, Star, ShieldCheck, Wifi } from 'lucide-react';

const perks = [
  { icon: MapPin,      text: 'All over the capital city of nepal"Kathmandu"' },
  { icon: ShieldCheck, text: 'Every listing verified by our team'          },
  { icon: Star,        text: 'Honest reviews from real travelers'           },
  { icon: Wifi,        text: 'Free Wi-Fi & 24/7 check-in support'          },
];

const RegisterLeftPanel = () => (
  <div className="register-left">

    {/* ── Brand ── */}
    <div className="register-brand">
      <div className="register-brand-icon">
        <Mountain />
      </div>
      <span className="register-brand-name">
        Hamro<span>Hostel</span>
      </span>
    </div>

    {/* ── Hero ── */}
    <div className="register-hero">

      <div className="register-hero-eyebrow">
        🇳🇵&nbsp;&nbsp;KATHMANDU'S HOSTEL PLATFORM
      </div>

      <h1 className="register-hero-title">
        Your home<br />
        in&nbsp;<span className="register-hero-accent">Kathmandu</span>
      </h1>

      <p className="register-hero-sub">
        Budget stays in the heart of the city — from Thamel nightlife to
        peaceful Boudhha, we connect travelers with trusted, affordable hostels.
      </p>

      {/* Perks */}
      <ul className="register-perks">
        {perks.map(({ icon: Icon, text }) => (
          <li key={text} className="register-perk">
            <span className="register-perk-icon"><Icon size={14} /></span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* ── Floating review card ── */}
    <div className="register-review-card">
      <div className="register-review-stars">★★★★★</div>
      <p className="register-review-text">
        "Booked within 2 minutes, checked in same evening. Best hostel experience in Thamel."
      </p>
      <span className="register-review-author">— Priya M., Mumbai</span>
    </div>

  </div>
);

export default RegisterLeftPanel;