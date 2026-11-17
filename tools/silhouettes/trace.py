import cv2, json, numpy as np, sys
meta=json.load(open('meta.json'))
FLIP={}  # all bikes face left (front on the left) like the existing set? decided per bike below
def trace(i, thr=0.74, out='out'):
    s=cv2.imread(f'scaled-{i}.jpg'); m=np.load(f'mask-{i}.npy')
    # crop to the bike
    Hs,Ws=m.shape
    ys,xs=np.where(m>0); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max(); pad=6
    s=s[y0:y1+1,x0:x1+1]; m=m[y0:y1+1,x0:x1+1]
    s=cv2.copyMakeBorder(s,pad,pad,pad,pad,cv2.BORDER_REPLICATE); m=cv2.copyMakeBorder(m,pad,pad,pad,pad,cv2.BORDER_CONSTANT,0)
    # upscale 2x for smoother outlines
    s=cv2.resize(s,None,fx=2,fy=2,interpolation=cv2.INTER_CUBIC); m=cv2.resize(m,None,fx=2,fy=2,interpolation=cv2.INTER_LINEAR)
    m=(cv2.GaussianBlur(m,(0,0),2.0)>127).astype(np.uint8)*255
    # highlights: only the clear, bigger bright areas (chrome, paint shine) become white cut-outs
    L=cv2.cvtColor(s,cv2.COLOR_BGR2LAB)[:,:,0]
    Lw=cv2.GaussianBlur(L,(0,0),1.0).astype(np.float32); m2=m.copy()
    L=cv2.bilateralFilter(L,9,40,9); L=cv2.createCLAHE(2.0,(8,8)).apply(L).astype(np.float32)
    L=cv2.GaussianBlur(L,(0,0),1.2)
    t=np.quantile(L[m>0],thr)
    hi=((L>t)&(m>0)).astype(np.uint8)*255
    hi=cv2.morphologyEx(hi,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    rim=cv2.erode(m,np.ones((9,9),np.uint8)); hi=cv2.bitwise_and(hi,rim)
    n,lab,st,_=cv2.connectedComponentsWithStats(hi)
    for k in range(1,n):
        if st[k,4]<120: hi[lab==k]=0
    black=cv2.bitwise_and(m,cv2.bitwise_not(hi))
    # smooth every edge, then drop specks and pinholes
    black=(cv2.GaussianBlur(black,(0,0),1.1)>127).astype(np.uint8)*255
    n,lab,st,_=cv2.connectedComponentsWithStats(black)
    for k in range(1,n):
        if st[k,4]<120: black[lab==k]=0
    inv=cv2.bitwise_and(cv2.bitwise_not(black),m)
    n,lab,st,_=cv2.connectedComponentsWithStats(inv)
    for k in range(1,n):
        if st[k,4]<60: black[lab==k]=255
    from wfit import WH
    n,lab,st,_=cv2.connectedComponentsWithStats(black)
    if n>1:
        big=1+np.argmax(st[1:,4])
        for k in range(1,n):
            if k!=big and st[k,4]<st[big,4]*0.003: black[lab==k]=0
    black=(cv2.GaussianBlur(black,(0,0),1.2)>127).astype(np.uint8)*255
    if meta[i].get('flip'): black=cv2.flip(black,1)
    cv2.imwrite(f'{out}-{i}.png',255-black)
    # vector: contours with holes, even-odd fill
    cs,hier=cv2.findContours(black,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    H,W=black.shape; d=[]
    for c in cs:
        if cv2.contourArea(c)<60: continue
        a=cv2.approxPolyDP(c,1.0,True).reshape(-1,2)
        if len(a)<3: continue
        d.append('M'+' L'.join(f'{x} {y}' for x,y in a)+'Z')
    m2=meta[i]
    svg=f'<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet"><!-- Silhouette traced from \'{m2["file"]}\' by {m2["artist"]} on Wikimedia Commons, {m2["lic"]} --><path fill="#000" fill-rule="evenodd" d="{"".join(d)}"/></svg>'
    open(f'{out}-{i}.svg','w').write(svg); return len(svg)
if __name__=="__main__":
    for i in (sys.argv[1:] or list(meta)): print(i, trace(i))
