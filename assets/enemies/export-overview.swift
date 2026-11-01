// Preview only: canonical PNGs remain unchanged. Synchronized pose comparison.
import Foundation
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers
struct Spec:Decodable {let id:String;let size:Int;let frames:Int}
let root=CommandLine.arguments[1]
let specs=try JSONDecoder().decode([Spec].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/batch-1.json")))
let names=["Bill","Late Fee","Spam Likely","Late-Night Donut","Back Twinge","Reply-All","3 AM Thought","Calendar Invite","Group Chat","Math Homework","Chat Ping"]
let w=768,h=630,space=CGColorSpaceCreateDeviceRGB(),bits=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
var sprites:[[UInt8]]=[]
for s in specs {
 let image=CGImageSourceCreateImageAtIndex(CGImageSourceCreateWithURL(URL(fileURLWithPath:root+"/enemy-"+s.id+"-v1.png") as CFURL,nil)!,0,nil)!
 let c=CGContext(data:nil,width:image.width,height:image.height,bitsPerComponent:8,bytesPerRow:image.width*4,space:space,bitmapInfo:bits)!
 c.draw(image,in:CGRect(x:0,y:0,width:image.width,height:image.height))
 sprites.append(Array(UnsafeBufferPointer(start:c.data!.assumingMemoryBound(to:UInt8.self),count:image.width*image.height*4)))
}
let gif=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-batch-1-overview.gif") as CFURL,UTType.gif.identifier as CFString,4,nil)!
CGImageDestinationSetProperties(gif,[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFLoopCount:0]] as CFDictionary)
for f in 0..<4 {
 var data=[UInt8](repeating:255,count:w*h*4)
 for y in 0..<h{for x in 0..<w {let i=(y*w+x)*4;data[i]=23;data[i+1]=28;data[i+2]=53}}
 for (j,s) in specs.enumerated(){
  let col=j%4,row=j/4,n=s.size,sw=n*s.frames,scale=3,cx=col*192+(192-n*scale)/2,cy=row*210+18+(144-n*scale)/2
  for y in 0..<n*scale{for x in 0..<n*scale {
   let i=((y/scale)*sw+(f%s.frames)*n+x/scale)*4,o=((cy+y)*w+cx+x)*4
   if sprites[j][i]==255 && sprites[j][i+1]==0 && sprites[j][i+2]==255{continue}
   for k in 0..<3{data[o+k]=sprites[j][i+k]}
  }}
 }
 let provider=CGDataProvider(data:Data(data) as CFData)!
 let image=CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:space,bitmapInfo:CGBitmapInfo(rawValue:bits),provider:provider,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!
 let context=CGContext(data:nil,width:w,height:h,bitsPerComponent:8,bytesPerRow:w*4,space:space,bitmapInfo:bits)!
 context.draw(image,in:CGRect(x:0,y:0,width:w,height:h))
 for (j,name) in names.enumerated(){
  let text=CFAttributedStringCreate(nil,name as CFString,[kCTFontAttributeName:CTFontCreateWithName("Menlo-Bold" as CFString,12,nil),kCTForegroundColorAttributeName:CGColor(red:1,green:0.94,blue:0.81,alpha:1)] as CFDictionary)!
  let line=CTLineCreateWithAttributedString(text),width=CTLineGetTypographicBounds(line,nil,nil,nil)
  context.textPosition=CGPoint(x:Double(j%4*192+96)-width/2,y:Double(h-(j/4*210+183)))
  CTLineDraw(line,context)
 }
 let final=context.makeImage()!
 CGImageDestinationAddImage(gif,final,[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFDelayTime:0.18]] as CFDictionary)
 if f==0 {
  let png=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-batch-1-overview.png") as CFURL,UTType.png.identifier as CFString,1,nil)!
  CGImageDestinationAddImage(png,final,nil);precondition(CGImageDestinationFinalize(png))
 }
}
precondition(CGImageDestinationFinalize(gif))
print("Overview PNG/GIF: 768x630, four synchronized poses, native 3x pixels")
