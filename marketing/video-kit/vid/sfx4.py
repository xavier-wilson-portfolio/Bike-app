# muted, low, mechanical foley. no tonal sweeps, no bright ticks, no music.
import numpy as np, scipy.signal as sg
from scipy.io import wavfile
SR=48000; N=int(SR*30.0); rng=np.random.default_rng(11)
def bp(x,lo,hi,o=2): b,a=sg.butter(o,[lo/(SR/2),hi/(SR/2)],"band"); return sg.lfilter(b,a,x)
def lp(x,f,o=2): b,a=sg.butter(o,f/(SR/2)); return sg.lfilter(b,a,x)
L=int(SR*.4); ir=lp(rng.standard_normal(L),3500)*np.exp(-np.arange(L)/SR/.09)
def room(x,wet=.15):
    y=sg.fftconvolve(x,ir); y=y/np.abs(y).max()*np.abs(x).max(); d=np.pad(x,(0,len(y)-len(x))); return d*(1-wet)+y*wet
def tap():  # dull thock, like a finger on a padded button
    n=int(SR*.05); t=np.arange(n)/SR
    return room(lp(bp(rng.standard_normal(n),150,1400),1000)*np.exp(-t/.006)*.9)
def swipe():  # low card slide, dry, no pitch movement
    n=int(SR*.38); t=np.arange(n)/n
    return room(lp(bp(rng.standard_normal(n),180,1500),1100)*np.sin(np.pi*t)**2*.32,.1)
def air(dur=.6,g=.16):  # deep air pass on cuts
    n=int(SR*dur); t=np.arange(n)/n
    return lp(bp(rng.standard_normal(n),60,700),500,4)*np.sin(np.pi*t)**3*g
def shutter():  # mechanical double click, muted
    a=tap(); o=np.zeros(len(a)+int(SR*.07)); o[:len(a)]+=a; j=int(SR*.06); o[j:j+len(a)]+=a*.7; return o
def hit():  # low, short impact for the logo
    n=int(SR*1.0); t=np.arange(n)/SR
    return room(lp(rng.standard_normal(n),140,4)*np.exp(-t/.16)*1.4+lp(rng.standard_normal(n),400)*np.exp(-t/.02)*.4,.3)
out=np.zeros(N+SR)
def add(x,at,g=1.0): i=int(at*SR); out[i:i+len(x)]+=x*g
for t in [2.4,7.4,11.6,17.0,22.6]: add(air(),t-.35)
add(air(.9,.2),26.2-.6)
for t in [5.16,9.1,17.47,18.1,21.07,23.5,24.37]: add(tap(),t)
for t in [12.55,13.75,14.9]: add(swipe(),t-.08)
add(shutter(),18.95,.85); add(hit(),26.22)
out=out[:N]; out=out/np.abs(out).max()*.5
wavfile.write("sfx4.wav",SR,(np.stack([out,out],1)*32767).astype(np.int16)); print("ok")
