"""Cut the bike out with the IS-Net background-removal model (rembg's isnet-general-use.onnx).
Writes scaled-<id>.jpg, mask-<id>.npy and chk-<id>.jpg like grab2.py."""
import cv2, numpy as np, onnxruntime as ort, sys, os
S = ort.InferenceSession('/home/claude/models/isnet-general-use.onnx', providers=['CPUExecutionProvider'])
def cut(i):
    im = cv2.imread(f'/tmp/bp/photos/{i}.jpg'); hh, ww = im.shape[:2]
    s = cv2.resize(im, (1400, int(hh*1400/ww))); H, W = s.shape[:2]
    x = cv2.resize(cv2.cvtColor(s, cv2.COLOR_BGR2RGB), (1024, 1024)).astype(np.float32)/255
    x = (x - 0.5) / 1.0
    p = S.run(None, {S.get_inputs()[0].name: x.transpose(2, 0, 1)[None]})[0][0, 0]
    p = (p - p.min()) / (p.max() - p.min() + 1e-6)
    m = cv2.resize(p, (W, H))
    mk = (m > 0.5).astype(np.uint8)*255
    n, lab, st, _ = cv2.connectedComponentsWithStats(mk); big = st[1:, 4].max()
    mk = np.isin(lab, [k for k in range(1, n) if st[k, 4] >= big*0.15]).astype(np.uint8)*255
    np.save(f'mask-{i}.npy', mk); cv2.imwrite(f'scaled-{i}.jpg', s)
    v = s.copy(); v[mk == 0] = (v[mk == 0]*0.25 + np.array([0, 0, 180])*0.75).astype(np.uint8)
    cv2.imwrite(f'chk-{i}.jpg', cv2.resize(v, (700, int(H*700/W))))
for i in sys.argv[1:]: cut(i); print(i)
