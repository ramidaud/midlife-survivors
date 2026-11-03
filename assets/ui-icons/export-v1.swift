// Export generated icon studies to the native, shared-palette UI atlas.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
let root=CommandLine.arguments[1],cs=CGColorSpaceCreateDeviceRGB(),flags=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue

let hex="171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f".split(separator:" ")
let colors=hex.map{h->[Int] in let k=Int(h,radix:16)!;return[(k>>16)&255,(k>>8)&255,k&255]}
func encode(_ g:[Int],_ w:Int,_ h:Int)->[UInt8] {var a=[UInt8](repeating:255,count:w*h*4);for i in g.indices {a[i*4+1]=0;if g[i]>=0{for k in 0..<3{a[i*4+k]=UInt8(colors[g[i]][k])}}};return a}
func save(_ g:[Int],_ w:Int,_ h:Int,_ file:String) {let a=encode(g,w,h),im=CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:cs,bitmapInfo:CGBitmapInfo(rawValue:flags),provider:CGDataProvider(data:Data(a) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!;let d=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/"+file) as CFURL,UTType.png.identifier as CFString,1,nil)!;CGImageDestinationAddImage(d,im,nil);precondition(CGImageDestinationFinalize(d))}
func nearest(_ rgb:[Int],_ allowed:[Int])->Int {allowed.min{a,b in zip(colors[a],rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)} < zip(colors[b],rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)}}!}
var atlas=[Int](repeating:-1,count:256*160)
for group in 0..<6 {
 let actual=min(group,4),file="icons-group-\(actual+1)-source-v\(group==5 ? 2:1).png"
 let src=CGImageSourceCreateWithURL(URL(fileURLWithPath:root+"/"+file) as CFURL,nil)!
 let im=CGImageSourceCreateImageAtIndex(src,0,nil)!,sw=im.width,sh=im.height
 let ctx=CGContext(data:nil,width:sw,height:sh,bitsPerComponent:8,bytesPerRow:sw*4,space:cs,bitmapInfo:flags)!
 ctx.draw(im,in:CGRect(x:0,y:0,width:sw,height:sh))
 let p=ctx.data!.assumingMemoryBound(to:UInt8.self)
 func fg(_ x:Int,_ y:Int)->Bool {let i=(y*sw+x)*4,r=Int(p[i]),g=Int(p[i+1]),b=Int(p[i+2]);return !(r>145 && b>130 && g<125 && r-g>68 && b-g>58)}
 for cell in (group==5 ? [0]:group==4 ? [1,2]:Array(0..<8)) {
  let x0=cell%4*sw/4,y0=cell/4*sh/2,w=sw/4,h=sh/2
  var l=w,r=0,t=h,b=0
  for y in 0..<h{for x in 0..<w where fg(x0+x,y0+y){l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
  precondition(r>l && b>t,file+" cell \(cell)")
  let bw=r-l+1,bh=b-t+1,k=min(28.0/Double(bw),28.0/Double(bh))
  let dw=Int((Double(bw)*k).rounded()),dh=Int((Double(bh)*k).rounded()),ox=(32-dw)/2,oy=(32-dh)/2
  var g=[Int](repeating:-1,count:1024)
  for y in 0..<dh{for x in 0..<dw{
   let sx=x0+l+min(bw-1,Int((Double(x)+0.5)*Double(bw)/Double(dw))),sy=y0+t+min(bh-1,Int((Double(y)+0.5)*Double(bh)/Double(dh)))
   if fg(sx,sy){let i=(sy*sw+sx)*4;g[(y+oy)*32+x+ox]=nearest([Int(p[i]),Int(p[i+1]),Int(p[i+2])],Array(colors.indices))}
  }}
  let raw=g,idx=actual*8+cell
  for y in 1..<31{for x in 1..<31 where raw[y*32+x]>=0{
   if [raw[y*32+x-1],raw[y*32+x+1],raw[(y-1)*32+x],raw[(y+1)*32+x]].contains(-1){g[y*32+x]=0}
  }}
  for y in 0..<32{for x in 0..<32{atlas[(idx/8*32+y)*256+idx%8*32+x]=g[y*32+x]}}
 }
}
save(atlas,256,160,"icons-v1.png")
