// Optional art authoring only. Native sheets are loaded directly by later game code.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
let root=CommandLine.arguments[1]
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

let old=try Raster(root+"/car_compact-v1.png"),fw=144,fh=112
precondition(old.w==fw*3 && old.h==fh)
var combined=Raster(fw*5,fh),extra=Raster(fw*2,fh)
combined.paste(old,0,0)
let maps=[[6:2,7:3,8:4],[6:10,7:11,8:7]]
for n in 0..<2 {
 var a=Raster(fw,fh)
 for y in 0..<fh {for x in 0..<fw {var c=old.pixel(x,y);if let index=colors.firstIndex(of:c),let next=maps[n][index]{c=colors[next]};a.set(x,y,c)}}
 combined.paste(a,(n+3)*fw,0);extra.paste(a,n*fw,0);a.save(root+"/car_compact-campus-color-"+String(n+4)+"-v2.png")
}
combined.save(root+"/car_compact-campus-v2.png");extra.save(root+"/car_compact-extra-v2.png")
print("Car paints: three original frames copied exactly, two new native colorways appended.")
