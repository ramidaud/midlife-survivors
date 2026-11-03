// Optional offline art cleanup/export. Reads v1; writes new v2 files only.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
struct Spec:Decodable {let id:String;let size:Int;let frames:Int;let sourceColumns:Int;let sourceRows:Int;let source:String;let file:String;let keyV1:[Int]}
struct Old:Decodable {let id:String;let delay:Double;let anchor:String}
let root=CommandLine.arguments[1],cs=CGColorSpaceCreateDeviceRGB(),flags=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
let specs=try JSONDecoder().decode([Spec].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/batch-v2.json")))
let oldSpecs=try JSONDecoder().decode([Old].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/batch-1.json")))
let hex="171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf".split(separator:" ")
let colors=hex.map{v->[Int] in let k=Int(v,radix:16)!;return[(k>>16)&255,(k>>8)&255,k&255]}
func image(_ bytes:[UInt8],_ w:Int,_ h:Int)->CGImage {CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:cs,bitmapInfo:CGBitmapInfo(rawValue:flags),provider:CGDataProvider(data:Data(bytes) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!}
func read(_ file:String)->(Int,Int,[UInt8]) {let s=CGImageSourceCreateWithURL(URL(fileURLWithPath:root+"/"+file) as CFURL,nil)!,im=CGImageSourceCreateImageAtIndex(s,0,nil)!,w=im.width,h=im.height;let c=CGContext(data:nil,width:w,height:h,bitsPerComponent:8,bytesPerRow:w*4,space:cs,bitmapInfo:flags)!;c.draw(im,in:CGRect(x:0,y:0,width:w,height:h));return(w,h,Array(UnsafeBufferPointer(start:c.data!.assumingMemoryBound(to:UInt8.self),count:w*h*4)))}
func closest(_ rgb:[Int])->Int {colors.indices.min{a,b in zip(colors[a],rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)} < zip(colors[b],rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)}}!}
func box(_ g:[Int],_ n:Int)->[Int] {let p=g.indices.filter{g[$0]>=0};precondition(!p.isEmpty);return[p.map{$0%n}.min()!,p.map{$0/n}.min()!,p.map{$0%n}.max()!,p.map{$0/n}.max()!]}
func outline(_ g:inout [Int],_ n:Int){let old=g;for y in 1..<n-1{for x in 1..<n-1 where old[y*n+x]>=0 {if [old[y*n+x-1],old[y*n+x+1],old[(y-1)*n+x],old[(y+1)*n+x]].contains(-1){g[y*n+x]=0}}}}
func shift(_ g:[Int],_ n:Int,_ dx:Int,_ dy:Int)->[Int] {var r=[Int](repeating:-1,count:n*n);for y in 1..<n-1{for x in 1..<n-1{let a=x-dx,b=y-dy;if a>=0 && a<n && b>=0 && b<n {r[y*n+x]=g[b*n+a]}}};return r}
for s in specs {
 let n=s.size,(ow,_,ob)=read("enemy-"+s.id+"-v1.png"),(sw,sh,src)=read(s.source),cw=sw/s.sourceColumns,ch=sh/s.sourceRows
 var old:[[Int]]=[]
 for f in 0..<(ow/n) {var g=[Int](repeating:-1,count:n*n);for y in 0..<n{for x in 0..<n {let k=(y*ow+f*n+x)*4;if ob[k]==255 && ob[k+1]==0 && ob[k+2]==255{continue};g[y*n+x]=closest([Int(ob[k]),Int(ob[k+1]),Int(ob[k+2])])}};old.append(g)}
 func guide(_ f:Int,_ a:[Int],_ b:[Int])->[Int] {
  let cx=(f%s.sourceColumns)*cw,cy=(f/s.sourceColumns)*ch
  func fg(_ x:Int,_ y:Int)->Bool {let i=((cy+y)*sw+cx+x)*4,r=Int(src[i]),g=Int(src[i+1]),b=Int(src[i+2]);return !(r>150 && b>150 && g<135 && r-g>75 && b-g>75)}
  var l=cw,r=0,t=ch,bt=0
  for y in 0..<ch{for x in 0..<cw where fg(x,y){l=min(l,x);r=max(r,x);t=min(t,y);bt=max(bt,y)}}
  precondition(l<r && t<bt,"Missing source cell \(s.id) \(f)")
  let A=box(a,n),B=box(b,n),L=Int((Double(A[0]+B[0])/2).rounded()),R=Int((Double(A[2]+B[2])/2).rounded()),T=Int((Double(A[1]+B[1])/2).rounded()),D=Int((Double(A[3]+B[3])/2).rounded())
  var g=[Int](repeating:-1,count:n*n)
  for y in T...D{for x in L...R {let px=l+min(r-l,(x-L)*(r-l+1)/(R-L+1)),py=t+min(bt-t,(y-T)*(bt-t+1)/(D-T+1));if !fg(px,py){continue};let i=((cy+py)*sw+cx+px)*4;g[y*n+x]=closest([Int(src[i]),Int(src[i+1]),Int(src[i+2])])}}
  return g
 }
 var frames=[[Int]]()
 for f in 0..<s.frames {
  if f%2==0 {frames.append(old[s.keyV1[f/2]]);continue}
  let ki=f/2;let next=(ki+1)%s.keyV1.count
  var a=old[s.keyV1[ki]],b=old[s.keyV1[next]]
  // Substates close on themselves, never ring/fade accidentally during a walk.
  if ["spam-likely","back-twinge"].contains(s.id) && (f==3 || f==7){b=old[s.keyV1[f==3 ? 0:2]]}
  if s.id=="3am-thought" && f==3 {b=old[0]}
  if s.id=="3am-thought" && f==7 {a=old[2];b=shift(a,n,1,0)}
  let ref=guide(f,a,b);var g=[Int](repeating:-1,count:n*n)
  // Preserve shared character pixels. Generated drawings guide moving contours,
  // corners and limbs, rather than introducing a second face on alternate frames.
  for y in 1..<n-1{for x in 1..<n-1 {let i=y*n+x,A=a[i],B=b[i],G=ref[i]
   if A==B {g[i]=A;continue}
   if G<0 {g[i]=(A>=0 && B>=0) ? A:-1;continue}
   if A<0 {g[i]=B;continue};if B<0 {g[i]=A;continue}
   let ga=zip(colors[G],colors[A]).reduce(0){$0+abs($1.0-$1.1)},gb=zip(colors[G],colors[B]).reduce(0){$0+abs($1.0-$1.1)}
   g[i]=ga<=gb ? A:B
  }}
  // A breathing bubble needs an actual one-pixel squash, not just typing dots.
  if s.id=="group-chat" {let before=g,top=(f==1 || f==5) ? 5:3;for y in 1..<40{for x in 1..<n-1{g[y*n+x] = -1}};for y in top..<40{for x in 1..<n-1{let sy=4+(y-top)*36/(40-top);g[y*n+x]=before[sy*n+x]}}}
  if s.id=="3am-thought" && f==5 {
   let target=(a.filter{$0>=0}.count+b.filter{$0>=0}.count)/2
   var candidates=g.indices.filter{a[$0]>=0 || b[$0]>=0}
   candidates.sort{p,q in
    func score(_ i:Int)->Int {((a[i]>=0 && b[i]>=0) ? 10000:0)+(ref[i]>=0 ? 1000:0)+((i*73+19)%997)}
    return score(p)>score(q)
   }
   g=[Int](repeating:-1,count:n*n);for i in candidates.prefix(target){g[i]=b[i]>=0 ? b[i]:a[i]}
  }
  if !(s.id=="3am-thought" && f>=4){outline(&g,n)}
  if ["bill","late-fee","spam-likely","calendar-invite"].contains(s.id){g=shift(g,n,0,(n-3)-box(g,n)[3])}
  if s.id=="late-night-donut" {g=shift(g,n,0,44-box(g,n)[3])}
  frames.append(g)
 }
 if s.id=="3am-thought" {for f in 5..<8 {for i in frames[f].indices {let c=frames[f][i];if c<0{continue};frames[f][i]=[0:2,1:2,2:14,7:8][c] ?? c}}}
 precondition(Set(frames.map{String(describing:$0)}).count==s.frames,"Duplicate poses: \(s.id)")
 let w=n*s.frames;var bytes=[UInt8](repeating:255,count:w*n*4)
 for f in 0..<s.frames{for y in 0..<n{for x in 0..<n{let i=(y*w+f*n+x)*4,c=frames[f][y*n+x];bytes[i+1]=0;if c>=0{for k in 0..<3{bytes[i+k]=UInt8(colors[c][k])}}}}}
 let dst=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/"+s.file) as CFURL,UTType.png.identifier as CFString,1,nil)!;CGImageDestinationAddImage(dst,image(bytes,w,n),nil);precondition(CGImageDestinationFinalize(dst))
 let gif=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-"+s.id+"-preview-v2.gif") as CFURL,UTType.gif.identifier as CFString,s.frames,nil)!
 CGImageDestinationSetProperties(gif,[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFLoopCount:0]] as CFDictionary)
 let delay=oldSpecs.first{$0.id==s.id}!.delay/2
 for f in 0..<s.frames {let d=n*4;var out=[UInt8](repeating:255,count:d*d*4)
  for y in 0..<d{for x in 0..<d{let c=frames[f][(y/4)*n+x/4],i=(y*d+x)*4;for k in 0..<3{out[i+k]=UInt8(c<0 ? [48,55,80][k]:colors[c][k])}}}
  let ticks=(Double(f+1)*delay*100).rounded()-(Double(f)*delay*100).rounded()
  CGImageDestinationAddImage(gif,image(out,d,d),[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFDelayTime:ticks/100,kCGImagePropertyGIFUnclampedDelayTime:ticks/100]] as CFDictionary)
 }
 precondition(CGImageDestinationFinalize(gif));print("\(s.id): \(w)x\(n), \(frames.count) unique poses; native + 4x GIF; \(delay*1000)ms/frame")
}
