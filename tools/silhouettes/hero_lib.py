import numpy as np, json, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import hero as _h
from hero import cover, meta, FD
W, H = _h.W, _h.H
BLUE=(141,187,216)
TAN_MIX=0.68
def grade(p):
    p=np.array(p,np.float32)/255
    p=np.clip((p-0.06)/0.92,0,1)**1.22                     # crush the blacks a little
    lum=p.mean(2,keepdims=True); p=lum+(p-lum)*0.78         # pull saturation back
    sh=(1-lum)**2; p=p+sh*np.array([-0.035,0.04,0.075])      # teal shadows
    hl=lum**2; p=p+hl*np.array([0.035,0.015,-0.02])         # warm highlights
    yy,xx=np.mgrid[0:p.shape[0],0:p.shape[1]]
    v=1-0.45*(((xx/p.shape[1]-0.5)*1.25)**2+((yy/p.shape[0]-0.5)*1.5)**2); p*=np.clip(v,0.5,1)[...,None]
    p+=np.random.default_rng(1).normal(0,0.018,p.shape)
    return Image.fromarray(np.clip(p*255,0,255).astype(np.uint8))
def tan(img):
    a=np.array(img.convert('RGB'),np.float32)/255; lum=(a@np.array([0.3,0.59,0.11]))[...,None]
    tone=np.array([23,35,44])/255*0.6+(np.array([240,212,160])/255-np.array([23,35,44])/255*0.6)*lum
    a=a*(1-TAN_MIX)+tone*TAN_MIX
    return Image.fromarray(np.clip(a*255,0,255).astype(np.uint8))
FRONT=False
MAXTOP=0.35   # more than this hidden at the top and the name goes to the bottom, in front
def hero(i,big,label,year=""):
    global W,H
    W,H=_h.W,_h.H
    s=Image.open(f'scaled-{i}.jpg').convert('RGB'); m=np.load(f'mask-{i}.npy').astype(np.float32)
    m=cv2.GaussianBlur(m,(0,0),1.4)
    k=max(W/s.width,H/s.height); sw,shh=int(s.width*k),int(s.height*k)
    ys,xs=np.where(m>127); cx=(xs.min()+xs.max())/2*k; ox=int(min(max(cx-W/2,0),sw-W)); oy=(shh-H)//2
    yb=ys.max()*k+20
    bh=(ys.max()-ys.min())*k
    if bh<=H-60: oy=int(min(max(yb-H,0),shh-H))                         # bike fits: keep its bottom, leave the room up top
    else: oy=int(min(max((ys.min()+ys.max())/2*k-H/2,0),shh-H))         # bike too tall for the frame: center it
    g=grade(s.resize((sw,shh),Image.LANCZOS)).crop((ox,oy,ox+W,oy+H)); g=tan(g)
    mk=Image.fromarray(m.astype(np.uint8)).resize((sw,shh),Image.LANCZOS).crop((ox,oy,ox+W,oy+H))
    bgd=np.array(g,np.float32)*0.72; base=Image.fromarray(bgd.astype(np.uint8)).convert('RGBA'); d=ImageDraw.Draw(base,'RGBA')
    M=np.array(mk)>127
    # name: Inter Black Italic, stretched edge to edge across the top of the header, behind the bike
    FONT=FD+'Inter-BlackItalic.otf'; PAD=int(W*0.02)
    f=ImageFont.truetype(FONT,400); bb=d.textbbox((0,0),big,font=f)
    f=ImageFont.truetype(FONT,int(400*(W-2*PAD)/(bb[2]-bb[0])))
    bb=d.textbbox((0,0),big,font=f)
    if bb[3]-bb[1]>H*0.42: f=ImageFont.truetype(FONT,int(f.size*H*0.42/(bb[3]-bb[1]))); bb=d.textbbox((0,0),big,font=f)
    ts=((W-(bb[2]-bb[0]))/2-bb[0], PAD-bb[1])
    # if the bike hides too much of the word up top, move it to the bottom, in front of the bike
    tm=Image.new('L',(W,H),0); ImageDraw.Draw(tm).text(ts,big,font=f,fill=255); tm=np.array(tm)>127
    hidden=(tm&M).sum()/max(tm.sum(),1)
    FRONT_NOW=hidden>MAXTOP
    if FRONT_NOW: ts=(ts[0], H-PAD-bb[3])
    txt=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(txt).text(ts,big,font=f,fill=BLUE+(240,))
    bike=g.convert('RGBA'); bike.putalpha(mk)
    if FRONT or FRONT_NOW:
        base=Image.alpha_composite(base,bike)
        sh=txt.filter(ImageFilter.GaussianBlur(10)); a=np.array(sh); a[...,:3]=0; a[...,3]=(a[...,3]*0.55).astype(np.uint8)
        base=Image.alpha_composite(base,Image.fromarray(a)); base=Image.alpha_composite(base,txt)
    else:
        base=Image.alpha_composite(base,txt); base=Image.alpha_composite(base,bike)
    d=ImageDraw.Draw(base)
    if label: d.text((30,28),label,font=ImageFont.truetype(FD+'Inter-Bold.otf',22),fill=(255,255,255))
    mm=meta[i]
    if label: d.text((W-16,H-14),f"Photo: {mm['artist']}, {mm['lic']}",font=ImageFont.truetype(FD+'Inter-Medium.otf',15),fill=(255,255,255,170),anchor='rs')
    return base.convert('RGB')
N={"honda-cb750-sohc":("CB750","1975 HONDA CB750"),"harley-street-glide-m8":("GLIDE","2019 HARLEY-DAVIDSON STREET GLIDE"),
"yamaha-xs650":("XS650","1977 YAMAHA XS650"),"kawasaki-ninja-400":("NINJA","2019 KAWASAKI NINJA 400"),
"yamaha-mt07-gen1":("MT-07","2016 YAMAHA MT-07"),"kawasaki-klr650-gen2":("KLR","2012 KAWASAKI KLR650")}
if __name__=='__main__':
    for i,(b,l) in N.items(): hero(i,b,l).save(f'hero2-{i}.png')
    ims=[Image.open(f'hero2-{i}.png').resize((600,330)) for i in N]
    sh=Image.new('RGB',(1230,3*340+10),'white')
    for n,im in enumerate(ims): sh.paste(im,(10+(n%2)*610,10+(n//2)*340))
    sh.save('/mnt/user-data/outputs/hero-graded-name.png')
