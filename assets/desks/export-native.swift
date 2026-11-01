// Offline preparation of approved desk sources. Not a game build step.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let root=CommandLine.arguments[1]

let colors=["171c35","303750","526078","3e7775","83a89a","a88b70","d3b78d","f2d7a1","fff0cf","874c3b","c45c4b","ef9347","e5a995","f1b5bf","bfa8cf"]
let palette=colors.map{v->[Int] in let n=Int(v,radix:16)!;return[(n>>16)&255,(n>>8)&255,n&255]}
let space=CGColorSpaceCreateDeviceRGB()
let bitmap=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
func makeImage(_ bytes:[UInt8],_ w:Int,_ h:Int)->CGImage {
 return CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:space,bitmapInfo:CGBitmapInfo(rawValue:bitmap),provider:CGDataProvider(data:Data(bytes) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!
}

for id in ["tidy","paperwork","lunch"] {
 let source=CGImageSourceCreateWithURL(URL(fileURLWithPath:root+"/"+id+"-v1.png") as CFURL,nil)!
 let img=CGImageSourceCreateImageAtIndex(source,0,nil)!,sw=img.width,sh=img.height
 let ctx=CGContext(data:nil,width:sw,height:sh,bitsPerComponent:8,bytesPerRow:sw*4,space:space,bitmapInfo:bitmap)!
 ctx.draw(img,in:CGRect(x:0,y:0,width:sw,height:sh))
 let pixels=ctx.data!.assumingMemoryBound(to:UInt8.self)
 func fg(_ x:Int,_ y:Int)->Bool {let i=(y*sw+x)*4,r=Int(pixels[i]),g=Int(pixels[i+1]),b=Int(pixels[i+2]);return !(r>160 && b>160 && g<110 && r-g>90 && b-g>90)}
 var l=sw,r=0,t=sh,b=0
 for y in 0..<sh{for x in 0..<sw where fg(x,y){l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
 let width=96,height=104,scale=min(94.0/Double(r-l+1),102.0/Double(b-t+1))
 let dw=Int((Double(r-l+1)*scale).rounded()),dh=Int((Double(b-t+1)*scale).rounded()),ox=(width-dw)/2,oy=height-dh-1
 var out=[UInt8](repeating:255,count:width*height*4)
 for y in 0..<height{for x in 0..<width {
  let o=(y*width+x)*4;out[o+1]=0
  if x<ox || x>=ox+dw || y<oy || y>=oy+dh{continue}
  let sx=l+min(r-l,Int(Double(x-ox)*Double(r-l+1)/Double(dw))),sy=t+min(b-t,Int(Double(y-oy)*Double(b-t+1)/Double(dh)))
  if !fg(sx,sy){continue}
  let i=(sy*sw+sx)*4;var best=0,distance=Int.max
  for (j,c)in palette.enumerated(){let d=(0..<3).reduce(0){$0+(c[$1]-Int(pixels[i+$1]))*(c[$1]-Int(pixels[i+$1]))};if d<distance{distance=d;best=j}}
  for k in 0..<3{out[o+k]=UInt8(palette[best][k])}
 }}
 let dest=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/"+id+"-native.png") as CFURL,UTType.png.identifier as CFString,1,nil)!
 CGImageDestinationAddImage(dest,makeImage(out,width,height),nil);precondition(CGImageDestinationFinalize(dest))
 print(id+": 96x104 native")
}
