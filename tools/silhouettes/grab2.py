import cv2, json, numpy as np, sys
# percent boxes (x0,y0,x1,y1). rect = outer box (outside is background); bg = definitely background; fg = definitely bike; pf = probably bike
H={
"yamaha-mt07-gen1":dict(rect=(11,12,87,81),bg=[(26,17,68,31),(27,30.5,44,33.6),(21,44,34,52),(11,52,16,62),(33.5,34,46.5,38.3),(43,28,49,33.2),(20,77.5,35,82),(40,73,69,82)],fg=[(45,52,58,64),(40,36,62,43)]),
"kawasaki-kz650":dict(rect=(9,13,82,80),pf=[(17,50,40,77)],bg=[(32,24,57,34.5),(46,33,49.3,38.5),(27,78,44,82),(8,13,26,33),(8,48,13,64),(25,15,47,33),(57,13,72,24),(37,69,63,76),(9,62,15,74)],fg=[(46,46,60,60),(48,35,62,42)]),
"yamaha-xs650":dict(rect=(1,2,99.5,86),bg=[(0,0,60,24),(84,0,100,38),(35,78,71,100),(0,85,100,100),(0,55,6,100)],fg=[(48,45,64,70),(50,27,66,35),(18,28,45,34)]),
"suzuki-gs550":dict(rect=(8,14,87,84),bg=[(41,24,51,36.3),(61,22,78,38.3),(51,24,61,35),(78,24,85,37),(29,22,33,30),(0,0,32,24),(39,0,100,24),(0,26,22,47),(60,22,82,38),(32,77,55,100),(0,82,100,100),(86,60,100,100)],fg=[(38,48,52,64),(32,38,45,43)]),
"harley-street-glide-m8":dict(rect=(8,17,91,94),bg=[(27,88,64,100),(84,86,100,100),(38,0,100,43),(0,0,17,58),(0,0,40,18),(28,90,63,100),(0,95,100,100)],fg=[(62,50,86,70),(20,32,31,50),(38,55,55,70)]),
"honda-cb350-twin":dict(rect=(4,11,84,99),bg=[(30,12,52,30),(0,0,100,12),(0,13,48,39),(70,12,100,27),(85,27,100,100),(36,87,62,100)],fg=[(44,55,58,72),(46,40,62,47),(20,42,45,45)]),
"kawasaki-ninja-400":dict(rect=(2,8,98,95),bg=[(0,17,13,24),(24,17,60,26),(0,0,68,17),(81,0,100,32),(90,30,100,52),(31,86,62,100),(0,86,5,100)],fg=[(45,40,65,70),(40,28,55,37),(9,44,17,52),(17,54,29,66)],pf=[(4,55,30,86)]),
"kawasaki-klr650-gen2":dict(rect=(7,2,98,97),bg=[(0,0,24,29),(43,0,100,27),(36,90,52,100),(0,30,8,100)],fg=[(42,55,55,70),(58,38,74,46)]),
"honda-rebel-500":dict(rect=(14,5,99,97),pf=[(16,45,27,54)],bg=[(0,0,16,50),(16,0,25,44),(44,0,100,17),(50,17,100,37),(41,17,50,26.5),(78,36,100,45),(37,82,52,100),(52,78,64,100),(85,84,100,100),(0,80,15,100),(0,88,48,100)],fg=[(36,33,47,42),(40,52,52,62),(60,42,70,48),(56,52,63,62)]),
"honda-cb750-sohc":dict(rect=(6,18,99,95),bg=[],fg=[]),
"honda-cb550-four-1974":dict(rect=(1,4,96,92),bg=[(0,0,20,15),(46,0,100,17),(0,89,100,100),(0,30,3,45)],fg=[(40,42,60,65),(35,25,50,35)]),
"honda-rebel-1100-2021":dict(rect=(2,10,95,86),bg=[(0,0,100,9),(45,9,100,40),(0,0,21,45),(0,84,100,100),(91,40,100,80)],fg=[(35,45,55,65),(52,42,68,52)]),
"honda-cb500-four-1971":dict(rect=(19,45,81,96),bg=[(0,0,100,46),(0,91,42,100),(82,40,100,100),(0,45,18,100)],fg=[(43,62,57,77),(28,59,40,64)]),
"honda-cb400f-super-sport-1975":dict(rect=(1,1,99,92),bg=[(0,0,100,12),(0,12,18,22),(36,12,57,25),(0,85,100,100),(94,40,100,70)],fg=[(35,48,55,68),(30,28,52,42),(55,32,85,40)]),
"honda-cbr600rr-2007":dict(rect=(7,4,98,92),bg=[(0,0,17,30),(40,0,100,17),(0,35,12,85),(0,93,100,100),(90,55,100,90)],fg=[(40,45,60,70),(55,30,65,38)]),
"honda-cb450-1965":dict(rect=(1,1,99,99),bg=[(20,0,57,30),(68,0,100,25),(0,0,18,30),(0,94,30,100),(43,93,63,100),(97,0,100,100)],fg=[(45,50,58,70),(18,35,38,45)]),
"honda-cbr500r-2013":dict(rect=(14,10,83,96),bg=[(0,0,22,100),(0,0,100,9),(42,0,100,25),(83,0,100,100),(0,96,100,100),(62,80,82,100)],fg=[(40,35,55,60),(55,40,65,48)]),
}
meta=json.load(open('meta.json'))
OLD={'honda-cb750-sohc','honda-rebel-500','kawasaki-kz650','yamaha-mt07-gen1','yamaha-xs650','kawasaki-ninja-400','suzuki-gs550','harley-street-glide-m8','honda-cb350-twin','kawasaki-klr650-gen2'}
def box(m,b,W,Hh,v): x0,y0,x1,y1=b; m[int(y0*Hh/100):int(y1*Hh/100),int(x0*W/100):int(x1*W/100)]=v
for i in (sys.argv[1:] or list(H)):
    h=H[i]; fn=meta.get(i,{}).get('photo',f'revora-photo-{i}.jpg')
    import os; p='/tmp/bp/photos/'+i+'.jpg'; im=cv2.imread(p if os.path.exists(p) and i not in OLD else '/mnt/user-data/uploads/Downloads/'+fn); hh,ww=im.shape[:2]
    s=cv2.resize(im,(1400,int(hh*1400/ww))); Hh,W=s.shape[:2]
    m=np.full((Hh,W),cv2.GC_BGD,np.uint8); box(m,h['rect'],W,Hh,cv2.GC_PR_FGD)
    for b in h['bg']: box(m,b,W,Hh,cv2.GC_BGD)
    for b in h.get('pf',[]): box(m,b,W,Hh,cv2.GC_PR_FGD)
    for b in h['fg']: box(m,b,W,Hh,cv2.GC_FGD)
    # tires: the photo outside the bottom half of each tire is ground (background); the tire itself is probably bike
    from wfit import WH
    yy,xx=np.mgrid[0:Hh,0:W]
    for c in WH.get(i,[]):
        cx,cy,rx=c[:3]; ry=c[3] if len(c)>3 else rx; top=c[4] if len(c)>4 else -2
        X,Y,RX,RY=cx*W/100,cy*Hh/100,rx*W/100,ry*W/100
        d=np.sqrt(((xx-X)/RX)**2+((yy-Y)/RY)**2)
        m[(d>1.07)&(yy>Y+RY*0.25)&(np.abs(xx-X)<RX*1.3)]=cv2.GC_BGD
        ring=(d<=0.99)&(d>0.80)&(yy>Y+RY*max(top,-1))
        m[ring&(m!=cv2.GC_FGD)]=cv2.GC_PR_FGD
    bg=np.zeros((1,65)); fg=np.zeros((1,65))
    cv2.grabCut(s,m,None,bg,fg,8,cv2.GC_INIT_WITH_MASK)
    mk=np.where((m==1)|(m==3),255,0).astype(np.uint8)
    # keep the largest blob (the bike) and fill small holes in it
    n,lab,st,_=cv2.connectedComponentsWithStats(mk); big=st[1:,4].max(); mk=np.isin(lab,[k for k in range(1,n) if st[k,4]>=big*0.03]).astype(np.uint8)*255
    np.save(f'mask-{i}.npy',mk); cv2.imwrite(f'scaled-{i}.jpg',s)
    v=s.copy(); v[mk==0]=(v[mk==0]*0.25+np.array([0,0,180])*0.75).astype(np.uint8); cv2.imwrite(f'chk-{i}.jpg',cv2.resize(v,(700,int(Hh*700/W))))
    print(i)
