import numpy as np, scipy.signal as sg
from scipy.io import wavfile
SR=48000; B=60/110
TD={'strips':.30,'iris':.30,'cube':.36,'zoom':.30,'diag':.30,'spin':.32,'split':.30,'flip':.34,'push':.27,'pushL':.18,'pushR':.18,'flash':.001}
segs=[('card',2,'strips'),('card',2,'iris'),('shot',2,'cube'),('card',2,'zoom'),('shot',2,'diag'),('card',2,'spin'),('shot',3,'split'),('card',2,'flip'),('shot',2,'push'),('card',2,'iris'),('shot',2,'strips'),('grid',3,'zoom'),('shot',2,'cube'),('shot',.5,'pushL'),('shot',.5,'pushR'),('shot',.5,'pushL'),('shot',.5,'flash')]
END=sum(s[1] for s in segs)*B; TOT=END+3.6; N=int(TOT*SR)+SR
rng=np.random.default_rng(5); L=np.zeros(N); R=np.zeros(N)
def bp(x,lo,hi): b,a=sg.butter(2,[lo/(SR/2),hi/(SR/2)],'band'); return sg.lfilter(b,a,x)
def lp(x,f): b,a=sg.butter(2,f/(SR/2)); return sg.lfilter(b,a,x)
def add(x,t,g=1.0,pan=0.0):
    i=int(t*SR); n=min(len(x),N-i); l=np.cos((pan+1)*np.pi/4); r=np.sin((pan+1)*np.pi/4)
    L[i:i+n]+=x[:n]*g*l*1.41; R[i:i+n]+=x[:n]*g*r*1.41
def whoosh(d):  # crisp swish: band sweeping up, sharp tail
    n=int((d+0.12)*SR); t=np.arange(n)/n; x=rng.standard_normal(n); y=np.zeros(n); blk=256
    for i in range(0,n,blk):
        f=500+5000*t[i]**1.3; y[i:i+blk]=bp(x[i:i+blk],f*0.6,min(f*1.6,20000))
    env=np.sin(np.pi*np.clip(t*1.15,0,1))**2*np.exp(-t*1.2); return y*env*0.55
def impact():
    n=int(SR*.32); t=np.arange(n)/SR
    body=np.sin(2*np.pi*(95*np.exp(-t*9)+45)*t)*np.exp(-t/.07)
    click=bp(rng.standard_normal(n),1500,7000)*np.exp(-t/.004)*0.6
    return (body*0.9+click)*0.8
def tick():
    n=int(SR*.04); t=np.arange(n)/SR; return bp(rng.standard_normal(n),2500,9000)*np.exp(-t/.0035)*0.5
def thud():
    n=int(SR*.4); t=np.arange(n)/SR; return (np.sin(2*np.pi*(70*np.exp(-t*6)+38)*t)*np.exp(-t/.11)+lp(rng.standard_normal(n),250)*np.exp(-t/.03)*.5)*0.9
def snap():
    n=int(SR*.12); t=np.arange(n)/SR; a=bp(rng.standard_normal(n),1200,9000)*np.exp(-t/.006); o=np.zeros(n+int(.045*SR)); o[:n]+=a; o[int(.045*SR):]+=a*.7; return o*0.6
t=0; din=0
for k,(kind,b,tr) in enumerate(segs):
    st=t; du=b*B
    if kind=='card':
        for w in range(2): add(impact(), st+din+0.02+w*0.12+0.12, 0.55 if w==0 else 0.7)
    if kind=='grid':
        for i in range(4): add(tick(), st+din+i*B*0.5+0.05, 0.9); add(impact()*0.4, st+din+i*B*0.5+0.06,0.6)
    d=TD[tr]; ts=st+du-d
    if k<len(segs)-1 or tr!='flash':
        if tr=='flash': add(snap(), st+du-0.02, 1.0)
        else:
            pan={'pushL':-0.7,'pushR':0.7}.get(tr,0.0)
            add(whoosh(d), ts-0.04, 0.8 if tr not in('pushL','pushR') else 0.6, pan)
        if tr=='strips':
            for j in range(4): add(tick(), ts+j*0.05, 0.7, (j%2-.5))
        if tr=='cube': add(thud(), st+du-0.01, 0.8)
        if tr=='split': add(thud()*0.6, ts+0.02, 0.7)
        if tr=='iris': add(tick(), ts, 0.6)
    t+=du; din=d
# outro: snap/flash into logo, soft swish as R slides, hit as ring completes
add(snap(), END, 0.8); add(whoosh(0.5), END+0.45, 0.45); add(impact(), END+1.62, 0.7)
m=np.stack([L,R],1)[:int(TOT*SR)]; m=m/np.abs(m).max()*0.8
wavfile.write('sfx.wav',SR,(m*32767).astype(np.int16)); print(round(END,2), round(TOT,2))
