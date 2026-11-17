import cv2, numpy as np, json, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
NAVY=(23,35,44); TAN=(217,191,142); LB=(185,217,235)
FD='/usr/share/fonts/opentype/inter/'
W,H=1200,660
meta=json.load(open('meta.json'))
def cutout(i):
    s=cv2.imread(f'scaled-{i}.jpg'); m=np.load(f'mask-{i}.npy').astype(np.float32)/255
    m=cv2.GaussianBlur(m,(0,0),1.6)
    ys,xs=np.where(m>0.5); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    rgba=np.dstack([cv2.cvtColor(s,cv2.COLOR_BGR2RGB),(m*255).astype(np.uint8)])[y0:y1+1,x0:x1+1]
    return Image.fromarray(rgba,'RGBA')
def photo(i):
    return Image.open('scaled-'+i+'.jpg').convert('RGB')
def cover(img,w,h):
    k=max(w/img.width,h/img.height); img=img.resize((int(img.width*k),int(img.height*k)),Image.LANCZOS)
    x=(img.width-w)//2; y=(img.height-h)//2; return img.crop((x,y,x+w,y+h))
def credit(d,i,fill=(255,255,255,150)):
    m=meta[i]; d.text((W-16,H-14),f"Photo: {m['artist']}, {m['lic']}",font=ImageFont.truetype(FD+'Inter-Medium.otf',15),fill=fill,anchor='rs')
def name_card(i,big,label):
    bg=Image.new('RGB',(W,H),NAVY); g=np.zeros((H,W,3),np.float32)
    yy,xx=np.mgrid[0:H,0:W]; r=np.sqrt(((xx-W*0.55)/W)**2+((yy-H*0.45)/H)**2)
    g=np.clip(1-r*1.6,0,1)[...,None]*np.array([30,45,58])
    bg=Image.fromarray(np.clip(np.array(bg,np.float32)+g,0,255).astype(np.uint8))
    d=ImageDraw.Draw(bg,'RGBA')
    f=ImageFont.truetype(FD+'InterDisplay-Black.otf',300); tw=d.textlength(big,font=f)
    if tw>W*0.95: f=ImageFont.truetype(FD+'InterDisplay-Black.otf',int(300*W*0.95/tw))
    d.text((W/2,H*0.40),big,font=f,fill=TAN+(70,),anchor='mm')
    c=cutout(i); k=min(W*0.84/c.width,H*0.74/c.height); c=c.resize((int(c.width*k),int(c.height*k)),Image.LANCZOS)
    x=(W-c.width)//2; y=int(H*0.9)-c.height
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(sh).ellipse((x+c.width*0.08,y+c.height-18,x+c.width*0.92,y+c.height+22),fill=(0,0,0,150))
    bg=Image.alpha_composite(bg.convert('RGBA'),sh.filter(ImageFilter.GaussianBlur(14)))
    bg.alpha_composite(c,(x,y))
    d=ImageDraw.Draw(bg); d.text((28,28),label,font=ImageFont.truetype(FD+'Inter-Bold.otf',22),fill=LB)
    credit(d,i); return bg.convert('RGB')
def duotone(i,label):
    p=cover(photo(i),W,H); L=np.array(p.convert('L'),np.float32)/255
    L=np.clip((L-0.08)/0.84,0,1)
    a=np.array(NAVY,np.float32)*0.55; b=np.array(TAN,np.float32)*1.0+np.array([20,20,20])
    img=a+(b-a)*L[...,None]**1.1
    yy,xx=np.mgrid[0:H,0:W]; v=np.clip(1-((xx/W-0.55)**2*1.2+(yy/H-0.5)**2*1.6),0.35,1)[...,None]; img=img*v
    out=Image.fromarray(np.clip(img,0,255).astype(np.uint8)); d=ImageDraw.Draw(out)
    d.text((28,28),label,font=ImageFont.truetype(FD+'Inter-Bold.otf',22),fill=(255,255,255)); credit(d,i); return out
def film(i,label):
    p=np.array(cover(photo(i),W,H),np.float32)
    p=(p-128)*1.08+128; p[...,0]*=1.04; p[...,2]*=0.94   # a touch of contrast and warmth
    lum=p.mean(2,keepdims=True); p=lum+(p-lum)*0.85
    yy,xx=np.mgrid[0:H,0:W]; fade=np.clip((xx/W-0.0)/0.45,0,1)[...,None]
    p=np.array(NAVY,np.float32)*(1-fade)+p*fade
    p+=np.random.default_rng(1).normal(0,7,p.shape)
    bar=int(H*0.07); p[:bar]=0; p[-bar:]=0
    out=Image.fromarray(np.clip(p,0,255).astype(np.uint8)); d=ImageDraw.Draw(out)
    d.text((28,bar+22),label,font=ImageFont.truetype(FD+'Inter-Bold.otf',22),fill=TAN); credit(d,i); return out
if __name__=='__main__':
    for i,big,label in [("honda-cb750-sohc","CB750","1975 HONDA CB750"),("harley-street-glide-m8","GLIDE","2019 HARLEY-DAVIDSON STREET GLIDE")]:
        name_card(i,big,label).save(f'hero-A-{i}.png'); duotone(i,label).save(f'hero-B-{i}.png'); film(i,label).save(f'hero-C-{i}.png')
