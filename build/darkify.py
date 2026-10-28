"""Dark mode for the hard-coded colors in style.css.

Most of the stylesheet uses the theme variables (--bg, --surface, --fg ...), but many later rules write colors directly
(#fff cards, #E6F1F8 tints, #17232C text). This turns each of those into a variable whose light value is the exact original
color, so light mode doesn't change at all, and adds a dark value for each one under :root[data-theme="dark"].
Rules for paper-like documents (reports, work orders, bills of sale), parts art and print styles are left alone.
"""
import re, colorsys

PAPER = '.hr-doc,.wo-doc,#bosHost,.rp-prev,.bp-prev,.herophoto,.rs-art,.ct-img'
KEEP_SEL = re.compile(r'hr-doc|wo-doc|rp-doc|rp-prev|bos|bp-prev|sticker|stk-|printing|\.art\b|art-|diag|d3stage|twin|tw-|viewer|silh|herophoto')
PROPS = re.compile(r'(--[\w-]+|background(?:-color|-image)?|color|border(?:-top|-bottom|-left|-right)?(?:-color)?|outline(?:-color)?|fill|stroke|box-shadow|text-decoration-color|caret-color|accent-color)\s*:')
COLOR = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)|\bwhite\b')


def parse(c):
    c = c.strip()
    if c == 'white': return (255, 255, 255, None)
    if c.startswith('#'):
        h = c[1:]
        if len(h) in (3, 4): h = ''.join(x * 2 for x in h)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else None
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
    n = [x.strip() for x in c[c.index('(') + 1:-1].split(',')]
    return (int(n[0]), int(n[1]), int(n[2]), float(n[3]) if len(n) > 3 else None)


def fmt(r, g, b, a):
    r, g, b = (max(0, min(255, round(x))) for x in (r, g, b))
    return f'rgba({r},{g},{b},{a:g})' if a is not None else f'#{r:02X}{g:02X}{b:02X}'


def hls(r, g, b): return colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
def rgb(h, l, s): return tuple(x * 255 for x in colorsys.hls_to_rgb(h, l, s))


def dark_of(kind, c):
    r, g, b, a = parse(c)
    h, l, s = hls(r, g, b)
    if s < .08: h, s = .57, .25          # greys and white take the navy hue so dark surfaces match the brand
    if kind == 'bg':           # surfaces: light -> dark of the same hue, dark brand navy stays dark but lifts off the page
        if a is not None and l > .8 and a < .5:          # faint white glass over dark heroes: keep
            return None
        if l >= .62: return fmt(*rgb(h, .125 + (1 - l) * .55, min(s, .32)), a)
        if l <= .3 and s < .45: return fmt(*rgb(h, max(l, .14) + .05, min(s, .3)), a)
        return None
    if kind == 'cvar':         # only light tints change; brand navy/tan/blue accents stay as they are
        return dark_of('bg', c) if l >= .86 else None
    if kind == 'line':         # borders and outlines (see-through light lines are drawn for dark heroes already)
        if a is not None and a < .5 and l > .8: return None
        if l >= .62: return fmt(*rgb(h, .22 + (1 - l) * .35, min(s, .3)), a)
        if l <= .3 and s < .45: return fmt(*rgb(h, .34, min(s, .25)), a)
        return None
    if kind == 'ink':          # text, icon fill and stroke: dark ink turns light, white stays white
        if l <= .5 and not (s > .55 and l > .35): return fmt(*rgb(h, min(.93, .9 - l * .35), min(s, .45)), a)
        if l < .62 and s > .3: return fmt(*rgb(h, .72, min(s, .55)), a)
        return None
    return None


def kind_of(prop):
    if prop.startswith('--'):     # colors kept in a rule's own variables: tints are surfaces, *-ink is text
        return 'ink' if prop.endswith('ink') else 'cvar'
    if prop.startswith('background'): return 'bg'
    if prop.startswith(('border', 'outline')): return 'line'
    if prop == 'box-shadow': return None
    return 'ink'


def darkify(css):
    names, out, i, stack = {}, [], 0, []
    # walk rule by rule so selectors and @media context are known
    tok = re.compile(r'([^{}]*)\{|\}')
    pos = 0
    for m in tok.finditer(css):
        if m.group(0) == '}':
            out.append(css[pos:m.end()]); pos = m.end()
            if stack: stack.pop()
            continue
        head = m.group(1)
        out.append(css[pos:m.start()])
        sel = re.sub(r'/\*.*?\*/', '', head, flags=re.S).strip()
        if sel.startswith('@'):
            stack.append(sel); out.append(head + '{'); pos = m.end(); continue
        # declarations of this rule run to the next brace
        end = css.index('}', m.end())
        decls = css[m.end():end]
        skip = any('print' in x for x in stack) or sel.startswith(':root') or KEEP_SEL.search(sel)
        if not skip:
            def fix_decl(dm):
                prop = dm.group(1); kind = kind_of(prop)
                return dm.group(0)
            parts = re.split(r'(;)', decls)
            new = []
            # text on a fixed accent fill (tan or blue buttons, colored badges) keeps its dark ink
            bgm = re.search(r'background(?:-color)?\s*:([^;]*)', decls)
            accent = False
            if bgm:
                bv = bgm.group(1)
                if re.search(r'var\(--(b-)?(tan|blue|st-\w+|green|red|amber)(-2)?\)', bv) and 'gradient' not in bv: accent = True
                for c in COLOR.findall(bv):
                    if dark_of('bg', c) is None and hls(*parse(c)[:3])[1] > .45 and (parse(c)[3] is None or parse(c)[3] > .6): accent = True
            for p in parts:
                pm = PROPS.match(p.strip())
                if pm and kind_of(pm.group(1)) and not (accent and kind_of(pm.group(1)) == 'ink'):
                    kind = kind_of(pm.group(1))
                    def rep(cm):
                        c = cm.group(0); d = dark_of(kind, c)
                        if d is None: return c
                        key = (kind, c.lower().replace(' ', ''))
                        if key not in names: names[key] = ('--dk%d' % len(names), c, d)
                        return 'var(%s)' % names[key][0]
                    p = COLOR.sub(rep, p)
                    if kind == 'ink':
                        p = re.sub(r'var\(--(navy|navy-2|b-navy)\)', lambda v: 'var(--ink-' + v.group(1) + ')', p)
                new.append(p)
            decls = ''.join(new)
        stack.append(sel)
        out.append(head + '{' + decls); pos = end
    out.append(css[pos:])
    light = ';'.join([f'{n}:{c}' for n, c, d in names.values()] + ['--ink-navy:var(--navy)', '--ink-navy-2:var(--navy-2)', '--ink-b-navy:var(--b-navy,#17232C)'])
    dark = ';'.join([f'{n}:{d}' for n, c, d in names.values()] + ['--ink-navy:var(--fg)', '--ink-navy-2:#C9D4DB', '--ink-b-navy:var(--fg)'])
    # paper documents and bike art stay light inside dark mode: give them back every light value
    base = {}
    for m in re.finditer(r':root\s*\{([^}]*)\}', css):
        for k, v in re.findall(r'(--[\w-]+)\s*:\s*([^;]+)', m.group(1)): base[k] = v.strip()
    base.update({n: c for n, c, d in names.values()})
    base.update({'--b-blue-soft': '#E6F1F8', '--b-tan-soft': '#F6EEDD', '--ink-navy': '#111418', '--ink-navy-2': '#2A3037', '--ink-b-navy': '#17232C'})
    paper = ':root[data-theme="dark"] :is(' + PAPER + '){' + ';'.join(f'{k}:{v}' for k, v in base.items()) + ';color-scheme:light;color:var(--fg)}'
    return f':root{{{light}}}\n:root[data-theme="dark"]{{{dark}}}\n' + ''.join(out) + '\n' + paper + '\n', len(names)
