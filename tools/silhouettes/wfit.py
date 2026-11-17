import cv2,numpy as np,json,sys
# wheel circles on the scaled photo: (cx% of W, cy% of H, r% of W)
WH={
"honda-rebel-500":[(26,70,12,12),(80,72.5,16.5,17)],
"honda-cb750-sohc":[(17.3,76.5,12.3),(81,77,11.7)],
"kawasaki-kz650":[(27,59,9.8),(72,54.6,8.7)],
"yamaha-mt07-gen1":[(25,63,10.6),(78.3,67.8,8.1,10.6)],
"yamaha-xs650":[(21,63,13.5),(85.6,63,13.5)],
"suzuki-gs550":[(19.6,62,11),(70,60.8,12.5)],
"harley-street-glide-m8":[(18,76,8.8),(74.6,73.5,9,9,-0.05)],
"honda-cb350-twin":[(22.5,76,12),(73.5,73.6,9.8)],
"kawasaki-ninja-400":[(17.3,69.7,12.5),(80,72,15)],
"kawasaki-klr650-gen2":[(21.5,74,13.5),(78,74,15)],
"honda-cb550-four-1974":[(15.5,69,14),(80,62,14)],
"honda-rebel-1100-2021":[(15,67,12),(74.5,66,12)],
"honda-cb500-four-1971":[(31.7,80.5,6.8,6.25),(69.5,85,10.5,9.5)],
"honda-cbr600rr-2007":[(20.3,71.5,13.2),(78,69,12)],
"honda-cb450-1965":[(18,71.5,14,14.5),(83.5,75.5,15.5,14.75)],
"honda-cbr500r-2013":[(27,76.5,12,10.7),(68,60.5,8,9)],
"honda-cb400f-super-sport-1975":[(17.5,63,13.5),(80,62,12.5)],
}
if __name__=='__main__':
    ims=[]
    for i,cs in WH.items():
        s=cv2.imread(f'scaled-{i}.jpg'); H,W=s.shape[:2]
        for c in cs:
            cx,cy,rx=c[:3]; ry=c[3] if len(c)>3 else rx
            cv2.ellipse(s,(int(cx*W/100),int(cy*H/100)),(int(rx*W/100),int(ry*W/100)),0,0,360,(0,0,255),4)
        v=cv2.resize(s,(520,int(H*520/W))); c=np.zeros((400,520,3),np.uint8); c[:min(400,v.shape[0])]=v[:400]; cv2.putText(c,i,(4,16),0,.5,(0,255,255),1); ims.append(c)
    ims.append(np.zeros((400,520,3),np.uint8))
    cv2.imwrite('wfit.jpg',np.vstack([np.hstack(ims[k:k+2]) for k in range(0,10,2)]))
