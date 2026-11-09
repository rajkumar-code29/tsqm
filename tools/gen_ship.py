#!/usr/bin/env python3
"""
Vector profile of TS Queen Mary, traced from the 1933 photograph.

Landmarks were measured off the plate (see measure step) and are mapped here
through X()/Y() so the drawing keeps the real ship's proportions:

    hull 475..2354 px, waterline y=949, funnels 1009..1080 / 1191..1265,
    foremast x=807, mainmast x=1645, funnel tops y~505, mast truck y=175
"""

K = 0.6919          # px -> user units
X0, PX0 = 60, 475   # bow
YW, PYW = 620, 949  # waterline


def X(px): return round(X0 + (px - PX0) * K, 1)
def Y(py): return round(YW - (PYW - py) * K, 1)


def windows(x1, x2, y, w, h, gap, rx=0.6):
    """Evenly spaced window row that always ends on a whole pane."""
    span = x2 - x1
    pitch = w + gap
    n = int((span + gap) // pitch)
    if n <= 0:
        return ""
    slack = (span - (n * pitch - gap)) / 2
    return "".join(
        f'<rect x="{x1 + slack + i * pitch:.1f}" y="{y:.1f}" width="{w}" height="{h}" rx="{rx}"/>'
        for i in range(n))


def stanchions(x1, x2, y, h, step=13):
    n = int((x2 - x1) // step)
    return "".join(f'<path d="M{x1 + i * step:.1f} {y:.1f}v{h}"/>' for i in range(n + 1))


def lifeboat(cx, cy, w=34, h=11):
    """Clinker boat on davits."""
    hw = w / 2
    return (f'<g><path d="M{cx-hw:.1f} {cy:.1f} q{hw:.1f} {h*1.5:.1f} {w} 0 z" fill="var(--ship-light)" '
            f'stroke="var(--ship-ink)" stroke-width="1.6"/>'
            f'<path d="M{cx-hw:.1f} {cy:.1f}h{w}" stroke="var(--ship-ink)" stroke-width="1.6"/>'
            f'<path d="M{cx-hw+2:.1f} {cy:.1f}v-7 M{cx+hw-2:.1f} {cy:.1f}v-7" '
            f'stroke="var(--ship-ink)" stroke-width="1.4" opacity=".7"/></g>')


def ventilator(cx, base, h=17, r=5.5):
    top = base - h
    return (f'<path d="M{cx-2.6:.1f} {base:.1f}v{-h+r:.1f} a{r} {r} 0 0 1 {r*2} 0 l0 {r*0.7:.1f}" '
            f'fill="none" stroke="var(--ship-ink)" stroke-width="1.8"/>')


# ---------------------------------------------------------------- geometry --
BOW_TOP   = (X(475), Y(725))
FORECASTLE_AFT = X(660)
STERN     = X(2354)

# hull: bulwark sheer, then down the counter, along the waterline, up the stem
hull = (
    f'M{X(475)} {Y(727)} '
    f'C{X(620)} {Y(733)}, {X(900)} {Y(742)}, {X(1300)} {Y(752)} '
    f'C{X(1750)} {Y(762)}, {X(2150)} {Y(772)}, {X(2354)} {Y(778)} '
    f'C{X(2372)} {Y(830)}, {X(2358)} {Y(930)}, {X(2296)} {Y(949)} '
    f'L{X(560)} {Y(949)} '
    f'C{X(512)} {Y(946)}, {X(478)} {Y(890)}, {X(475)} {Y(727)} Z')

# boot topping: dark lower hull, clipped to the hull outline
boot = (
    f'M{X(470)} {Y(858)} '
    f'C{X(900)} {Y(872)}, {X(1700)} {Y(884)}, {X(2372)} {Y(886)} '
    f'L{X(2372)} {Y(960)} L{X(468)} {Y(960)} Z')

# promenade deck house (long white band, full window row)
PROM_F, PROM_A = X(672), X(2210)
PROM_TOP, PROM_BOT = Y(700), Y(727)

# shelter / boat deck
BOAT_F, BOAT_A = X(700), X(2090)
BOAT_TOP = Y(628)

# bridge
BR_F, BR_A, BR_TOP = X(736), X(886), Y(598)

parts = []
A = parts.append

A('<!-- water -->')
A(f'<path d="M0 {YW} H1400 V700 H0 Z" fill="var(--ship-sea)"/>')

A('<!-- hull -->')
A(f'<path d="{hull}" fill="var(--ship-light)" stroke="var(--ship-ink)" stroke-width="2.6" stroke-linejoin="round"/>')
A(f'<clipPath id="hullclip"><path d="{hull}"/></clipPath>')
A(f'<g clip-path="url(#hullclip)"><path d="{boot}" fill="var(--ship-ink)"/></g>')
A(f'<path d="M{X(500)} {Y(800)} C{X(1200)} {Y(812)}, {X(1900)} {Y(822)}, {X(2330)} {Y(826)}" '
  f'fill="none" stroke="var(--ship-accent)" stroke-width="2.2" opacity=".85"/>')
# main deck window row, inside the white topside band
A(f'<g fill="var(--ship-ink)" opacity=".92">{windows(X(770), X(2160), Y(766), 10, 13, 11)}</g>')

A('<!-- promenade deck house -->')
A(f'<path d="M{PROM_F} {PROM_BOT} L{PROM_F} {PROM_TOP} '
  f'C{X(1200)} {Y(694)}, {X(1800)} {Y(700)}, {PROM_A} {Y(712)} L{PROM_A} {Y(742)}" '
  f'fill="var(--ship-light)" stroke="var(--ship-ink)" stroke-width="2.4" stroke-linejoin="round"/>')
A(f'<g fill="var(--ship-ink)" opacity=".9">{windows(X(716), X(2170), Y(704), 16, 17, 8)}</g>')

A('<!-- boat deck -->')
A(f'<path d="M{BOAT_F} {Y(700)} L{BOAT_F} {BOAT_TOP} '
  f'C{X(1300)} {Y(622)}, {X(1800)} {Y(626)}, {BOAT_A} {Y(636)} L{BOAT_A} {Y(700)}" '
  f'fill="var(--ship-light)" stroke="var(--ship-ink)" stroke-width="2.4" stroke-linejoin="round"/>')
A(f'<path d="M{PROM_F} {Y(724)} C{X(1200)} {Y(720)}, {X(1800)} {Y(726)}, {PROM_A} {Y(738)} '
  f'L{PROM_A} {Y(742)} L{PROM_F} {PROM_BOT} Z" fill="var(--ship-shade)" stroke="none" opacity=".85"/>')
A(f'<g stroke="var(--ship-ink)" stroke-width="1.3" opacity=".55" fill="none">'
  f'{stanchions(X(900), X(2080), Y(628), 15)}</g>')
A(f'<path d="M{X(900)} {Y(628)} H{X(2080)}" stroke="var(--ship-ink)" stroke-width="1.8" opacity=".8" fill="none"/>')

A('<!-- bridge and wheelhouse -->')
A(f'<path d="M{BR_F} {Y(632)} L{BR_F} {BR_TOP} L{BR_A} {BR_TOP} L{BR_A} {Y(632)} Z" '
  f'fill="var(--ship-ink)" stroke="var(--ship-ink)" stroke-width="2.2" stroke-linejoin="round"/>')
A(f'<g fill="var(--ship-light)" opacity=".85">{windows(BR_F + 6, BR_A - 6, Y(618), 8, 9, 5)}</g>')
A(f'<path d="M{X(700)} {Y(632)} H{X(900)}" stroke="var(--ship-ink)" stroke-width="2.4"/>')

A('<!-- funnels -->')
for fx1, fx2, ftop in ((1009, 1080, 505), (1191, 1265, 500)):
    x1, x2, yt, yb = X(fx1), X(fx2), Y(ftop), Y(640)
    rake = 5.5
    A(f'<path d="M{x1:.1f} {yb:.1f} L{x1+rake:.1f} {yt:.1f} L{x2+rake:.1f} {yt:.1f} L{x2:.1f} {yb:.1f} Z" '
      f'fill="var(--ship-light)" stroke="var(--ship-ink)" stroke-width="2.4" stroke-linejoin="round"/>')
    A(f'<path d="M{x1+rake*0.78:.1f} {Y(560):.1f} L{x1+rake:.1f} {yt:.1f} L{x2+rake:.1f} {yt:.1f} '
      f'L{x2+rake*0.78:.1f} {Y(560):.1f} Z" fill="var(--ship-ink)"/>')

A('<!-- steam -->')
A(f'<g fill="none" stroke="var(--ship-ink)" stroke-width="2" opacity=".22" stroke-linecap="round">'
  f'<path d="M{X(1045)} {Y(498)} c-6 -26 14 -40 6 -66 c-6 -20 12 -30 8 -48"/>'
  f'<path d="M{X(1228)} {Y(493)} c-7 -22 12 -36 5 -58 c-5 -17 10 -26 7 -42"/></g>')

A('<!-- ventilators and deck clutter -->')
for vx in (952, 1128, 1300, 1980, 2040):
    A(ventilator(X(vx), Y(632)))

A('<!-- lifeboats -->')
for bx in (1330, 1460, 1590, 1720, 1850):
    A(lifeboat(X(bx), Y(626)))

A('<!-- masts, rigging, colours -->')
FM, MM = X(807), X(1645)
A(f'<g fill="none" stroke="var(--ship-ink)" stroke-width="1.1" opacity=".45">'
  f'<path d="M{FM-2} {Y(286)} L{X(600)} {Y(700)} M{FM-2} {Y(286)} L{X(1000)} {Y(634)}"/>'
  f'<path d="M{MM-3} {Y(192)} L{X(1400)} {Y(634)} M{MM-3} {Y(192)} L{X(1930)} {Y(634)}"/>'
  f'<path d="M{MM-3} {Y(192)} L{X(2260)} {Y(760)}"/>'
  f'<path d="M{FM-2} {Y(300)} L{MM-3} {Y(205)}"/></g>')
A(f'<path d="M{FM} {Y(640)} L{FM - 3} {Y(271)}" stroke="var(--ship-ink)" stroke-width="3"/>')
A(f'<path d="M{X(760)} {Y(400)} H{X(856)}" stroke="var(--ship-ink)" stroke-width="2.2"/>')
A(f'<path d="M{MM} {Y(636)} L{MM - 4} {Y(175)}" stroke="var(--ship-ink)" stroke-width="3.2"/>')
A(f'<path d="M{X(1600)} {Y(300)} H{X(1700)}" stroke="var(--ship-ink)" stroke-width="2.2"/>')

A('<!-- masthead pennant and ensign -->')
A(f'<path d="M{MM - 4} {Y(180)} l30 9 l-30 9 z" fill="var(--ship-accent)"/>')
A(f'<path d="M{X(2318)} {Y(776)} L{X(2318)} {Y(600)}" stroke="var(--ship-ink)" stroke-width="2.2"/>')
A(f'<path d="M{X(2318)} {Y(604)} q20 -5 36 4 l0 20 q-17 -8 -36 -3 z" fill="var(--ship-accent)"/>')

A('<!-- wake -->')
A(f'<g fill="none" stroke="var(--ship-accent)" stroke-width="2" opacity=".5" stroke-linecap="round">'
  f'<path d="M{X(2300)} {Y(958)} q60 8 130 2"/>'
  f'<path d="M{X(520)} {Y(962)} q-50 6 -96 1"/>'
  f'<path d="M{X(560)} {Y(952)} q120 6 300 3" opacity=".3"/></g>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 700" role="img" aria-labelledby="tsqm-ship-title">
<title id="tsqm-ship-title">TS Queen Mary in profile, drawn from the 1933 photograph</title>
<style>
  #tsqm-ship {{
    --ship-ink: #0E1A2B;
    --ship-light: #FBFAF6;
    --ship-shade: #ECE7DC;
    --ship-accent: #B08D57;
    --ship-sea: transparent;
  }}
</style>
<g id="tsqm-ship">
{chr(10).join(parts)}
</g>
</svg>'''

import sys
out = sys.argv[1] if len(sys.argv) > 1 else "ship.svg"
open(out, "w").write(svg)
print("wrote", out, len(svg), "bytes")
