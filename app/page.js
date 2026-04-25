"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const leafSVGs = [
  `<svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5 C5 15 2 35 20 55 C38 35 35 15 20 5Z" fill="#1f6fb2"/>
    <line x1="20" y1="5" x2="20" y2="55" stroke="#0f2f5f" stroke-width="1"/>
  </svg>`,
  `<svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="20" rx="28" ry="15" fill="#4ea8de" transform="rotate(-20 30 20)"/>
    <line x1="5" y1="30" x2="55" y2="10" stroke="#0f2f5f" stroke-width="1"/>
  </svg>`,
  `<svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 5 C8 20 5 50 25 65 C45 50 42 20 25 5Z" fill="#1b5f9a"/>
    <path d="M25 10 C18 20 16 40 25 60" stroke="#0f2f5f" stroke-width="1" fill="none"/>
    <path d="M25 20 C30 15 38 18 40 25" stroke="#0f2f5f" stroke-width="0.7" fill="none"/>
    <path d="M25 35 C20 30 12 32 10 39" stroke="#0f2f5f" stroke-width="0.7" fill="none"/>
  </svg>`,
];

function makeCropSVG(type, h) {
  if (type === "wheat") {
    return `<svg width="20" height="${h}" viewBox="0 0 20 ${h}" fill="none">
      <line x1="10" y1="${h}" x2="10" y2="0" stroke="#4ea8de" stroke-width="2"/>
      <ellipse cx="10" cy="8" rx="6" ry="10" fill="#8ecae6"/>
      <ellipse cx="4" cy="22" rx="4" ry="6" fill="#5ea7dc" transform="rotate(-20 4 22)"/>
      <ellipse cx="16" cy="22" rx="4" ry="6" fill="#5ea7dc" transform="rotate(20 16 22)"/>
    </svg>`;
  }
  return `<svg width="24" height="${h}" viewBox="0 0 24 ${h}" fill="none">
    <line x1="12" y1="${h}" x2="12" y2="${h * 0.4}" stroke="#1b5f9a" stroke-width="2"/>
    <ellipse cx="12" cy="${h * 0.3}" rx="10" ry="8" fill="#1f6fb2" opacity="0.8"/>
    <ellipse cx="4" cy="${h * 0.5}" rx="7" ry="5" fill="#1b5f9a" transform="rotate(-30 4 ${h * 0.5})"/>
    <ellipse cx="20" cy="${h * 0.5}" rx="7" ry="5" fill="#1b5f9a" transform="rotate(30 20 ${h * 0.5})"/>
  </svg>`;
}

const STAT_ITEMS = [
  { label: "Years of Excellence", end: 25, suffix: "+" },
  { label: "Product Range", end: 200, suffix: "+" },
  { label: "Farmers Served", end: 50, suffix: "K+" },
  { label: "States Covered", end: 18, suffix: "+" },
];

export default function HomePage() {
  const leafBgRef = useRef(null);
  const heroParticlesRef = useRef(null);
  const cropRowRef = useRef(null);
  const wheatFieldRef = useRef(null);
  const statsBarRef = useRef(null);
  const whatsappQuoteLink = `https://wa.me/919408894456?text=${encodeURIComponent(
    "Hello ADICON team, I would like to get a quote for your products.",
  )}`;
  const statsAnimatedRef = useRef(false);
  const [statValues, setStatValues] = useState(STAT_ITEMS.map(() => 0));

  useEffect(() => {
    const leafBg = leafBgRef.current;
    const particleContainer = heroParticlesRef.current;
    const cropRow = cropRowRef.current;
    const wheatField = wheatFieldRef.current;

    if (!leafBg || !particleContainer || !cropRow || !wheatField) return;

    for (let i = 0; i < 20; i += 1) {
      const div = document.createElement("div");
      div.className = "leaf-float";
      const size = 30 + Math.random() * 60;
      div.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${8 + Math.random() * 15}s;
        animation-delay: ${Math.random() * -20}s;
      `;
      div.innerHTML = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
      leafBg.appendChild(div);
    }

    particleContainer.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;";
    for (let i = 0; i < 15; i += 1) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 4 + Math.random() * 10;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 60}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${4 + Math.random() * 6}s;
        animation-delay: ${Math.random() * -8}s;
        background: rgba(78,168,222,${0.2 + Math.random() * 0.3});
      `;
      particleContainer.appendChild(p);
    }

    const types = [
      "wheat",
      "plant",
      "wheat",
      "plant",
      "wheat",
      "plant",
      "wheat",
      "plant",
      "wheat",
      "plant",
      "wheat",
      "plant",
    ];
    types.forEach((t, i) => {
      const div = document.createElement("div");
      div.className = "crop-plant";
      const h = 60 + Math.random() * 50;
      div.innerHTML = makeCropSVG(t, h);
      div.style.animationDelay = `${i * 0.15}s`;
      cropRow.appendChild(div);
    });

    for (let i = 0; i < 50; i += 1) {
      const stalk = document.createElement("div");
      stalk.className = "wheat-stalk";
      const h = 80 + Math.random() * 100;
      const delay = (Math.random() * 3).toFixed(2);
      const dur = (2 + Math.random() * 2).toFixed(2);
      stalk.style.cssText = `animation-duration:${dur}s;animation-delay:-${delay}s;`;
      stalk.innerHTML = `<svg width="14" height="${h}" viewBox="0 0 14 ${h}" fill="none">
        <line x1="7" y1="${h}" x2="7" y2="${h * 0.25}" stroke="#b7dcff" stroke-width="1.5"/>
        <ellipse cx="7" cy="${h * 0.15}" rx="4" ry="8" fill="#8ecae6"/>
        <ellipse cx="3" cy="${h * 0.3}" rx="3" ry="5" fill="#5ea7dc" transform="rotate(-15 3 ${h * 0.3})"/>
        <ellipse cx="11" cy="${h * 0.3}" rx="3" ry="5" fill="#5ea7dc" transform="rotate(15 11 ${h * 0.3})"/>
        <ellipse cx="3" cy="${h * 0.5}" rx="2.5" ry="4" fill="#4ea8de" transform="rotate(-10 3 ${h * 0.5})"/>
        <ellipse cx="11" cy="${h * 0.5}" rx="2.5" ry="4" fill="#4ea8de" transform="rotate(10 11 ${h * 0.5})"/>
      </svg>`;
      wheatField.appendChild(stalk);
    }

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      leafBg.innerHTML = "";
      particleContainer.innerHTML = "";
      cropRow.innerHTML = "";
      wheatField.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const statsBar = statsBarRef.current;
    if (!statsBar) return;

    let frameId;
    const duration = 2000;
    const startAnimation = () => {
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        setStatValues(
          STAT_ITEMS.map((item) => Math.round(item.end * progress)),
        );

        if (progress < 1) frameId = requestAnimationFrame(step);
      };

      frameId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimatedRef.current) {
            statsAnimatedRef.current = true;
            startAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(statsBar);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div className="leaf-bg" id="leafBg" ref={leafBgRef} />

      <nav>
        <Link href="/" className="logo-link nav-logo-link">
          <Image
            src="/logofinal.png"
            alt="Adicon Logo"
            width={280}
            height={90}
            className="logo-img nav-logo-img"
            priority
          />
        </Link>
        <ul className="nav-links">
          <li>
            <a href="#products">Products</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#why">Why Us</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <a
          href={whatsappQuoteLink}
          className="nav-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get a Quote
        </a>
      </nav>

      <section className="hero">
        <div id="heroParticles" ref={heroParticlesRef} />
        <div className="hero-content">
          <div className="hero-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" fill="#f4a500" opacity="0.4" />
              <circle cx="6" cy="6" r="3" fill="#f4a500" />
            </svg>
            Manufacturer &amp; Wholesaler Since 2001
          </div>
          <h1>
            Growing a <span>Greener</span> Future for Every Farmer
          </h1>
          <p>
            ADICON delivers science-backed pesticides, herbicides, fungicides,
            micro-nutrients, bio-pesticides &amp; plant growth regulators —
            empowering farmers to maximise every harvest.
          </p>
          <div className="hero-btns">
            <Link href="/products" className="btn-primary">
              Explore Products
            </Link>
            <a href="#contact" className="btn-outline">
              Contact Us
            </a>
          </div>
        </div>
        <div className="crop-row" id="cropRow" ref={cropRowRef} />
      </section>

      <div className="stats-bar" ref={statsBarRef}>
        {STAT_ITEMS.map((item, index) => (
          <Fragment key={item.label}>
            <div className="stat-item">
              <div className="stat-number">{`${statValues[index]}${item.suffix}`}</div>
              <div className="stat-label">{item.label}</div>
            </div>
            {index < STAT_ITEMS.length - 1 ? (
              <div className="stat-divider" />
            ) : null}
          </Fragment>
        ))}
      </div>

      <section className="section" id="products">
        <div className="section-header reveal">
          <div className="section-tag">Our Portfolio</div>
          <h2 className="section-title">
            Complete <span>Agri-Input</span> Solutions
          </h2>
          <p className="section-subtitle">
            From soil to shelf — every product crafted with precision for
            maximum crop yield and safety.
          </p>
        </div>

        <div className="products-grid">
          <div className="product-card reveal">
            <div className="product-icon" style={{ background: "#e8f4ff" }}>
              🌿
            </div>
            <h3>Pesticides</h3>
            <p>
              Advanced formulations to protect crops from a wide spectrum of
              insects and pests, ensuring healthy plant development.
            </p>
            <Link className="learn-more" href="/products">
              Discover Range →
            </Link>
          </div>
          <div
            className="product-card reveal"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="product-icon" style={{ background: "#fff8e1" }}>
              🌾
            </div>
            <h3>Herbicides</h3>
            <p>
              Selective and non-selective weed control solutions that safeguard
              crops while eliminating unwanted competition.
            </p>
            <Link className="learn-more" href="/products">
              Discover Range →
            </Link>
          </div>
          <div
            className="product-card reveal"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="product-icon" style={{ background: "#e3f2fd" }}>
              🍄
            </div>
            <h3>Fungicides</h3>
            <p>
              Protective and curative fungicide blends to combat plant diseases
              at the source and prevent yield loss.
            </p>
            <Link className="learn-more" href="/products">
              Discover Range →
            </Link>
          </div>

          <div
            className="product-card reveal"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="product-icon" style={{ background: "#e0f7fa" }}>
              🌻
            </div>
            <h3>Plant Growth Regulators</h3>
            <p>
              Hormone-based solutions to accelerate root development, improve
              flowering, and enhance overall plant vigour.
            </p>
            <Link className="learn-more" href="/products">
              Discover Range →
            </Link>
          </div>
        </div>
        <div className="section-actions reveal">
          <Link href="/products" className="btn-primary">
            Show Products
          </Link>
        </div>
      </section>

      <div className="wheat-section" id="about">
        <div className="section-header reveal">
          <div className="section-tag">Our Roots</div>
          <h2 className="section-title">
            Rooted in <span>Agriculture,</span> Growing with India
          </h2>
          <p className="section-subtitle">
            Over two decades of trusted partnership with farmers across the
            nation — because every field deserves the best care.
          </p>
        </div>

        <div className="wheat-field" id="wheatField" ref={wheatFieldRef} />
      </div>

      <section className="section" id="why" style={{ background: "#fff" }}>
        <div className="section-header reveal">
          <div className="section-tag">Why Choose Us</div>
          <h2 className="section-title">
            The <span>ADICON</span> Advantage
          </h2>
        </div>

        <div className="features-grid">
          <div className="feature-item reveal">
            <span className="feature-icon">🔬</span>
            <h4>R&amp;D Backed Formulas</h4>
            <p>
              Every product goes through rigorous field testing and laboratory
              validation before reaching your crop.
            </p>
          </div>
          <div
            className="feature-item reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="feature-icon">🏭</span>
            <h4>Direct Manufacturer</h4>
            <p>
              We produce what we sell — ensuring quality control at every stage
              and competitive wholesale pricing.
            </p>
          </div>
          <div
            className="feature-item reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="feature-icon">🌍</span>
            <h4>Pan-India Distribution</h4>
            <p>
              A wide distribution network ensures timely availability across 18+
              states, right at the farm gate.
            </p>
          </div>
          <div
            className="feature-item reveal"
            style={{ transitionDelay: "0.3s" }}
          >
            <span className="feature-icon">♻️</span>
            <h4>Eco-Conscious Products</h4>
            <p>
              Our bio-pesticide range minimises chemical load on soil and water,
              supporting sustainable farming.
            </p>
          </div>
          <div
            className="feature-item reveal"
            style={{ transitionDelay: "0.4s" }}
          >
            <span className="feature-icon">🤝</span>
            <h4>Expert Agronomist Support</h4>
            <p>
              Our on-ground agronomy team offers personalised guidance to help
              farmers achieve maximum yield.
            </p>
          </div>
          <div
            className="feature-item reveal"
            style={{ transitionDelay: "0.5s" }}
          >
            <span className="feature-icon">📜</span>
            <h4>Certified &amp; Compliant</h4>
            <p>
              All products comply with CIB&amp;RC regulations and carry proper
              registration certification.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-banner" id="contact">
        <svg
          className="cta-leaf"
          style={{
            left: "-50px",
            top: "-50px",
            width: "300px",
            height: "300px",
          }}
          viewBox="0 0 200 200"
        >
          <ellipse
            cx="100"
            cy="100"
            rx="80"
            ry="40"
            transform="rotate(-30 100 100)"
            fill="#4ea8de"
          />
        </svg>
        <svg
          className="cta-leaf"
          style={{
            right: "-30px",
            bottom: "-30px",
            width: "250px",
            height: "250px",
          }}
          viewBox="0 0 200 200"
        >
          <ellipse
            cx="100"
            cy="100"
            rx="70"
            ry="35"
            transform="rotate(45 100 100)"
            fill="#4ea8de"
          />
        </svg>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            className="section-tag"
            style={{ background: "rgba(244,165,0,0.2)", color: "#ffd54f" }}
          >
            Partner With Us
          </div>
          <h2 style={{ marginTop: "0.8rem" }}>
            Ready to <span>Cultivate</span> Success?
          </h2>
          <p>
            Join thousands of distributors and farmers who trust ADICON for
            quality agri-inputs delivered on time.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              className="btn-primary"
              href={whatsappQuoteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a Quote
            </a>
          </div>
          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              📞 +91 94088 94456
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              ✉️ Adiconpesticidespvtltd@gmail.com
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              📍 Regd. Office: Shed No. 17/a, Kalpataru Mill Compound, Village:
              Karoli, Ta. Kalol, Dist. Gandhinagar - 382721
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="logo" style={{ fontSize: "1.3rem" }}>
          ADICON
        </div>
        <p>
          © 2025 ADICON Agri Solutions. Manufacturer &amp; Wholesaler of Premium
          Agri-Inputs.
        </p>
        <p style={{ fontSize: "0.78rem" }}>
          Pesticides · Herbicides · Fungicides · Fertilisers · Bio-Pesticides ·
          PGR
        </p>
        <p style={{ fontSize: "0.82rem" }}>
          📞{" "}
          <a
            href="tel:9408894456"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            9408894456
          </a>
        </p>
      </footer>
    </>
  );
}
