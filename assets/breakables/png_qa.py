"""Read-only PNG decoder for art QA, standard library only."""
import struct,zlib
def png(path):
 data=path.read_bytes();offset=8;packed=b''
 while offset<len(data):
  n=struct.unpack('>I',data[offset:offset+4])[0];kind=data[offset+4:offset+8];chunk=data[offset+8:offset+8+n];offset+=12+n
  if kind==b'IHDR':w,h,depth,color,_,_,interlace=struct.unpack('>IIBBBBB',chunk)
  elif kind==b'IDAT':packed+=chunk
 assert depth==8 and color in [2,6] and interlace==0,(path,depth,color,interlace)
 channels=4 if color==6 else 3;stride=w*channels;raw=zlib.decompress(packed);rows=[];prev=bytearray(stride);pos=0
 def paeth(a,b,c):
  p=a+b-c;dist=[abs(p-a),abs(p-b),abs(p-c)];return [a,b,c][dist.index(min(dist))]
 for y in range(h):
  filt=raw[pos];row=bytearray(raw[pos+1:pos+1+stride]);pos+=stride+1
  for x in range(stride):
   a=row[x-channels] if x>=channels else 0;b=prev[x];c=prev[x-channels] if x>=channels else 0
   row[x]=(row[x]+(0 if filt==0 else a if filt==1 else b if filt==2 else (a+b)//2 if filt==3 else paeth(a,b,c)))%256
  rows.append([tuple(row[i:i+channels])+(255,) if channels==3 else tuple(row[i:i+channels]) for i in range(0,stride,channels)]);prev=row
 return w,h,rows
