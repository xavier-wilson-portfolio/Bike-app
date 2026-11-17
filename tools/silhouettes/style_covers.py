import cv2, json, numpy as np
R='/home/claude/xavier-wilson-portfolio/bike-app/'
B={
"standard":dict(engine=(38,35,70,82),fuel=(45,15,82,42),wheels=(68,48,100,100),suspension=(8,25,38,75),electrical=(62,5,86,45)),
"cruiser":dict(engine=(45,25,75,75),fuel=(52,8,85,40),wheels=(68,38,100,100),suspension=(5,25,38,90),electrical=(72,3,98,52)),
"sport":dict(engine=(35,40,70,90),fuel=(38,15,70,45),wheels=(65,45,100,100),suspension=(2,30,40,95),electrical=(70,0,95,45)),
"touring":dict(engine=(55,45,90,85),fuel=(40,20,80,52),wheels=(78,50,100,100),suspension=(5,40,45,100),electrical=(68,0,95,50)),
"dualsport":dict(engine=(30,35,65,75),fuel=(35,15,75,45),wheels=(65,40,100,100),suspension=(2,40,40,100),electrical=(55,0,80,40)),
"adventure":dict(engine=(25,45,65,90),fuel=(35,15,75,50),wheels=(60,45,100,100),suspension=(0,40,40,100),electrical=(60,0,90,45)),
"cafe":dict(engine=(35,30,70,90),fuel=(35,12,68,42),wheels=(68,30,100,100),suspension=(2,25,35,95),electrical=(65,0,85,40)),
"scooter":dict(engine=(10,50,50,100),fuel=(5,20,60,60),wheels=(78,50,100,100),suspension=(0,40,40,100),electrical=(60,0,100,45)),
}
NAMES={"engine":"Engine","fuel":"Fuel tank","wheels":"Front wheel","suspension":"Rear suspension","electrical":"Headlight"}
cred=json.load(open(R+'img/sil/credits.json'))
def vec(black):
    cs,_=cv2.findContours(black,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE); H,W=black.shape; d=[]
    for c in cs:
        if cv2.contourArea(c)<25: continue
        a=cv2.approxPolyDP(c,1.2,True).reshape(-1,2)
        if len(a)>=3: d.append('M'+' L'.join(f'{x} {y}' for x,y in a)+'Z')
    return W,H,''.join(d)
for s,areas in B.items():
    im=cv2.imread(f'{s}.png',0); black=(im<128).astype(np.uint8)*255; H,W=black.shape
    src=cred.get(f'bike-{s}.svg',{})
    for a,b in areas.items():
        x0,y0,x1,y1=[int(v*z/100) for v,z in zip(b,(W,H,W,H))]
        c=black[y0:y1,x0:x1]
        ys,xs=np.where(c>0); c=c[ys.min():ys.max()+1, xs.min():xs.max()+1]
        c=cv2.copyMakeBorder(c,4,4,4,4,cv2.BORDER_CONSTANT,0)
        w,h,d=vec(c)
        open(f'{a}-{s}.svg','w').write(f'<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid meet"><!-- {NAMES[a]} cover for the {s} style, cut from the {s} silhouette --><path fill="#000" fill-rule="evenodd" d="{d}"/></svg>')
        cv2.imwrite(f'{a}-{s}.png',255-c)
        cred[f'{a}-{s}.svg']=dict(src, what=f"{NAMES[a]} ({s} style)")
json.dump(cred,open('credits-new.json','w'),indent=1,ensure_ascii=False)
