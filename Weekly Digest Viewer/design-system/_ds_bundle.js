/* @ds-bundle: {"format":4,"namespace":"WeeklyDigestDesignSystem_6fb441","components":[{"name":"ArticleCard","sourcePath":"components/content/ArticleCard.jsx"},{"name":"ArticleList","sourcePath":"components/content/ArticleList.jsx"},{"name":"DigestMeta","sourcePath":"components/content/DigestMeta.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"ErrorNotice","sourcePath":"components/feedback/ErrorNotice.jsx"},{"name":"SkeletonArticle","sourcePath":"components/feedback/SkeletonArticle.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"TopicTabs","sourcePath":"components/navigation/TopicTabs.jsx"}],"sourceHashes":{"components/content/ArticleCard.jsx":"9a2f3c9ac632","components/content/ArticleList.jsx":"3b12e92377a3","components/content/DigestMeta.jsx":"7252b4694f5e","components/core/Badge.jsx":"8bd71dba1e7c","components/core/Button.jsx":"014f4266f64e","components/core/Card.jsx":"91139e22f4d2","components/core/Divider.jsx":"f481443652c3","components/core/IconButton.jsx":"0228e1172c87","components/core/Tag.jsx":"3290965c7049","components/feedback/EmptyState.jsx":"7d2b350b8b97","components/feedback/ErrorNotice.jsx":"c8e9659ad358","components/feedback/SkeletonArticle.jsx":"0a7d7c6c3035","components/navigation/SiteHeader.jsx":"205a7f5c114f","components/navigation/TopicTabs.jsx":"7d4944452688","ui_kits/website/DigestApp.jsx":"22d2fdaa66a7","ui_kits/website/DigestPanel.jsx":"2f15ac17a179","ui_kits/website/sample-data.js":"60f4ea2a0a43"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WeeklyDigestDesignSystem_6fb441 = window.WeeklyDigestDesignSystem_6fb441 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/DigestMeta.jsx
try { (() => {
function fmt(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
function DigestMeta({
  topicName,
  runDate,
  count,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--text-primary)',
      margin: 0,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, topicName), runDate && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)'
    }
  }, fmt(runDate)), typeof count === 'number' && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, count, " ", count === 1 ? 'article' : 'articles'));
}
Object.assign(__ds_scope, { DigestMeta });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/DigestMeta.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = 'neutral',
  style,
  children,
  ...rest
}) {
  const map = {
    neutral: ['var(--text-secondary)', 'var(--border-subtle)'],
    accent: ['var(--clay-700)', 'var(--clay-300)'],
    info: ['var(--indigo-600)', 'var(--indigo-300)'],
    success: ['var(--teal-600)', 'var(--teal-300)'],
    warning: ['var(--amber-500)', 'var(--amber-500)'],
    danger: ['var(--rust-600)', 'var(--rust-600)']
  };
  const [fg, bd] = map[tone] || map.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 'var(--radius-xs)',
      color: fg,
      border: '1px solid ' + bd,
      background: 'transparent',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  font: 'var(--type-ui)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'var(--transition-color),var(--transition-raise)',
  textDecoration: 'none',
  whiteSpace: 'nowrap'
};
const sizes = {
  sm: {
    padding: '6px 12px',
    fontSize: 'var(--text-xs)'
  },
  md: {
    padding: '9px 16px',
    fontSize: 'var(--text-sm)'
  },
  lg: {
    padding: '12px 22px',
    fontSize: 'var(--text-base)'
  }
};
const variants = {
  primary: {
    background: 'var(--accent-primary)',
    color: 'var(--text-inverse)',
    borderColor: 'var(--accent-primary)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-subtle)',
    boxShadow: 'var(--shadow-card)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-accent)'
  },
  quiet: {
    background: 'var(--surface-sunken)',
    color: 'var(--text-body)'
  }
};
const hovers = {
  primary: {
    background: 'var(--accent-primary-hover)',
    borderColor: 'var(--accent-primary-hover)'
  },
  secondary: {
    borderColor: 'var(--border-strong)',
    boxShadow: 'var(--shadow-raised)'
  },
  ghost: {
    background: 'var(--surface-accent-soft)'
  },
  quiet: {
    background: 'var(--sand-300)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  href,
  iconLeft,
  iconRight,
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    ...(press && !disabled ? {
      transform: 'translateY(1px)'
    } : null),
    ...(disabled ? {
      opacity: .45,
      cursor: 'not-allowed',
      boxShadow: 'none'
    } : null),
    ...style
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  as = 'div',
  padding = 'var(--space-6)',
  interactive = false,
  accent,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderLeft: accent ? '3px solid ' + accent : '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding,
      boxShadow: interactive && hover ? 'var(--shadow-raised)' : 'var(--shadow-card)',
      transform: interactive && hover ? 'translateY(-1px)' : 'none',
      transition: 'var(--transition-raise)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function Divider({
  label,
  spacing = 'var(--space-6)',
  style
}) {
  if (!label) return /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      borderTop: '1px solid var(--border-subtle)',
      margin: spacing + ' 0',
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      margin: spacing + ' 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-subtle)'
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const bg = variant === 'solid' ? 'var(--accent-primary)' : variant === 'outline' ? 'var(--surface-card)' : 'transparent';
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: dim,
      height: dim,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      border: variant === 'outline' ? '1px solid var(--border-subtle)' : '1px solid transparent',
      background: hover && !disabled ? variant === 'solid' ? 'var(--accent-primary-hover)' : 'var(--surface-sunken)' : bg,
      color: variant === 'solid' ? 'var(--text-inverse)' : 'var(--text-secondary)',
      transition: 'var(--transition-color)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: {
    bg: 'var(--surface-sunken)',
    fg: 'var(--text-secondary)',
    bd: 'transparent'
  },
  technology: {
    bg: 'var(--topic-technology-soft)',
    fg: 'var(--indigo-700)',
    bd: 'transparent'
  },
  finance: {
    bg: 'var(--topic-finance-soft)',
    fg: 'var(--teal-700)',
    bd: 'transparent'
  },
  politics: {
    bg: 'var(--topic-politics-soft)',
    fg: 'var(--clay-800)',
    bd: 'transparent'
  },
  outline: {
    bg: 'transparent',
    fg: 'var(--text-secondary)',
    bd: 'var(--border-subtle)'
  }
};
function Tag({
  tone = 'neutral',
  size = 'md',
  style,
  children,
  ...rest
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      font: 'var(--type-ui)',
      fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)',
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      border: '1px solid ' + t.bd,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/content/ArticleCard.jsx
try { (() => {
function ArticleCard({
  article,
  topic = 'neutral',
  index,
  feedUrl,
  style
}) {
  const {
    title,
    link,
    summary,
    themes = [],
    entities = []
  } = article || {};
  const source = feedUrl || article && article.feedUrl || link;
  const openSource = () => {
    if (source) window.open(source, '_blank', 'noopener');
  };
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    as: "article",
    interactive: true,
    accent: topic !== 'neutral' ? 'var(--topic-' + topic + ')' : undefined,
    onDoubleClick: openSource,
    title: "Double-click to open the source feed",
    style: style
  }, typeof index === 'number' && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: 'var(--tracking-wide)',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-2)'
    }
  }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 var(--space-3)',
      font: 'var(--type-headline)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: link,
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, title)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-4)',
      font: 'var(--type-body)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure-prose)'
    }
  }, summary), (themes.length > 0 || entities.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      alignItems: 'center'
    }
  }, themes.map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: t,
    tone: topic
  }, t)), entities.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-muted)',
      marginLeft: 'var(--space-1)'
    }
  }, entities.join(' · '))));
}
Object.assign(__ds_scope, { ArticleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ArticleCard.jsx", error: String((e && e.message) || e) }); }

// components/content/ArticleList.jsx
try { (() => {
function ArticleList({
  articles = [],
  topic = 'neutral',
  numbered = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      ...style
    }
  }, articles.map((a, i) => /*#__PURE__*/React.createElement(__ds_scope.ArticleCard, {
    key: a.link || i,
    article: a,
    topic: topic,
    index: numbered ? i : undefined,
    feedUrl: a.feedUrl
  })));
}
Object.assign(__ds_scope, { ArticleList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ArticleList.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function EmptyState({
  title = 'No new articles this week.',
  detail,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-raised)',
      padding: 'var(--space-10) var(--space-6)',
      textAlign: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-headline)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-secondary)'
    }
  }, title), detail && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-2) 0 0',
      font: 'var(--type-ui)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, detail), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ErrorNotice.jsx
try { (() => {
const KIND_LABEL = {
  not_found: 'Not published yet',
  rate_limited: 'Rate limited',
  network: 'Network'
};
function ErrorNotice({
  kind = 'network',
  message,
  action,
  style
}) {
  const soft = kind === 'rate_limited';
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      border: '1px solid ' + (soft ? 'var(--status-notice-fg)' : 'var(--status-error-fg)'),
      background: soft ? 'var(--status-notice-bg)' : 'var(--status-error-bg)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5) var(--space-6)',
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: soft ? 'warning' : 'danger',
    style: {
      flex: '0 0 auto',
      marginTop: 2
    }
  }, KIND_LABEL[kind] || 'Error'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)'
    }
  }, message), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)'
    }
  }, action)));
}
Object.assign(__ds_scope, { ErrorNotice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ErrorNotice.jsx", error: String((e && e.message) || e) }); }

// components/feedback/SkeletonArticle.jsx
try { (() => {
const bar = (w, h, mb) => ({
  width: w,
  height: h,
  marginBottom: mb,
  borderRadius: 'var(--radius-xs)',
  background: 'linear-gradient(90deg,var(--sand-200) 0%,var(--sand-100) 50%,var(--sand-200) 100%)',
  backgroundSize: '200% 100%',
  animation: 'wd-shimmer 1.4s var(--ease-in-out) infinite'
});
function SkeletonArticle({
  count = 3,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes wd-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}'), Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bar('64px', '10px', 'var(--space-3)')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('70%', '18px', 'var(--space-3)')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('100%', '12px', 'var(--space-2)')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('88%', '12px', 'var(--space-4)')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bar('72px', '20px', 0)
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('96px', '20px', 0)
  })))));
}
Object.assign(__ds_scope, { SkeletonArticle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/SkeletonArticle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function SiteHeader({
  title = "Maan's Weekly Digest",
  tagline,
  right,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-raised)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--layout-max)',
      margin: '0 auto',
      padding: 'var(--space-5) var(--layout-gutter)',
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-headline)',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, title), tagline && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, tagline), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), right));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopicTabs.jsx
try { (() => {
const ACCENT = {
  technology: 'var(--topic-technology)',
  finance: 'var(--topic-finance)',
  politics: 'var(--topic-politics)'
};
function TopicTabs({
  topics = [],
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, topics.map(t => {
    const on = t.slug === active;
    const accent = ACCENT[t.slug] || 'var(--accent-primary)';
    return /*#__PURE__*/React.createElement("button", {
      key: t.slug,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(t.slug),
      style: {
        appearance: 'none',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        padding: '0 0 12px',
        font: 'var(--type-ui)',
        fontSize: 'var(--text-sm)',
        letterSpacing: 'var(--tracking-wide)',
        color: on ? 'var(--text-primary)' : 'var(--text-muted)',
        boxShadow: on ? 'inset 0 -2px 0 ' + accent : 'none',
        transition: 'var(--transition-color)'
      }
    }, t.name);
  }));
}
Object.assign(__ds_scope, { TopicTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopicTabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/DigestApp.jsx
try { (() => {
function DigestApp() {
  const {
    SiteHeader,
    TopicTabs,
    Button,
    IconButton,
    Tag
  } = window.WeeklyDigestDesignSystem_6fb441;
  const [slug, setSlug] = React.useState('finance');
  const [loading, setLoading] = React.useState(false);
  const [errorMode, setErrorMode] = React.useState(false);
  const result = errorMode && slug === 'politics' ? window.ERROR_SAMPLE : window.DIGESTS[slug];
  function refresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1100);
  }
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    right: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: refresh,
      iconLeft: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "rotate-cw",
        style: {
          width: 14,
          height: 14
        }
      })
    }, "Refresh"), /*#__PURE__*/React.createElement(IconButton, {
      label: "Source repository",
      variant: "outline"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "bird",
      style: {
        width: 16,
        height: 16
      }
    })))
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--layout-max)',
      margin: '0 auto',
      padding: 'var(--space-10) var(--layout-gutter) var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--layout-reading)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display)',
      fontSize: 'var(--text-3xl)',
      color: 'var(--text-primary)',
      margin: '0 0 var(--space-3)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "The week, summarised"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      margin: 0,
      maxWidth: 'var(--measure-prose)'
    }
  }, "An automated pipeline reads the week's coverage across three topics, summarises each article, and pulls out the themes and entities that recur. Published every Monday.")), /*#__PURE__*/React.createElement(TopicTabs, {
    topics: window.TOPICS,
    active: slug,
    onChange: setSlug,
    style: {
      marginTop: 'var(--space-10)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 232px',
      gap: 'var(--space-10)',
      alignItems: 'start',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(DigestPanel, {
    result: result,
    loading: loading
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'sticky',
      top: 'var(--space-6)',
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-3)'
    }
  }, "Recurring themes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)'
    }
  }, [...new Set((window.DIGESTS[slug].articles || []).flatMap(a => a.themes))].map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t,
    tone: slug
  }, t)), (window.DIGESTS[slug].articles || []).length === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "None this week"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-3)'
    }
  }, "Digest states"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: loading ? 'primary' : 'quiet',
    size: "sm",
    onClick: refresh
  }, "Loading"), /*#__PURE__*/React.createElement(Button, {
    variant: errorMode ? 'primary' : 'quiet',
    size: "sm",
    onClick: () => {
      setErrorMode(!errorMode);
      setSlug('politics');
    }
  }, "Rate-limited"), /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    size: "sm",
    onClick: () => {
      setErrorMode(false);
      setSlug('politics');
    }
  }, "Empty week")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-ui)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)',
      lineHeight: 1.5
    }
  }, "Demo controls \u2014 not part of the shipped site."))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-raised)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--layout-max)',
      margin: '0 auto',
      padding: 'var(--space-6) var(--layout-gutter)',
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--type-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Maan's Weekly Digest"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "Generated from MyPortfolio / 02-weekly-digest-pipeline"))));
}
window.DigestApp = DigestApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/DigestApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/DigestPanel.jsx
try { (() => {
function DigestPanel({
  result,
  loading
}) {
  const {
    DigestMeta,
    ArticleList,
    EmptyState,
    ErrorNotice,
    SkeletonArticle,
    Button,
    Divider
  } = window.WeeklyDigestDesignSystem_6fb441;
  const slug = result.topic.slug;
  if (loading) return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DigestMeta, {
    topicName: result.topic.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(SkeletonArticle, {
    count: 3
  })));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DigestMeta, {
    topicName: result.topic.name,
    runDate: result.runDate,
    count: result.status === 'ready' ? result.articles.length : undefined
  }), /*#__PURE__*/React.createElement(Divider, {
    spacing: "var(--space-5)"
  }), result.status === 'ready' && /*#__PURE__*/React.createElement(ArticleList, {
    articles: result.articles,
    topic: slug
  }), result.status === 'empty' && /*#__PURE__*/React.createElement(EmptyState, {
    detail: 'The pipeline ran and found nothing new for ' + result.topic.name.toLowerCase() + ' this week.',
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Browse last week")
  }), result.status === 'error' && /*#__PURE__*/React.createElement(ErrorNotice, {
    kind: result.error.kind,
    message: result.error.message,
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Try again")
  }));
}
window.DigestPanel = DigestPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/DigestPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/sample-data.js
try { (() => {
// Stand-in for loadAllDigests(). Same shape as DigestResult in digest-data.js.
// Content is illustrative — the live site reads real digests from the MyPortfolio repo.
window.TOPICS = [{
  slug: 'technology',
  name: 'Technology'
}, {
  slug: 'finance',
  name: 'Finance'
}, {
  slug: 'politics',
  name: 'Politics'
}];
window.DIGESTS = {
  technology: {
    status: 'ready',
    topic: {
      slug: 'technology',
      name: 'Technology'
    },
    runDate: '2026-08-24',
    error: null,
    articles: [{
      title: 'Open-weight models close the gap on reasoning benchmarks',
      link: '#',
      summary: 'Two open-weight releases posted scores within a few points of the leading closed models on public reasoning suites, at roughly a tenth of the inference cost. Independent evaluations are still pending.',
      themes: ['open models', 'benchmarks'],
      entities: ['Meta', 'Mistral', 'Hugging Face']
    }, {
      title: 'Chip supply loosens as new packaging capacity comes online',
      link: '#',
      summary: 'Advanced packaging lines that had bottlenecked accelerator output through the spring reached volume this month, easing lead times for datacentre buyers from nine months to five.',
      themes: ['semiconductors', 'supply chain'],
      entities: ['TSMC', 'Nvidia']
    }, {
      title: 'Browser vendors agree on a shared extension manifest',
      link: '#',
      summary: 'A working group published a common manifest format, ending three years of divergence. Existing extensions get a two-year migration window.',
      themes: ['standards', 'browsers'],
      entities: ['W3C', 'Google', 'Mozilla']
    }]
  },
  finance: {
    status: 'ready',
    topic: {
      slug: 'finance',
      name: 'Finance'
    },
    runDate: '2026-08-25',
    error: null,
    articles: [{
      title: 'Central banks hold rates steady as inflation cools',
      link: '#',
      summary: 'Three major central banks left policy unchanged this week, citing a slower but still-uneven decline in core inflation. Guidance pointed to a first cut late in the year rather than at the next meeting.',
      themes: ['interest rates', 'inflation'],
      entities: ['Federal Reserve', 'ECB', 'Bank of Japan']
    }, {
      title: 'Private credit funds face their first real test',
      link: '#',
      summary: 'Default rates in mid-market lending ticked above their five-year average for the first time since the sector\u2019s expansion began, drawing supervisory attention.',
      themes: ['private credit', 'risk'],
      entities: ['BIS', 'Blackstone']
    }, {
      title: 'Retail earnings split along price tiers',
      link: '#',
      summary: 'Discount chains beat expectations while mid-tier apparel guided down, a divergence analysts read as continued trading-down by middle-income households.',
      themes: ['earnings', 'consumer'],
      entities: ['Walmart', 'Target']
    }, {
      title: 'Bond markets price a slower easing cycle',
      link: '#',
      summary: 'Two-year yields rose eight basis points on the week as futures pushed the expected first cut into the fourth quarter.',
      themes: ['bonds'],
      entities: ['US Treasury']
    }]
  },
  politics: {
    status: 'empty',
    topic: {
      slug: 'politics',
      name: 'Politics'
    },
    runDate: '2026-08-25',
    error: null,
    articles: []
  }
};
window.ERROR_SAMPLE = {
  status: 'error',
  topic: {
    slug: 'politics',
    name: 'Politics'
  },
  runDate: null,
  articles: [],
  error: {
    kind: 'rate_limited',
    message: 'GitHub API rate limit hit, resets at 4:15:00 PM.'
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/sample-data.js", error: String((e && e.message) || e) }); }

__ds_ns.ArticleCard = __ds_scope.ArticleCard;

__ds_ns.ArticleList = __ds_scope.ArticleList;

__ds_ns.DigestMeta = __ds_scope.DigestMeta;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.ErrorNotice = __ds_scope.ErrorNotice;

__ds_ns.SkeletonArticle = __ds_scope.SkeletonArticle;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.TopicTabs = __ds_scope.TopicTabs;

})();
