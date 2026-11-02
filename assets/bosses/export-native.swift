// Optional art authoring only. Native sheets are loaded directly by later game code.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
struct Spec:Decodable {let id:String}
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
func bounds(_ source:Raster,_ box:[Int])->[Int] {
 var l=box[0]+box[2],r=box[0],t=box[1]+box[3],b=box[1]
 for y in box[1]..<box[1]+box[3] {for x in box[0]..<box[0]+box[2] where foreground(source.pixel(x,y)){l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
 precondition(l<r && t<b,"Empty boss pose");return [l,t,r-l+1,b-t+1]
}
func frame(_ source:Raster,_ box:[Int],_ scale:Double)->Raster {
 let w=144,h=152,dw=Int((Double(box[2])*scale).rounded()),dh=Int((Double(box[3])*scale).rounded()),ox=(w-dw)/2,oy=148-dh
 var out=Raster(w,h)
 for y in 0..<dh {for x in 0..<dw {let c=source.pixel(box[0]+min(box[2]-1,Int(Double(x)*Double(box[2])/Double(dw))),box[1]+min(box[3]-1,Int(Double(y)*Double(box[3])/Double(dh))));if foreground(c){out.set(ox+x,oy+y,colors[nearest(c)])}}}
 let raw=out
 for y in 1..<h-1 {for x in 1..<w-1 where raw.pixel(x,y) != magenta {if [(x-1,y),(x+1,y),(x,y-1),(x,y+1)].contains(where:{raw.pixel($0.0,$0.1)==magenta}){out.set(x,y,colors[0])}}}
 return out
}
for s in specs {
 let source=try Raster(root+"/sources/"+s.id+"-source-v1.png")
 var boxes=[[Int]]()
 for n in 0..<11 {let col=n%4,row=n/4,x=source.w*col/4,y=source.h*row/3,right=source.w*(col+1)/4,bottom=source.h*(row+1)/3;boxes.append(bounds(source,[x,y,right-x,bottom-y]))}
 let reference=boxes.enumerated().filter{![8,9].contains($0.offset)}.map{$0.element}
 let maxW=reference.map{$0[2]}.max()!,maxH=reference.map{$0[3]}.max()!,factor=min(136.0/Double(maxW),144.0/Double(maxH))
 var attacks=[Raster]()
 let fixFile=root+"/sources/"+s.id+"-attack-source-v2.png"
 if FileManager.default.fileExists(atPath:fixFile){let fix=try Raster(fixFile),left=fix.w/2,pair=[bounds(fix,[0,0,left,fix.h]),bounds(fix,[left,0,fix.w-left,fix.h])];let scale=min(136.0/Double(pair.map{$0[2]}.max()!),144.0/Double(pair.map{$0[3]}.max()!));attacks=pair.map{frame(fix,$0,scale)}}
 var walkFix=[Raster]()
 if s.id=="30-year-mortgage" {let file=root+"/sources/30-year-mortgage-walk-source-v2.png";if FileManager.default.fileExists(atPath:file){let fix=try Raster(file),left=fix.w/2,pair=[bounds(fix,[0,0,left,fix.h]),bounds(fix,[left,0,fix.w-left,fix.h])],targetH=Double(boxes[0][3]+boxes[1][3]+boxes[2][3])/3*factor;let scale=min(136.0/Double(pair.map{$0[2]}.max()!),targetH/Double(pair.map{$0[3]}.max()!));walkFix=pair.map{frame(fix,$0,scale)}}}
 var sheet=Raster(576,456)
 let order=s.id=="performance-review" ? [0,1,3,2,4,5,6,7,8,9,10]:Array(0..<11)
 for (n,index) in order.enumerated(){let a=(!walkFix.isEmpty && [4,5].contains(n)) ? walkFix[n-4]:(!attacks.isEmpty && [8,9].contains(n)) ? attacks[n-8]:frame(source,boxes[index],factor);sheet.paste(a,(n%4)*144,(n/4)*152);a.save(root+"/"+s.id+"-frame-"+String(format:"%02d",n)+"-v1.png")}
 sheet.save(root+"/boss-"+s.id+"-v1.png")
 let markerSource=try Raster(root+"/sources/"+s.id+"-telegraph-source-v1.png"),mw=s.id=="30-year-mortgage" ? 192:256,mh=128
 var marker=sample(markerSource,[0,0,markerSource.w,markerSource.h],mw,mh,mw-8,mh-8)
 let choices=[0,7,10,11]
 for y in 0..<mh {for x in 0..<mw {let c=marker.pixel(x,y);if c != magenta {let n=choices.min{a,b in (0..<3).reduce(0){$0+pow(Double(colors[a][$1])-Double(c[$1]),2)} < (0..<3).reduce(0){$0+pow(Double(colors[b][$1])-Double(c[$1]),2)}}!;marker.set(x,y,colors[n])}}}
 var ys=[Int]()
 for y in 0..<mh {for x in 0..<mw where marker.pixel(x,y) != magenta {ys.append(y)}}
 let dy=(mh-(ys.max()!-ys.min()!+1))/2-ys.min()!;var centered=Raster(mw,mh)
 for y in 0..<mh {for x in 0..<mw {centered.set(x,y+dy,marker.pixel(x,y))}}
 marker=centered
 marker.save(root+"/telegraph-"+s.id+"-v1.png")
 print("\(s.id): eleven 144x152 poses on 4x3 grid, marker \(mw)x\(mh), common scale \(factor)")
}
