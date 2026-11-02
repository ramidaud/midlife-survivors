// Optional offline asset export. The game has no build step.
// Normalize generated sources to native pixels, exact palette and opaque magenta.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
struct Spec: Decodable { let id:String; let frame:[Int]; let variants:Int; let source:String; let file:String; let category:String }
let root=CommandLine.arguments[1]
let batch=CommandLine.arguments.count>2 ? CommandLine.arguments[2] : "batch-2a.json"
let specs=try JSONDecoder().decode([Spec].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/"+batch)))
let hex=["171c35","303750","526078","3e7775","83a89a","a88b70","d3b78d","f2d7a1","fff0cf","874c3b","c45c4b","ef9347","e5a995","f1b5bf","bfa8cf","b97a58","70402f"]
let palette=hex.map{v->[Int] in let n=Int(v,radix:16)!; return [(n>>16)&255,(n>>8)&255,n&255]}
let cs=CGColorSpaceCreateDeviceRGB(),flags=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
func save(_ bytes:[UInt8],_ w:Int,_ h:Int,_ file:String) {
 let image=CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:cs,bitmapInfo:CGBitmapInfo(rawValue:flags),provider:CGDataProvider(data:Data(bytes) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!
 let dst=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/"+file) as CFURL,UTType.png.identifier as CFString,1,nil)!
 CGImageDestinationAddImage(dst,image,nil);precondition(CGImageDestinationFinalize(dst))
}
for s in specs {
 let url=URL(fileURLWithPath:root+"/"+s.source)
 if !FileManager.default.fileExists(atPath:url.path) {continue}
 let source=CGImageSourceCreateWithURL(url as CFURL,nil)!,img=CGImageSourceCreateImageAtIndex(source,0,nil)!,sw=img.width,sh=img.height
 let ctx=CGContext(data:nil,width:sw,height:sh,bitsPerComponent:8,bytesPerRow:sw*4,space:cs,bitmapInfo:flags)!
 ctx.draw(img,in:CGRect(x:0,y:0,width:sw,height:sh));let pixels=ctx.data!.assumingMemoryBound(to:UInt8.self)
 func foreground(_ x:Int,_ y:Int)->Bool {let i=(y*sw+x)*4,r=Int(pixels[i]),g=Int(pixels[i+1]),b=Int(pixels[i+2]);return !(r>150 && b>150 && g<135 && r-g>75 && b-g>75)}
 var l=sw,r=0,t=sh,b=0
 for y in 0..<sh {for x in 0..<sw where foreground(x,y) {l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
 precondition(l<r && t<b,"Empty art")
 let w=s.frame[0],h=s.frame[1],padding=2,scale=min(Double(w-2*padding)/Double(r-l+1),Double(h-2*padding)/Double(b-t+1))
 let dw=Int((Double(r-l+1)*scale).rounded()),dh=Int((Double(b-t+1)*scale).rounded()),ox=(w-dw)/2,oy=h-padding-dh
 var grid=[Int](repeating:-1,count:w*h)
 for y in 0..<dh {for x in 0..<dw {
  let sx=l+min(r-l,Int(Double(x)*Double(r-l+1)/Double(dw))),sy=t+min(b-t,Int(Double(y)*Double(b-t+1)/Double(dh)))
  if !foreground(sx,sy){continue};let i=(sy*sw+sx)*4;var best=0,distance=Int.max
  for (j,c) in palette.enumerated() {let d=(0..<3).reduce(0){$0+(c[$1]-Int(pixels[i+$1]))*(c[$1]-Int(pixels[i+$1]))};if d<distance{best=j;distance=d}}
  // Keep yellow-green source foliage in the shared teal/sage ramp.
  if s.id=="roundabout" && Double(pixels[i+1])>Double(pixels[i])*0.85 && Double(pixels[i+1])>Double(pixels[i+2])*1.2 && pixels[i+1]>65 {
   best=[3,4].min{a,b in
    let da=(0..<3).reduce(0){$0+(palette[a][$1]-Int(pixels[i+$1]))*(palette[a][$1]-Int(pixels[i+$1]))}
    let db=(0..<3).reduce(0){$0+(palette[b][$1]-Int(pixels[i+$1]))*(palette[b][$1]-Int(pixels[i+$1]))}
    return da<db
   }!
  }
  grid[(y+oy)*w+x+ox]=best
 }}
 // Give the silhouette a consistent one-native-pixel navy edge.
 let raw=grid
 for y in 1..<h-1 {for x in 1..<w-1 where raw[y*w+x]>=0 {if [raw[y*w+x-1],raw[y*w+x+1],raw[(y-1)*w+x],raw[(y+1)*w+x]].contains(-1){grid[y*w+x]=0}}}
 var sheet=[UInt8](repeating:255,count:w*s.variants*h*4)
 for v in 0..<s.variants {
  var out=[UInt8](repeating:255,count:w*h*4)
  for y in 0..<h {for x in 0..<w {
   let i=(y*w+x)*4;out[i+1]=0;let base=grid[y*w+x];if base<0{continue};var c=base
   // Controlled colorways preserve silhouette, paper and navy outlines.
   if v==1 {c=[3:2,4:5,14:10][base] ?? base}
   if v==2 {c=[3:9,4:5,14:4][base] ?? base}
   if v==1 && ["posters","signs"].contains(s.category) {c=[7:6,8:7,3:2,4:5][base] ?? base}
   if s.category=="parking" && s.id=="car_compact" {
    if v==1 {c=[6:3,7:4,8:7][base] ?? base}
    if v==2 {c=[6:9,7:10,8:6][base] ?? base}
   }
   if ["kiddie_pool","ocean_pot"].contains(s.id) && v==1 {c=[3:2,7:6,8:7][base] ?? base}
   if s.id=="fruit_tree" && v==1 {c=base;if y>=h*68/100 {c=[5:2,6:14,7:8][base] ?? base}}
   if s.id=="roundabout" && v==1 {c=[7:6,8:7][base] ?? base}
   if s.id=="hard_stop" && v==1 {c=[10:9,7:6,8:7][base] ?? c}
   if s.id=="wheel_boot" && v>0 {c=(v==1 ? [6:4,7:4,8:7] : [6:2,7:6,8:7])[base] ?? c}
   for k in 0..<3 {out[i+k]=UInt8(palette[c][k])}
  }}
  for y in 0..<h {for x in 0..<w {for k in 0..<4 {sheet[(y*w*s.variants+v*w+x)*4+k]=out[(y*w+x)*4+k]}}}
  save(out,w,h,s.id+"-variant-"+String(v+1)+"-v1.png")
 }
 save(sheet,w*s.variants,h,s.file)
 print("\(s.id): \(w)x\(h), \(s.variants) equal-grid colorways")
}
