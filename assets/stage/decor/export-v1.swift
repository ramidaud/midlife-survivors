// Optional native decor export. Runtime uses these PNGs, never this tool.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
struct Spec:Decodable {let id:String;let frame:[Int];let source:String;let file:String;let kind:String}
let root=CommandLine.arguments[1],cs=CGColorSpaceCreateDeviceRGB(),flags=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
let specs=try JSONDecoder().decode([Spec].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/brief-v1.json")))
let hex="171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f".split(separator:" ")
let colors=hex.map{h->[Int] in let k=Int(h,radix:16)!;return[(k>>16)&255,(k>>8)&255,k&255]}
let bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
func encode(_ g:[Int],_ w:Int,_ h:Int)->[UInt8] {var a=[UInt8](repeating:255,count:w*h*4);for i in g.indices {a[i*4+1]=0;if g[i]>=0{for k in 0..<3{a[i*4+k]=UInt8(colors[g[i]][k])}}};return a}
func save(_ g:[Int],_ w:Int,_ h:Int,_ file:String) {let a=encode(g,w,h),im=CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:cs,bitmapInfo:CGBitmapInfo(rawValue:flags),provider:CGDataProvider(data:Data(a) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!;let d=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/"+file) as CFURL,UTType.png.identifier as CFString,1,nil)!;CGImageDestinationAddImage(d,im,nil);precondition(CGImageDestinationFinalize(d))}
func nearest(_ rgb:[Int],_ allowed:[Int])->Int {allowed.min{a,b in zip(colors[a],rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)} < zip(colors[b],rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)}}!}
var patches=[[Int]](),tiles=[[Int]]()
for s in specs {
 let source=CGImageSourceCreateWithURL(URL(fileURLWithPath:root+"/"+s.source) as CFURL,nil)!,im=CGImageSourceCreateImageAtIndex(source,0,nil)!,sw=im.width,sh=im.height,n=s.frame[0]
 let c=CGContext(data:nil,width:sw,height:sh,bitsPerComponent:8,bytesPerRow:sw*4,space:cs,bitmapInfo:flags)!;c.draw(im,in:CGRect(x:0,y:0,width:sw,height:sh));let p=c.data!.assumingMemoryBound(to:UInt8.self)
 func fg(_ x:Int,_ y:Int)->Bool {let i=(y*sw+x)*4,r=Int(p[i]),g=Int(p[i+1]),b=Int(p[i+2]);return !(r>150 && b>150 && g<135 && r-g>75 && b-g>75)}
 var g=[Int](repeating:-1,count:n*n)
 if s.kind=="tile" {
  // The approved Bullpen stays slate. The warm source supplies the weave, not its final hue.
  for y in 0..<n{for x in 0..<n{let sx=x*sw/n,sy=y*sh/n,i=(sy*sw+sx)*4,lum=(Double(p[i])+Double(p[i+1])+Double(p[i+2]))/3,grain=max(-0.04,min(0.08,(180-lum)/350)),ratio=(s.id=="carpet_muted" ? 0.038:0.11)+grain,dark=Double(bayer[y%4][(x+(y/4)*3)%4])/16<ratio;g[y*n+x]=s.id=="carpet_muted" ? (dark ? 1:2):(dark ? 5:6)}}
  for x in 0..<n{g[(n-1)*n+x]=g[x]};for y in 0..<n{g[y*n+n-1]=g[y*n]};tiles.append(g)
 } else {
  var l=sw,r=0,t=sh,b=0
  for y in 0..<sh{for x in 0..<sw where fg(x,y){l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
  let scale=min(Double(n-4)/Double(r-l+1),Double(n-4)/Double(b-t+1)),dw=Int((Double(r-l+1)*scale).rounded()),dh=Int((Double(b-t+1)*scale).rounded()),ox=(n-dw)/2,oy=(n-dh)/2
  for y in 0..<dh{for x in 0..<dw{let sx=l+min(r-l,x*(r-l+1)/dw),sy=t+min(b-t,y*(b-t+1)/dh);if !fg(sx,sy){continue};let i=(sy*sw+sx)*4,rgb=[Int(p[i]),Int(p[i+1]),Int(p[i+2])],allowed=s.kind=="light" ? (s.id=="light_warm" ? [5,6,7,8]:[2,3,4,7]):Array(colors.indices);g[(y+oy)*n+x+ox]=nearest(rgb,allowed)}}
  if s.kind=="rug" {let raw=g;for y in 1..<n-1{for x in 1..<n-1 where raw[y*n+x]>=0{if [raw[y*n+x-1],raw[y*n+x+1],raw[(y-1)*n+x],raw[(y+1)*n+x]].contains(-1){g[y*n+x]=0}}}}
  if s.kind=="light" {for y in 0..<n{for x in 0..<n where g[y*n+x]>=0{let d=min(x-ox,y-oy,ox+dw-1-x,oy+dh-1-y);if d<12 && bayer[y%4][x%4]>=max(1,(d+1)*16/12){g[y*n+x] = -1}}}}
  // Repeating middle tiles have matching opposite edges; corners keep their silhouettes.
  for y in 0..<n {g[y*n+63]=g[y*n+32]};for x in 0..<n {g[63*n+x]=g[32*n+x]}
  if s.kind=="rug" {let raw=g;for y in 1..<n-1{for x in 1..<n-1 where raw[y*n+x]>=0{if [raw[y*n+x-1],raw[y*n+x+1],raw[(y-1)*n+x],raw[(y+1)*n+x]].contains(-1){g[y*n+x]=0}}}}
  patches.append(g)
 }
 save(g,n,n,s.file);print("\(s.id): \(n)x\(n), \(s.kind), shared palette")
}
var atlas=[Int](repeating:-1,count:288*192)
for (i,g) in patches.enumerated(){for y in 0..<96{for x in 0..<96{atlas[(i/3*96+y)*288+i%3*96+x]=g[y*96+x]}}};save(atlas,288,192,"decor-v1.png")
var floors=[Int](repeating:-1,count:128*64)
for (i,g) in tiles.enumerated(){for y in 0..<64{for x in 0..<64{floors[y*128+i*64+x]=g[y*64+x]}}};save(floors,128,64,"floors-v1.png")
