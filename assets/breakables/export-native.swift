// Optional art authoring only. Native sheets are loaded directly by later game code.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
struct Spec:Decodable {let id:String;let frame:[Int];let variants:Int;let intact:String;let source:String?}
let root=CommandLine.arguments[1]
let specs=try JSONDecoder().decode([Spec].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/brief.json")))
let hex=["171c35","303750","526078","3e7775","83a89a","a88b70","d3b78d","f2d7a1","fff0cf","874c3b","c45c4b","ef9347","e5a995","f1b5bf","bfa8cf","b97a58","70402f"]
let colors=hex.map{v->[UInt8] in let n=Int(v,radix:16)!;return [UInt8((n>>16)&255),UInt8((n>>8)&255),UInt8(n&255),255]}
let magenta:[UInt8]=[255,0,255,255],cs=CGColorSpaceCreateDeviceRGB(),flags=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
struct Raster {
 let w:Int,h:Int;var p:[UInt8]
 init(_ w:Int,_ h:Int){self.w=w;self.h=h;self.p=Array(repeating:magenta,count:w*h).flatMap{$0}}
 init(_ file:String)throws{let src=CGImageSourceCreateWithURL(URL(fileURLWithPath:file) as CFURL,nil)!,img=CGImageSourceCreateImageAtIndex(src,0,nil)!;w=img.width;h=img.height;let c=CGContext(data:nil,width:w,height:h,bitsPerComponent:8,bytesPerRow:w*4,space:cs,bitmapInfo:flags)!;c.interpolationQuality = .none;c.draw(img,in:CGRect(x:0,y:0,width:w,height:h));p=Array(UnsafeBufferPointer(start:c.data!.assumingMemoryBound(to:UInt8.self),count:w*h*4))}
 func pixel(_ x:Int,_ y:Int)->[UInt8]{Array(p[(y*w+x)*4..<(y*w+x)*4+4])}
 mutating func set(_ x:Int,_ y:Int,_ c:[UInt8]){if x<0 || y<0 || x>=w || y>=h{return};p.replaceSubrange((y*w+x)*4..<(y*w+x)*4+4,with:c)}
 mutating func paste(_ a:Raster,_ x:Int,_ y:Int){for j in 0..<a.h {for i in 0..<a.w {set(x+i,y+j,a.pixel(i,j))}}}
 func save(_ file:String){let img=CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:cs,bitmapInfo:CGBitmapInfo(rawValue:flags),provider:CGDataProvider(data:Data(p) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!;let d=CGImageDestinationCreateWithURL(URL(fileURLWithPath:file) as CFURL,UTType.png.identifier as CFString,1,nil)!;CGImageDestinationAddImage(d,img,nil);precondition(CGImageDestinationFinalize(d))}
}
func foreground(_ c:[UInt8])->Bool {c[3]>128 && !(Int(c[0])>145 && Int(c[2])>145 && Int(c[1])<145 && Int(c[0])-Int(c[1])>65 && Int(c[2])-Int(c[1])>65)}
func nearest(_ c:[UInt8])->Int {(0..<colors.count).min{a,b in (0..<3).reduce(0){$0+pow(Double(colors[a][$1])-Double(c[$1]),2)} < (0..<3).reduce(0){$0+pow(Double(colors[b][$1])-Double(c[$1]),2)}}!}
func variant(_ n:Int,_ v:Int,_ id:String,_ y:Int,_ h:Int)->Int {
 var out=n
 if v==1 {out=[3:2,4:5,14:10][n] ?? n}
 if v==2 {out=[3:9,4:5,14:4][n] ?? n}
 if id=="water_cooler" && v==1 {out=[3:2,7:6,8:7][n] ?? n}
 if id=="water_cooler" && v==2 {out=n;if y>=h*45/100 {out=[3:9,7:6,8:7][n] ?? n}}
 return out
}
// Sample generated cells with nearest neighbor, normalize palette and add a hard navy boundary.
func sample(_ source:Raster,_ box:[Int],_ w:Int,_ h:Int,_ maxW:Int,_ maxH:Int,_ anchorY:Int?=nil)->Raster {
 var l=box[0]+box[2],r=box[0],t=box[1]+box[3],b=box[1]
 for y in box[1]..<min(source.h,box[1]+box[3]) {for x in box[0]..<min(source.w,box[0]+box[2]) where foreground(source.pixel(x,y)) {l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
 precondition(l<r && t<b,"Empty source cell")
 let scale=min(Double(maxW)/Double(r-l+1),Double(maxH)/Double(b-t+1)),dw=max(1,Int((Double(r-l+1)*scale).rounded())),dh=max(1,Int((Double(b-t+1)*scale).rounded())),ox=(w-dw)/2,oy=(anchorY ?? (h-3))+1-dh
 var out=Raster(w,h)
 for y in 0..<dh {for x in 0..<dw {let c=source.pixel(l+min(r-l,Int(Double(x)*Double(r-l+1)/Double(dw))),t+min(b-t,Int(Double(y)*Double(b-t+1)/Double(dh))));if foreground(c){out.set(ox+x,oy+y,colors[nearest(c)])}}}
 let raw=out
 for y in 1..<h-1 {for x in 1..<w-1 where raw.pixel(x,y) != magenta {if [(x-1,y),(x+1,y),(x,y-1),(x,y+1)].contains(where:{raw.pixel($0.0,$0.1)==magenta}){out.set(x,y,colors[0])}}}
 return out
}
for s in specs {
 let sourceFile=root+"/"+(s.source ?? ("sources/"+s.id+"-damage-source-v1.png"));if !FileManager.default.fileExists(atPath:sourceFile){continue}
 let source=try Raster(sourceFile),original=try Raster(root+"/"+s.intact),w=s.frame[0],h=s.frame[1],top=source.h*72/100,cw=source.w/2
 var minX=w,maxX=0,minY=h,maxY=0
 for y in 0..<h {for x in 0..<w where foreground(original.pixel(x,y)){minX=min(minX,x);maxX=max(maxX,x);minY=min(minY,y);maxY=max(maxY,y)}}
 let cracked=sample(source,[0,0,cw,top],w,h,maxX-minX+1,maxY-minY+1,maxY)
 var broken=sample(source,[cw,0,source.w-cw,top],w,h,w-4,max(12,(maxY-minY+1)/3),maxY)
 // A native 3x5 LCD retains the explicitly requested joke at 1x.
 if s.id=="printer" {
  let glyphs:[Character:String]=["P":"110101110100100","C":"011100100100011","L":"100100100100111","O":"010101101101010","A":"010101111101101","D":"110101101101110","E":"111100110100111","T":"111010010010010","R":"110101110101101"]
  let text=Array("PC LOAD LETTER"),left=(w-59)/2,top=maxY-10
  for y in 0..<9 {for x in 0..<59 {broken.set(left+x,top+y,colors[(x==0 || x==58 || y==0 || y==8) ? 0:4])}}
  for (i,ch) in text.enumerated(){if let bits=glyphs[ch]{for (n,v) in bits.enumerated() where v=="1" {broken.set(left+2+i*4+n%3,top+2+n/3,colors[0])}}}
 }
 var sheet=Raster(w*3,h*s.variants),debris=Raster(16*6,16*s.variants)
 for v in 0..<s.variants {
  var intact=Raster(w,h);for y in 0..<h {for x in 0..<w {intact.set(x,y,original.pixel(v*w+x,y))}}
  sheet.paste(intact,0,v*h)
  for (state,frame) in [cracked,broken].enumerated(){var a=frame;for y in 0..<h {for x in 0..<w {let c=a.pixel(x,y);if c != magenta {a.set(x,y,colors[variant(nearest(c),v,s.id,y,h)])}}};sheet.paste(a,(state+1)*w,v*h);a.save(root+"/"+s.id+"-"+["cracked","broken"][state]+"-color-"+String(v+1)+"-v1.png")}
  for n in 0..<6 {var a=sample(source,[source.w*n/6,top,source.w/6,source.h-top],16,16,12,12);for y in 0..<16 {for x in 0..<16 {let c=a.pixel(x,y);if c != magenta {a.set(x,y,colors[variant(nearest(c),v,s.id,h-1,h)])}}};debris.paste(a,n*16,v*16)}
 }
 sheet.save(root+"/"+s.id+"-states-v1.png");debris.save(root+"/"+s.id+"-debris-v1.png");print("\(s.id): 3 states x \(s.variants) colors, six 16px debris per color")
}
