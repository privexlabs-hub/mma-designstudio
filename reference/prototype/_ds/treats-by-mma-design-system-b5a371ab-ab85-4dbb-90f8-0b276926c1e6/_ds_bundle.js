/* @ds-bundle: {"format":4,"namespace":"TreatsByMMADesignSystem_b5a371","components":[{"name":"IcingEdge","sourcePath":"components/brand/IcingEdge.jsx"},{"name":"PhotoFrame","sourcePath":"components/brand/PhotoFrame.jsx"},{"name":"RibbonRule","sourcePath":"components/brand/RibbonRule.jsx"},{"name":"SectionHeading","sourcePath":"components/brand/SectionHeading.jsx"},{"name":"CategoryCard","sourcePath":"components/commerce/CategoryCard.jsx"},{"name":"Price","sourcePath":"components/commerce/Price.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"QuantityStepper","sourcePath":"components/commerce/QuantityStepper.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"AnnouncementBanner","sourcePath":"components/feedback/AnnouncementBanner.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"OptionCard","sourcePath":"components/forms/OptionCard.jsx"},{"name":"SelectField","sourcePath":"components/forms/SelectField.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"CategoryTabs","sourcePath":"components/navigation/CategoryTabs.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/brand/IcingEdge.jsx":"77de50aabd4b","components/brand/PhotoFrame.jsx":"081849a4a14c","components/brand/RibbonRule.jsx":"5a8a42b59f75","components/brand/SectionHeading.jsx":"37eea49a8eca","components/commerce/CategoryCard.jsx":"9f0a3b59349b","components/commerce/Price.jsx":"a1c179d32949","components/commerce/ProductCard.jsx":"fb316e32d938","components/commerce/QuantityStepper.jsx":"894c9b6f1791","components/core/Badge.jsx":"3f3d49daa3ae","components/core/Button.jsx":"df6301310bdc","components/core/Icon.jsx":"09437aea7f21","components/core/IconButton.jsx":"0b74e7c9392c","components/feedback/Alert.jsx":"1d0c21758f3a","components/feedback/AnnouncementBanner.jsx":"324f50471dda","components/feedback/EmptyState.jsx":"75148c02fd9e","components/forms/Checkbox.jsx":"5fc3ea4bad82","components/forms/OptionCard.jsx":"1545133a27ad","components/forms/SelectField.jsx":"62bd63729507","components/forms/TextField.jsx":"fcac75571d6a","components/navigation/CategoryTabs.jsx":"4d0611ac566b","components/navigation/NavBar.jsx":"bc8a2eed8192","ui_kits/storefront/CakeOrder.jsx":"c85b0a640c02","ui_kits/storefront/Cart.jsx":"f9dceb8f98b9","ui_kits/storefront/Home.jsx":"485d5006b5c6","ui_kits/storefront/Menu.jsx":"da149c5d98ca","ui_kits/storefront/data.jsx":"d4c430a65148"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TreatsByMMADesignSystem_b5a371 = window.TreatsByMMADesignSystem_b5a371 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/IcingEdge.jsx
try { (() => {
function IcingEdge({
  color = 'var(--icing-500)',
  background = 'transparent',
  height = 28,
  flip,
  style
}) {
  const drips = [0.55, 0.9, 0.4, 0.75, 1, 0.5, 0.85, 0.45, 0.7, 0.95, 0.5, 0.8];
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      height,
      background,
      overflow: 'hidden',
      transform: flip ? 'scaleY(-1)' : undefined,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: Math.round(height * 0.35),
      background: color
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0 2%'
    }
  }, drips.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: Math.max(8, height * 0.42),
      height: Math.round(height * d),
      background: color,
      borderRadius: '0 0 999px 999px'
    }
  }))));
}
Object.assign(__ds_scope, { IcingEdge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/IcingEdge.jsx", error: String((e && e.message) || e) }); }

// components/brand/RibbonRule.jsx
try { (() => {
function RibbonRule({
  label,
  tone = 'pink',
  align = 'center',
  style
}) {
  const c = {
    pink: 'var(--icing-500)',
    gold: 'var(--gold-500)',
    cocoa: 'var(--cocoa-800)',
    cream: 'var(--cream-50)'
  }[tone];
  const line = {
    flex: 1,
    height: 3,
    borderRadius: 3,
    background: c,
    maxWidth: align === 'center' ? undefined : 40
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "separator",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: c,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, align !== 'start' && /*#__PURE__*/React.createElement("span", {
    style: line
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: tone === 'pink' ? 'var(--icing-700)' : c
    }
  }, label) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1,
      fontVariantEmoji: 'text'
    }
  }, "\u2665\uFE0E"), align !== 'end' && /*#__PURE__*/React.createElement("span", {
    style: line
  }));
}
Object.assign(__ds_scope, { RibbonRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/RibbonRule.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  inverse,
  size = 'lg',
  style
}) {
  const c = align === 'center';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: c ? 'center' : 'flex-start',
      textAlign: c ? 'center' : 'left',
      gap: 14,
      maxWidth: c ? 720 : undefined,
      margin: c ? '0 auto' : undefined,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.RibbonRule, {
    label: eyebrow,
    tone: inverse ? 'gold' : 'pink',
    align: c ? 'center' : 'start',
    style: {
      width: c ? 'min(100%, 420px)' : 'auto'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: size === 'lg' ? 'var(--text-h2)' : 'var(--text-h3)',
      lineHeight: 1.1,
      margin: 0,
      color: inverse ? 'var(--cream-50)' : 'var(--text-primary)',
      textWrap: 'balance'
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      lineHeight: 1.55,
      color: inverse ? 'var(--cocoa-300)' : 'var(--text-secondary)',
      maxWidth: 580,
      textWrap: 'pretty'
    }
  }, body));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/commerce/Price.jsx
try { (() => {
const fmt = n => Number(n).toLocaleString('en-NG');
function Price({
  amount,
  compareAt,
  from,
  currency = '₦',
  size = 'md',
  tone = 'default',
  style
}) {
  const fs = {
    sm: 16,
    md: 'var(--text-price)',
    lg: 'var(--text-price-lg)'
  }[size];
  const col = tone === 'inverse' ? 'var(--gold-400)' : 'var(--cocoa-800)';
  const missing = amount === undefined || amount === null || amount === '';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontVariantNumeric: 'tabular-nums',
      ...style
    }
  }, from && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: tone === 'inverse' ? 'var(--cocoa-300)' : 'var(--text-secondary)'
    }
  }, "From"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: fs,
      fontWeight: 800,
      color: missing ? 'var(--text-muted)' : col,
      lineHeight: 1
    }
  }, missing ? currency + ' [price]' : currency + fmt(amount)), compareAt != null && /*#__PURE__*/React.createElement("s", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-muted)'
    }
  }, currency + fmt(compareAt)));
}
Object.assign(__ds_scope, { Price });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/Price.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const BASE = 'https://unpkg.com/lucide-static@0.460.0/icons/';
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  label,
  style
}) {
  const url = 'url(' + BASE + name + '.svg)';
  return /*#__PURE__*/React.createElement("span", {
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      display: 'inline-block',
      flex: 'none',
      width: size,
      height: size,
      background: color,
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/PhotoFrame.jsx
try { (() => {
const R = {
  arch: 'var(--radius-arch)',
  rounded: 'var(--radius-xl)',
  circle: '50%',
  square: 'var(--radius-sm)'
};
function PhotoFrame({
  src,
  alt = '',
  shape = 'rounded',
  ratio = '4/5',
  conceptual,
  placeholder = 'Product photography',
  ring,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      position: 'relative',
      aspectRatio: ratio,
      borderRadius: R[shape],
      overflow: 'hidden',
      background: 'var(--cream-200)',
      boxShadow: ring ? '0 0 0 4px var(--cream-0), 0 0 0 7px ' + ring : undefined,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: 'var(--cocoa-500)',
      fontFamily: 'var(--font-body)',
      backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 14px, rgba(61,29,16,.05) 14px 15px)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "camera",
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, placeholder)), conceptual && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      position: 'absolute',
      left: 10,
      bottom: 10,
      padding: '3px 9px',
      borderRadius: 999,
      background: 'rgba(30,13,6,.72)',
      color: 'var(--cream-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase'
    }
  }, "Conceptual image"));
}
Object.assign(__ds_scope, { PhotoFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PhotoFrame.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CategoryCard.jsx
try { (() => {
const CAT = {
  cakes: {
    label: 'Cakes',
    c: 'var(--cat-cakes)',
    bg: 'var(--cat-cakes-bg)',
    fg: 'var(--cat-cakes-fg)',
    icon: 'cake'
  },
  bakes: {
    label: 'Pastries & Banana Bread',
    c: 'var(--cat-bakes)',
    bg: 'var(--cat-bakes-bg)',
    fg: 'var(--cat-bakes-fg)',
    icon: 'croissant'
  },
  chops: {
    label: 'Small Chops & Snacks',
    c: 'var(--cat-chops)',
    bg: 'var(--cat-chops-bg)',
    fg: 'var(--cat-chops-fg)',
    icon: 'sandwich'
  },
  yogurt: {
    label: 'Yogurt & Fura',
    c: 'var(--cat-yogurt)',
    bg: 'var(--cat-yogurt-bg)',
    fg: 'var(--cat-yogurt-fg)',
    icon: 'cup-soda'
  },
  celebration: {
    label: 'Celebration Boxes',
    c: 'var(--cat-celebration)',
    bg: 'var(--cat-celebration-bg)',
    fg: 'var(--cat-celebration-fg)',
    icon: 'gift'
  }
};
function CategoryCard({
  category = 'cakes',
  label,
  image,
  caption,
  active,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const cat = CAT[category] || CAT.cakes;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '0 0 16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      textAlign: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4/5',
      borderRadius: 'var(--radius-arch)',
      overflow: 'hidden',
      background: cat.bg,
      boxShadow: active ? '0 0 0 3px var(--cream-0), 0 0 0 6px ' + cat.c : hover ? 'var(--shadow-2)' : 'none',
      transition: 'box-shadow var(--dur-base)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: hover ? 'scale(1.05)' : 'none',
      transition: 'transform 600ms var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: cat.fg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: cat.icon,
    size: 40
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      lineHeight: 1.15,
      color: 'var(--text-primary)'
    }
  }, label || cat.label), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { CategoryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CategoryCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/QuantityStepper.jsx
try { (() => {
function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  style
}) {
  const h = size === 'sm' ? 34 : 44;
  const b = dis => ({
    width: h,
    height: h,
    borderRadius: '50%',
    border: 'none',
    background: dis ? 'transparent' : 'var(--cream-0)',
    color: dis ? 'var(--cocoa-300)' : 'var(--cocoa-800)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: dis ? 'not-allowed' : 'pointer',
    boxShadow: dis ? 'none' : 'var(--shadow-1)'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: 3,
      background: 'var(--cream-200)',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Decrease",
    disabled: value <= min,
    onClick: () => onChange && onChange(Math.max(min, value - 1)),
    style: b(value <= min)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 28,
      textAlign: 'center',
      fontWeight: 800,
      fontSize: 16,
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--cocoa-800)'
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Increase",
    disabled: value >= max,
    onClick: () => onChange && onChange(Math.min(max, value + 1)),
    style: b(value >= max)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  })));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  pink: ['var(--icing-100)', 'var(--icing-700)', 'var(--icing-600)'],
  gold: ['var(--gold-100)', 'var(--gold-700)', 'var(--gold-500)'],
  cocoa: ['var(--cocoa-100)', 'var(--cocoa-800)', 'var(--cocoa-800)'],
  milk: ['var(--milk-100)', 'var(--milk-700)', 'var(--milk-600)'],
  leaf: ['var(--leaf-100)', 'var(--leaf-700)', 'var(--leaf-600)'],
  neutral: ['var(--cream-200)', 'var(--cocoa-700)', 'var(--cocoa-600)'],
  success: ['var(--success-bg)', 'var(--success-fg)', 'var(--success)'],
  warning: ['var(--warning-bg)', 'var(--warning-fg)', 'var(--gold-500)'],
  error: ['var(--error-bg)', 'var(--error-fg)', 'var(--error)'],
  info: ['var(--info-bg)', 'var(--info-fg)', 'var(--info)']
};
function Badge({
  tone = 'pink',
  variant = 'soft',
  icon,
  size = 'md',
  children,
  style
}) {
  const t = T[tone] || T.pink;
  const solid = variant === 'solid';
  const fg = solid ? tone === 'gold' || tone === 'warning' ? 'var(--cocoa-900)' : '#fff' : t[1];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: size === 'sm' ? 22 : 28,
      padding: size === 'sm' ? '0 9px' : '0 12px',
      borderRadius: 'var(--radius-pill)',
      background: solid ? t[2] : t[0],
      color: fg,
      fontFamily: 'var(--font-body)',
      fontWeight: 800,
      fontSize: size === 'sm' ? 10.5 : 12,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 12 : 14
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
const CAT = {
  cakes: {
    label: 'Cakes',
    c: 'var(--cat-cakes)',
    bg: 'var(--cat-cakes-bg)',
    fg: 'var(--cat-cakes-fg)',
    icon: 'cake'
  },
  bakes: {
    label: 'Pastries & Banana Bread',
    c: 'var(--cat-bakes)',
    bg: 'var(--cat-bakes-bg)',
    fg: 'var(--cat-bakes-fg)',
    icon: 'croissant'
  },
  chops: {
    label: 'Small Chops & Snacks',
    c: 'var(--cat-chops)',
    bg: 'var(--cat-chops-bg)',
    fg: 'var(--cat-chops-fg)',
    icon: 'sandwich'
  },
  yogurt: {
    label: 'Yogurt & Fura',
    c: 'var(--cat-yogurt)',
    bg: 'var(--cat-yogurt-bg)',
    fg: 'var(--cat-yogurt-fg)',
    icon: 'cup-soda'
  },
  celebration: {
    label: 'Celebration Boxes',
    c: 'var(--cat-celebration)',
    bg: 'var(--cat-celebration-bg)',
    fg: 'var(--cat-celebration-fg)',
    icon: 'gift'
  }
};
function ProductCard({
  image,
  name,
  description,
  price,
  priceFrom,
  category = 'cakes',
  badge,
  badgeTone = 'pink',
  layout = 'vertical',
  onAdd,
  onClick,
  addLabel = 'Add',
  style
}) {
  const [hover, setHover] = React.useState(false);
  const cat = CAT[category] || CAT.cakes;
  const h = layout === 'horizontal';
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: h ? 'row' : 'column',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-3)' : 'var(--shadow-1)',
      transform: hover ? 'translateY(-3px)' : 'none',
      border: '1px solid var(--border-subtle)',
      transition: 'box-shadow var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none',
      width: h ? 132 : '100%',
      aspectRatio: h ? '1/1' : '4/3.4',
      background: cat.bg,
      overflow: 'hidden'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: hover ? 'scale(1.04)' : 'none',
      transition: 'transform 600ms var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      color: cat.fg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: cat.icon,
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, "Product photo")), badge && !h && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: badgeTone,
    variant: "solid",
    size: "sm",
    style: {
      position: 'absolute',
      top: 12,
      left: 12
    }
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      padding: h ? '14px 16px' : '16px 18px 18px',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: cat.fg
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 4,
      background: cat.c
    }
  }), cat.label), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 'var(--text-product-name)',
      lineHeight: 1.15,
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, name), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.45,
      color: 'var(--text-secondary)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginTop: 'auto',
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Price, {
    amount: price,
    from: priceFrom
  }), onAdd && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": addLabel + ' ' + name,
    onClick: e => {
      e.stopPropagation();
      onAdd();
    },
    style: {
      height: 40,
      padding: '0 14px 0 10px',
      borderRadius: 20,
      border: 'none',
      background: 'var(--action-primary)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 18
  }), addLabel))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 'var(--btn-h-sm)',
    px: 16,
    fs: 14,
    ic: 16
  },
  md: {
    h: 'var(--btn-h-md)',
    px: 22,
    fs: 16,
    ic: 18
  },
  lg: {
    h: 'var(--btn-h-lg)',
    px: 30,
    fs: 17,
    ic: 20
  }
};
const V = {
  primary: {
    bg: 'var(--action-primary)',
    hv: 'var(--action-primary-hover)',
    ac: 'var(--action-primary-active)',
    fg: '#fff',
    bd: 'transparent'
  },
  secondary: {
    bg: 'var(--cocoa-800)',
    hv: 'var(--cocoa-900)',
    ac: 'var(--cocoa-950)',
    fg: 'var(--cream-50)',
    bd: 'transparent'
  },
  outline: {
    bg: 'transparent',
    hv: 'var(--cream-200)',
    ac: 'var(--cream-300)',
    fg: 'var(--cocoa-800)',
    bd: 'var(--cocoa-800)'
  },
  ghost: {
    bg: 'transparent',
    hv: 'var(--icing-50)',
    ac: 'var(--icing-100)',
    fg: 'var(--icing-700)',
    bd: 'transparent'
  },
  gold: {
    bg: 'var(--gold-500)',
    hv: 'var(--gold-400)',
    ac: 'var(--gold-600)',
    fg: 'var(--cocoa-900)',
    bd: 'transparent'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  disabled,
  onClick,
  href,
  type = 'button',
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = V[variant] || V.primary,
    s = SIZES[size] || SIZES.md;
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    type: href ? undefined : type,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: 'var(--radius-pill)',
      border: '2px solid ' + v.bd,
      background: disabled ? 'var(--cream-200)' : press ? v.ac : hover ? v.hv : v.bg,
      color: disabled ? 'var(--cocoa-500)' : v.fg,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: s.fs,
      letterSpacing: 'var(--tracking-button)',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: press && !disabled ? 'scale(.97)' : 'none',
      transition: 'background var(--dur-base) var(--ease-soft), transform var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.ic
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = 'soft',
  size = 44,
  count,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const V = {
    soft: ['var(--cream-200)', 'var(--cream-300)', 'var(--cocoa-800)'],
    solid: ['var(--action-primary)', 'var(--action-primary-hover)', '#fff'],
    ghost: ['transparent', 'var(--cream-200)', 'var(--cocoa-800)'],
    inverse: ['rgba(255,249,241,.12)', 'rgba(255,249,241,.22)', 'var(--cream-50)']
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '50%',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? V[1] : V[0],
      color: V[2],
      cursor: 'pointer',
      transition: 'background var(--dur-base)',
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }), count > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 20,
      height: 20,
      padding: '0 5px',
      borderRadius: 10,
      background: 'var(--icing-600)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      boxShadow: '0 0 0 2px var(--cream-0)'
    }
  }, count));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const T = {
  success: ['var(--success-bg)', 'var(--success-fg)', 'circle-check'],
  warning: ['var(--warning-bg)', 'var(--warning-fg)', 'triangle-alert'],
  error: ['var(--error-bg)', 'var(--error-fg)', 'circle-alert'],
  info: ['var(--info-bg)', 'var(--info-fg)', 'info']
};
function Alert({
  tone = 'info',
  title,
  children,
  action,
  style
}) {
  const t = T[tone] || T.info;
  return /*#__PURE__*/React.createElement("div", {
    role: tone === 'error' ? 'alert' : 'status',
    style: {
      display: 'flex',
      gap: 12,
      padding: '14px 16px',
      borderRadius: 'var(--radius-md)',
      background: t[0],
      color: t[1],
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      paddingTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t[2],
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 15,
      fontWeight: 800
    }
  }, title), children && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.45
    }
  }, children), action && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6
    }
  }, action)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AnnouncementBanner.jsx
try { (() => {
const T = {
  cocoa: ['var(--cocoa-800)', 'var(--cream-50)', 'var(--gold-400)'],
  pink: ['var(--icing-600)', '#fff', '#fff'],
  gold: ['var(--gold-400)', 'var(--cocoa-900)', 'var(--cocoa-900)'],
  cream: ['var(--cream-200)', 'var(--cocoa-800)', 'var(--icing-600)']
};
function AnnouncementBanner({
  tone = 'cocoa',
  icon = 'sparkles',
  children,
  actionLabel,
  onAction,
  onDismiss,
  style
}) {
  const t = T[tone] || T.cocoa;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      minHeight: 44,
      padding: '8px 48px',
      position: 'relative',
      background: t[0],
      color: t[1],
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      textAlign: 'center',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: t[2],
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", null, children), actionLabel && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      background: 'none',
      border: 'none',
      color: t[1],
      fontFamily: 'inherit',
      fontSize: 14,
      fontWeight: 800,
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      cursor: 'pointer',
      padding: 0
    }
  }, actionLabel), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onDismiss,
    style: {
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 36,
      height: 36,
      border: 'none',
      background: 'transparent',
      color: t[1],
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })));
}
Object.assign(__ds_scope, { AnnouncementBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AnnouncementBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function EmptyState({
  icon = 'shopping-bag',
  title,
  body,
  action,
  tone = 'cream',
  style
}) {
  const err = tone === 'error';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 12,
      padding: '40px 24px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 76,
      height: 76,
      borderRadius: '38px 38px 20px 20px',
      background: err ? 'var(--error-bg)' : 'var(--icing-100)',
      color: err ? 'var(--error-fg)' : 'var(--icing-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 32
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 24,
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 340,
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--text-secondary)'
    }
  }, body), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      minHeight: 44,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 7,
      flex: 'none',
      border: '2px solid ' + (checked ? 'var(--icing-600)' : 'var(--border-strong)'),
      background: checked ? 'var(--icing-600)' : 'var(--surface-elevated)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 15
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/OptionCard.jsx
try { (() => {
function OptionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  meta,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "radio",
    "aria-checked": !!selected,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: '100%',
      padding: '14px 16px',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      cursor: 'pointer',
      background: selected ? 'var(--icing-50)' : 'var(--surface-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '2px solid ' + (selected ? 'var(--icing-600)' : hover ? 'var(--border-strong)' : 'var(--border-default)'),
      transition: 'border-color var(--dur-fast), background var(--dur-fast)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      flex: 'none',
      borderRadius: 12,
      background: selected ? 'var(--icing-100)' : 'var(--cream-200)',
      color: selected ? 'var(--icing-700)' : 'var(--cocoa-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--text-primary)'
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.4,
      color: 'var(--text-secondary)'
    }
  }, description), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--cocoa-800)',
      marginTop: 2
    }
  }, meta)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: 11,
      border: '2px solid ' + (selected ? 'var(--icing-600)' : 'var(--border-strong)'),
      background: selected ? 'var(--icing-600)' : 'transparent',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2
    }
  }, selected && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  })));
}
Object.assign(__ds_scope, { OptionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/OptionCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/SelectField.jsx
try { (() => {
function SelectField({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  hint,
  error,
  placeholder,
  required,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const fid = 'sf-' + String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--icing-600)'
    }
  }, " *")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: fid,
    value: value,
    defaultValue: defaultValue,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 'var(--input-h)',
      padding: '0 44px 0 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-elevated)',
      border: '2px solid ' + (error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
      boxShadow: focus ? '0 0 0 4px var(--icing-100)' : 'none',
      outline: 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-primary)',
      cursor: 'pointer'
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--cocoa-600)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: error ? 'var(--error-fg)' : 'var(--text-secondary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { SelectField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SelectField.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextField({
  label,
  hint,
  error,
  placeholder,
  value,
  defaultValue,
  onChange,
  type = 'text',
  multiline,
  rows = 4,
  icon,
  required,
  disabled,
  id,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const fid = id || 'tf-' + String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const bd = error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  const common = {
    id: fid,
    placeholder,
    value,
    defaultValue,
    disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-primary)',
      padding: multiline ? '12px 0' : 0,
      resize: 'vertical',
      minHeight: multiline ? rows * 24 : undefined,
      lineHeight: 1.5
    }
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--icing-600)'
    }
  }, " *")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: multiline ? 'flex-start' : 'center',
      gap: 10,
      minHeight: 'var(--input-h)',
      padding: '0 16px',
      background: disabled ? 'var(--cream-200)' : 'var(--surface-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '2px solid ' + bd,
      boxShadow: focus ? '0 0 0 4px var(--icing-100)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'flex',
      paddingTop: multiline ? 14 : 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  })), multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows
  }, common)) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, common))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: error ? 'var(--error-fg)' : 'var(--text-secondary)'
    }
  }, error && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 14
  }), error || hint));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/CategoryTabs.jsx
try { (() => {
const C = {
  all: ['var(--cocoa-800)', 'grid-2x2'],
  cakes: ['var(--cat-cakes)', 'cake'],
  bakes: ['var(--cat-bakes)', 'croissant'],
  chops: ['var(--cat-chops)', 'sandwich'],
  yogurt: ['var(--cat-yogurt)', 'cup-soda'],
  celebration: ['var(--cat-celebration)', 'gift']
};
function CategoryTabs({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '4px 2px',
      scrollbarWidth: 'none',
      ...style
    }
  }, items.map(it => {
    const on = value === it.id;
    const c = C[it.id] || C.all;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": on,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 44,
        padding: '0 18px 0 14px',
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        border: '2px solid ' + (on ? 'var(--cocoa-800)' : 'var(--border-default)'),
        background: on ? 'var(--cocoa-800)' : 'var(--surface)',
        color: on ? 'var(--cream-50)' : 'var(--cocoa-800)',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 14.5,
        transition: 'background var(--dur-base)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: on ? 'var(--gold-400)' : c[0],
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: c[1],
      size: 18
    })), it.label);
  }));
}
Object.assign(__ds_scope, { CategoryTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/CategoryTabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  logoSrc,
  links = [],
  active,
  onNavigate,
  cartCount = 0,
  onCart,
  onMenu,
  compact,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      height: compact ? 64 : 80,
      padding: '0 var(--page-margin)',
      background: 'var(--bg-page)',
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate('home');
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none',
      flex: 'none'
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Treats by MMA",
    style: {
      height: compact ? 48 : 62,
      width: 'auto',
      display: 'block',
      mixBlendMode: 'multiply'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--cocoa-800)'
    }
  }, "Treats by MMA")), !compact && /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4,
      flex: 1,
      justifyContent: 'center'
    }
  }, links.map(l => {
    const on = active === l.id;
    return /*#__PURE__*/React.createElement("a", {
      key: l.id,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(l.id);
      },
      style: {
        padding: '10px 14px',
        borderRadius: 'var(--radius-pill)',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: on ? 800 : 600,
        color: on ? 'var(--icing-700)' : 'var(--cocoa-800)',
        background: on ? 'var(--icing-50)' : 'transparent'
      }
    }, l.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginLeft: compact ? 'auto' : 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "shopping-bag",
    label: "Your order",
    count: cartCount,
    onClick: onCart
  }), compact && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "menu",
    label: "Menu",
    variant: "ghost",
    onClick: onMenu
  })));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CakeOrder.jsx
try { (() => {
(() => {
  const {
    SectionHeading,
    TextField,
    SelectField,
    OptionCard,
    Checkbox,
    Button,
    Alert,
    PhotoFrame
  } = window.TreatsByMMADesignSystem_b5a371;
  function CakeOrderPage({
    go
  }) {
    const [size, setSize] = React.useState('8');
    const [fulfil, setFulfil] = React.useState('pickup');
    const [note, setNote] = React.useState(true);
    const [phone, setPhone] = React.useState('');
    const [err, setErr] = React.useState('');
    const [sent, setSent] = React.useState(false);
    const submit = () => {
      if (phone.replace(/\D/g, '').length < 10) {
        setErr('Please enter a full phone number so we can confirm on WhatsApp');
        return;
      }
      setErr('');
      setSent(true);
    };
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: '48px 0 var(--section-y)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...storefrontWrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
        gap: 56
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      align: "start",
      eyebrow: "Celebration cakes",
      title: "Tell us about your cake",
      body: "Share the details and we\u2019ll reply to confirm design, price and timing."
    }), sent ? /*#__PURE__*/React.createElement(Alert, {
      tone: "success",
      title: "Request sent \u2014 thank you!",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline",
        onClick: () => go('home')
      }, "Back to home")
    }, "We\u2019ll message you on WhatsApp to confirm the details and price.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(SelectField, {
      label: "Occasion",
      placeholder: "Choose one",
      options: ['Birthday', 'Anniversary', 'Wedding', 'Baby shower', 'Office party', 'Other'],
      required: true
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Event date",
      type: "date",
      required: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 8
      }
    }, "Size"), /*#__PURE__*/React.createElement("div", {
      role: "radiogroup",
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 12
      }
    }, [['6', '6-inch', 'Serves [X]'], ['8', '8-inch', 'Serves [X]'], ['tier', '2-tier', 'Serves [X]']].map(([v, t, d]) => /*#__PURE__*/React.createElement(OptionCard, {
      key: v,
      title: t,
      description: d,
      meta: "From \u20A6 [price]",
      selected: size === v,
      onClick: () => setSize(v)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(SelectField, {
      label: "Flavour",
      placeholder: "Choose a flavour",
      options: ['[Flavour options to confirm]']
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Message on the cake",
      placeholder: "e.g. Happy 30th, Ada!"
    })), /*#__PURE__*/React.createElement(TextField, {
      label: "Design ideas",
      multiline: true,
      rows: 3,
      placeholder: "Colours, theme, toppers \u2014 or say you\u2019ll send a photo on WhatsApp"
    }), /*#__PURE__*/React.createElement("div", {
      role: "radiogroup",
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(OptionCard, {
      icon: "store",
      title: "Pickup",
      description: "Collect from our kitchen",
      selected: fulfil === 'pickup',
      onClick: () => setFulfil('pickup')
    }), /*#__PURE__*/React.createElement(OptionCard, {
      icon: "truck",
      title: "Delivery",
      description: "[Areas & fees to confirm]",
      selected: fulfil === 'delivery',
      onClick: () => setFulfil('delivery')
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Your name",
      required: true
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Phone (WhatsApp)",
      type: "tel",
      icon: "phone",
      value: phone,
      onChange: setPhone,
      error: err,
      required: true
    })), /*#__PURE__*/React.createElement(Checkbox, {
      label: "Add a gift note card",
      checked: note,
      onChange: setNote
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      icon: "send",
      onClick: submit
    }, "Send cake request"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "ghost",
      onClick: () => go('home')
    }, "Cancel")))), /*#__PURE__*/React.createElement("aside", {
      style: {
        position: 'sticky',
        top: 24,
        alignSelf: 'start',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(PhotoFrame, {
      shape: "arch",
      ratio: "4/5",
      src: CAT_IMG.cakes,
      conceptual: true,
      ring: "var(--gold-500)"
    }), /*#__PURE__*/React.createElement(Alert, {
      tone: "info",
      title: "Good to know"
    }, "Custom cakes need [X days] notice. Final price is confirmed after we review your design."))));
  }
  Object.assign(window, {
    CakeOrderPage
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CakeOrder.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Cart.jsx
try { (() => {
(() => {
  const {
    IconButton,
    QuantityStepper,
    Price,
    Button,
    EmptyState,
    Icon
  } = window.TreatsByMMADesignSystem_b5a371;
  function CartDrawer({
    open,
    items,
    setQty,
    close,
    go
  }) {
    const [sent, setSent] = React.useState(false);
    React.useEffect(() => {
      if (!open) setSent(false);
    }, [open]);
    const count = items.reduce((a, b) => a + b.qty, 0);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: close,
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(30,13,6,.4)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity var(--dur-slow)',
        zIndex: 40
      }
    }), /*#__PURE__*/React.createElement("aside", {
      "aria-hidden": !open,
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        maxWidth: '100%',
        background: 'var(--bg-page)',
        boxShadow: 'var(--shadow-3)',
        transform: open ? 'none' : 'translateX(100%)',
        transition: 'transform var(--dur-slow) var(--ease-out)',
        zIndex: 41,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "tbm-h3"
    }, "Your order", count ? ' (' + count + ')' : ''), /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Close",
      variant: "ghost",
      onClick: close
    })), sent ? /*#__PURE__*/React.createElement(EmptyState, {
      icon: "circle-check",
      title: "Order request sent",
      body: "Thank you! We\u2019ll reply on WhatsApp to confirm items, price and timing.",
      action: /*#__PURE__*/React.createElement(Button, {
        onClick: close
      }, "Keep browsing"),
      style: {
        flex: 1,
        justifyContent: 'center'
      }
    }) : !items.length ? /*#__PURE__*/React.createElement(EmptyState, {
      title: "Your order is empty",
      body: "Something sweet is only a tap away.",
      action: /*#__PURE__*/React.createElement(Button, {
        onClick: () => {
          close();
          go('menu');
        }
      }, "Browse the menu"),
      style: {
        flex: 1,
        justifyContent: 'center'
      }
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto',
        padding: '8px 24px'
      }
    }, items.map(it => /*#__PURE__*/React.createElement("div", {
      key: it.id,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: it.image,
      alt: "",
      style: {
        width: 64,
        height: 64,
        borderRadius: 14,
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 400,
        fontSize: 17
      }
    }, it.name), /*#__PURE__*/React.createElement(Price, {
      amount: it.price,
      size: "sm",
      from: it.from
    })), /*#__PURE__*/React.createElement(QuantityStepper, {
      size: "sm",
      min: 0,
      value: it.qty,
      onChange: v => setQty(it.id, v)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 15
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, "Estimated total"), /*#__PURE__*/React.createElement(Price, {
      amount: null
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)'
      }
    }, "We confirm the final price and pickup/delivery when we reply."), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      icon: "message-circle",
      onClick: () => setSent(true)
    }, "Send order on WhatsApp")))));
  }
  Object.assign(window, {
    CartDrawer
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
(() => {
  const {
    Button,
    Badge,
    CategoryCard,
    ProductCard,
    SectionHeading,
    RibbonRule,
    IcingEdge,
    PhotoFrame,
    Icon
  } = window.TreatsByMMADesignSystem_b5a371;
  const wrap = {
    maxWidth: 'var(--container-lg)',
    margin: '0 auto',
    padding: '0 var(--page-margin)'
  };
  function Hero({
    go
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--bg-page)',
        padding: '56px 0 72px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)',
        gap: 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "pink",
      icon: "sparkles"
    }, "Cakes \xB7 Pastries \xB7 Small chops \xB7 Yogurt fura"), /*#__PURE__*/React.createElement("h1", {
      className: "tbm-display",
      style: {
        color: 'var(--cocoa-800)'
      }
    }, "Treats that make the ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--icing-600)'
      }
    }, "moment.")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-lg)',
        color: 'var(--text-secondary)',
        maxWidth: 480
      }
    }, "Celebration cakes, warm banana bread, party small chops and chilled yogurt fura \u2014 baked with care for birthdays, gatherings and every ordinary craving."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      icon: "shopping-bag",
      onClick: () => go('menu')
    }, "Browse the menu"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "outline",
      onClick: () => go('celebrations')
    }, "Plan a celebration cake"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(PhotoFrame, {
      shape: "arch",
      ratio: "4/4.6",
      src: CAT_IMG.cakes,
      conceptual: true,
      ring: "var(--gold-500)",
      style: {
        maxWidth: 440,
        marginLeft: 'auto'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        bottom: 40,
        background: 'var(--surface)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-3)',
        padding: '14px 18px',
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 22,
        background: 'var(--icing-100)',
        color: 'var(--icing-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "cake",
      size: 22
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: {
        display: 'block',
        fontSize: 15
      }
    }, "Custom cakes"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--text-secondary)'
      }
    }, "Book [X days] ahead"))))));
  }
  function Categories({
    go
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: 'var(--section-y) 0',
        background: 'var(--bg-page-alt)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Our treats",
      title: "Something for every craving",
      body: "From milestone cakes to everyday snacks, explore what\u2019s fresh from our kitchen."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
        gap: 20,
        marginTop: 48
      }
    }, ['cakes', 'bakes', 'chops', 'yogurt', 'celebration'].map(c => /*#__PURE__*/React.createElement(CategoryCard, {
      key: c,
      category: c,
      image: CAT_IMG[c],
      caption: CAT_CAPTION[c],
      onClick: () => go('menu', c)
    })))));
  }
  function Signature({
    go,
    add
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: 'var(--section-y) 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 24,
        marginBottom: 36
      }
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      align: "start",
      eyebrow: "Signature treats",
      title: "The ones everyone asks for"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => go('menu')
    }, "See full menu")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
        gap: 20
      }
    }, PRODUCTS.slice(0, 4).map(p => /*#__PURE__*/React.createElement(ProductCard, {
      key: p.id,
      image: p.image,
      name: p.name,
      description: p.desc,
      price: p.price,
      priceFrom: p.from,
      category: p.category,
      badge: p.badge,
      badgeTone: p.badgeTone,
      onAdd: () => add(p),
      onClick: () => go('product', p.id)
    })))));
  }
  function Celebration({
    go
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--cocoa-800)',
        color: 'var(--cream-50)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(IcingEdge, {
      background: "var(--bg-page)",
      color: "var(--cocoa-800)",
      height: 30,
      flip: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 56,
        alignItems: 'center',
        padding: '64px var(--page-margin) 88px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(PhotoFrame, {
      shape: "arch",
      src: CAT_IMG.cakes,
      conceptual: true
    }), /*#__PURE__*/React.createElement(PhotoFrame, {
      shape: "rounded",
      src: CAT_IMG.celebration,
      style: {
        marginTop: 48
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      inverse: true,
      align: "start",
      eyebrow: "Celebrations",
      title: "Your day, your cake, done beautifully.",
      body: "Tell us the occasion, the date and the look you love. We\u2019ll help with size, flavour and finish \u2014 then bake it to order."
    }), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: 10
      }
    }, ['Birthdays, anniversaries & milestones', 'Matching treats & small chops for the party', 'Gift-ready boxes and message cards'].map(t => /*#__PURE__*/React.createElement("li", {
      key: t,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--gold-400)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 18
    })), t))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "gold",
      size: "lg",
      iconRight: "arrow-right",
      onClick: () => go('celebrations')
    }, "Start a cake request")))));
  }
  function HowTo() {
    const steps = [['message-circle', 'Message us', 'Send your order on WhatsApp or through this site.'], ['cake-slice', 'Choose your treats', 'Pick products, quantity, date and any custom details.'], ['circle-check', 'We confirm', 'We reply to confirm price, timing and payment.'], ['truck', 'Pickup or delivery', 'Collect from our kitchen or arrange delivery [areas to confirm].']];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: 'var(--section-y) 0',
        background: 'var(--bg-page-alt)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "How ordering works",
      title: "Easy from craving to collection"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
        gap: 20,
        marginTop: 44
      }
    }, steps.map(([i, t, d], n) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: 'var(--shadow-1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 48,
        height: 48,
        borderRadius: 16,
        background: 'var(--icing-100)',
        color: 'var(--icing-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: i,
      size: 22
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        color: 'var(--cream-300)'
      }
    }, n + 1)), /*#__PURE__*/React.createElement("h3", {
      className: "tbm-h4"
    }, t), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: 'var(--text-secondary)'
      }
    }, d))))));
  }
  function Contact() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: 'var(--section-y) 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
        gap: 40,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      align: "start",
      eyebrow: "Say hello",
      title: "We\u2019d love to bake for you",
      body: "Questions, custom requests or a quick order \u2014 reach us the way that suits you."
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 12
      }
    }, [['message-circle', 'WhatsApp', '0813 107 7321 · 0815 585 6020'], ['instagram', 'Instagram', '@treats_by_mma'], ['music-2', 'TikTok', '@.mmacakeandpastry'], ['map-pin', 'Kitchen', 'Festmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja']].map(([i, t, v]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: '14px 18px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--icing-600)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: i,
      size: 22
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: {
        display: 'block',
        fontSize: 14
      }
    }, t), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        color: 'var(--text-secondary)'
      }
    }, v)))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)'
      }
    }, "Contact details taken from supplied signage \u2014 confirm before publishing."))));
  }
  function Footer({
    go
  }) {
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: 'var(--cocoa-900)',
        color: 'var(--cocoa-300)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '56px var(--page-margin) 32px',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        color: 'var(--gold-400)'
      }
    }, "Treats by MMA"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        maxWidth: 280
      }
    }, "Cakes, pastries, banana bread, small chops, yogurt and yogurt fura \u2014 made to make every occasion special.")), [['Shop', ['Cakes', 'Pastries & Banana Bread', 'Small Chops', 'Yogurt & Fura']], ['Order', ['How to order', 'Celebration cakes', 'Pickup & delivery']], ['Follow', ['Instagram', 'TikTok', 'Facebook']]].map(([h, l]) => /*#__PURE__*/React.createElement("div", {
      key: h,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "tbm-label",
      style: {
        color: 'var(--gold-400)'
      }
    }, h), l.map(x => /*#__PURE__*/React.createElement("a", {
      key: x,
      href: "#",
      onClick: e => {
        e.preventDefault();
        go('menu');
      },
      style: {
        color: 'var(--cream-100)',
        textDecoration: 'none',
        fontSize: 14
      }
    }, x))))), /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '0 var(--page-margin) 28px'
      }
    }, /*#__PURE__*/React.createElement(RibbonRule, {
      tone: "gold"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12.5,
        marginTop: 16,
        textAlign: 'center'
      }
    }, "\xA9 [Year] Treats by MMA \xB7 [Policies to confirm]")));
  }
  function HomePage({
    go,
    add
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
      go: go
    }), /*#__PURE__*/React.createElement(Categories, {
      go: go
    }), /*#__PURE__*/React.createElement(Signature, {
      go: go,
      add: add
    }), /*#__PURE__*/React.createElement(Celebration, {
      go: go
    }), /*#__PURE__*/React.createElement(HowTo, null), /*#__PURE__*/React.createElement(Contact, null));
  }
  Object.assign(window, {
    HomePage,
    Footer,
    storefrontWrap: wrap
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Menu.jsx
try { (() => {
(() => {
  const {
    CategoryTabs,
    ProductCard,
    SectionHeading,
    EmptyState,
    Button,
    PhotoFrame,
    Price,
    QuantityStepper,
    Badge,
    Icon,
    RibbonRule
  } = window.TreatsByMMADesignSystem_b5a371;
  function MenuPage({
    go,
    add,
    cat,
    setCat
  }) {
    const list = PRODUCTS.filter(p => cat === 'all' || p.category === cat);
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: '48px 0 var(--section-y)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: storefrontWrap
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      align: "start",
      eyebrow: "Menu",
      title: "Everything we bake & blend",
      body: "Prices are confirmed when we reply to your order."
    }), /*#__PURE__*/React.createElement(CategoryTabs, {
      items: CATS,
      value: cat,
      onChange: setCat,
      style: {
        margin: '28px 0 32px'
      }
    }), list.length ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
        gap: 24
      }
    }, list.map(p => /*#__PURE__*/React.createElement(ProductCard, {
      key: p.id,
      image: p.image,
      name: p.name,
      description: p.desc,
      price: p.price,
      priceFrom: p.from,
      category: p.category,
      badge: p.badge,
      badgeTone: p.badgeTone,
      onAdd: () => add(p),
      onClick: () => go('product', p.id)
    }))) : /*#__PURE__*/React.createElement(EmptyState, {
      icon: "search",
      title: "Nothing here yet",
      body: "We\u2019re still filling this shelf. Try another category.",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => setCat('all')
      }, "Show all treats")
    })));
  }
  function ProductPage({
    id,
    go,
    add
  }) {
    const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
    const [q, setQ] = React.useState(1);
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: '40px 0 var(--section-y)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: storefrontWrap
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => go('menu'),
      style: {
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 14,
        cursor: 'pointer',
        padding: 0,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 16
    }), "Back to menu"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 56,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(PhotoFrame, {
      shape: "arch",
      ratio: "4/4.4",
      src: p.image,
      conceptual: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        paddingTop: 16
      }
    }, p.badge && /*#__PURE__*/React.createElement(Badge, {
      tone: p.badgeTone || 'pink'
    }, p.badge), /*#__PURE__*/React.createElement("h1", {
      className: "tbm-h1"
    }, p.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-lg)',
        color: 'var(--text-secondary)'
      }
    }, p.desc), /*#__PURE__*/React.createElement(Price, {
      amount: p.price,
      from: p.from,
      size: "lg"
    }), /*#__PURE__*/React.createElement(RibbonRule, {
      align: "start"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(QuantityStepper, {
      value: q,
      onChange: setQ
    }), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      icon: "shopping-bag",
      onClick: () => {
        for (let i = 0; i < q; i++) add(p);
      }
    }, "Add to order")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 10,
        padding: 18,
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        fontSize: 14.5
      }
    }, [['clock', 'Lead time: [to confirm]'], ['store', 'Pickup from our kitchen'], ['truck', 'Delivery: [areas & fees to confirm]'], ['info', 'Ingredients & allergens: [to be supplied]']].map(([i, t]) => /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--cocoa-800)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: i,
      size: 18
    })), t)))))));
  }
  Object.assign(window, {
    MenuPage,
    ProductPage
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Menu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.jsx
try { (() => {
(() => {
  const P = '../../assets/photos/';
  const PRODUCTS = [{
    id: 'drip',
    name: 'Celebration Drip Cake',
    category: 'cakes',
    image: P + 'concept-cake.png',
    desc: 'Layered sponge with a glossy drip finish and topper of your choice. Made to order.',
    price: null,
    from: true,
    badge: 'Made to order'
  }, {
    id: 'banana',
    name: 'Classic Banana Bread',
    category: 'bakes',
    image: P + 'concept-banana-bread.png',
    desc: 'Soft, moist loaf with a golden crust. [Description to confirm]',
    price: null,
    badge: 'Bestseller',
    badgeTone: 'gold'
  }, {
    id: 'chops',
    name: 'Small Chops Platter',
    category: 'chops',
    image: P + 'concept-small-chops.png',
    desc: 'Samosa, spring rolls and more, packed party-ready. [Contents to confirm]',
    price: null,
    from: true,
    badge: 'Party size',
    badgeTone: 'leaf'
  }, {
    id: 'fura',
    name: 'Yogurt Fura',
    category: 'yogurt',
    image: P + 'concept-yogurt-fura.png',
    desc: 'Creamy yogurt with fura — chilled, fresh and familiar.',
    price: null,
    badge: 'Chilled',
    badgeTone: 'milk'
  }, {
    id: 'mix',
    name: 'Pastry Assortment',
    category: 'bakes',
    image: P + 'concept-pastries.png',
    desc: 'A mix of cupcakes, doughnuts and buns. [Selection to confirm]',
    price: null
  }, {
    id: 'box',
    name: 'Celebration Treat Box',
    category: 'celebration',
    image: P + 'concept-doughnuts.png',
    desc: 'Assorted sweet treats boxed and sealed for gifting.',
    price: null,
    from: true,
    badge: 'Gift ready',
    badgeTone: 'cocoa'
  }];
  const CATS = [{
    id: 'all',
    label: 'All treats'
  }, {
    id: 'cakes',
    label: 'Cakes'
  }, {
    id: 'bakes',
    label: 'Pastries & Banana Bread'
  }, {
    id: 'chops',
    label: 'Small Chops'
  }, {
    id: 'yogurt',
    label: 'Yogurt & Fura'
  }, {
    id: 'celebration',
    label: 'Celebration Boxes'
  }];
  const CAT_CAPTION = {
    cakes: 'Birthdays & milestones',
    bakes: 'Everyday favourites',
    chops: 'Party-ready platters',
    yogurt: 'Chilled & fresh',
    celebration: 'Gifts & bundles'
  };
  const CAT_IMG = {
    cakes: P + 'concept-cake.png',
    bakes: P + 'concept-banana-bread.png',
    chops: P + 'concept-small-chops.png',
    yogurt: P + 'concept-yogurt-fura.png',
    celebration: P + 'concept-doughnuts.png'
  };
  Object.assign(window, {
    PRODUCTS,
    CATS,
    CAT_CAPTION,
    CAT_IMG
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.IcingEdge = __ds_scope.IcingEdge;

__ds_ns.PhotoFrame = __ds_scope.PhotoFrame;

__ds_ns.RibbonRule = __ds_scope.RibbonRule;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.CategoryCard = __ds_scope.CategoryCard;

__ds_ns.Price = __ds_scope.Price;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.AnnouncementBanner = __ds_scope.AnnouncementBanner;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.OptionCard = __ds_scope.OptionCard;

__ds_ns.SelectField = __ds_scope.SelectField;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.CategoryTabs = __ds_scope.CategoryTabs;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
