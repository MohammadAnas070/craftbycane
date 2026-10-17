import os, re, time
from PIL import Image
from rembg import remove, new_session
s=new_session('u2net')
root='zipx/cane_img'
for cat in sorted(os.listdir(root)):
    os.makedirs(f'cut/{cat}',exist_ok=True)
    for f in sorted(os.listdir(f'{root}/{cat}'), key=lambda x:int(re.findall(r'\d+',x)[0])):
        if not f.endswith('.jpg'): continue
        out=f'cut/{cat}/{f[:-4]}.png'
        if os.path.exists(out): continue
        im=Image.open(f'{root}/{cat}/{f}').convert('RGB'); im.thumbnail((1400,1400))
        r=remove(im,session=s)
        bb=r.getchannel('A').point(lambda v:255 if v>30 else 0).getbbox()
        if bb: r=r.crop(bb)
        r.save(out); print(out,r.size,flush=True)
print('DONE')
