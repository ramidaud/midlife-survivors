// Offline art export only. No game engine or gameplay code is changed.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let root=CommandLine.arguments[1]
let source=CGImageSourceCreateWithURL(URL(fileURLWithPath:root+"/enemy-bill-source-v1.png") as CFURL,nil)!
let input=CGImageSourceCreateImageAtIndex(source,0,nil)!
let width=input.width,height=input.height,cell=width/4
precondition(width%4==0,"Source must have four equal columns")
let space=CGColorSpaceCreateDeviceRGB()
let bitmap=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
let ctx=CGContext(data:nil,width:width,height:height,bitsPerComponent:8,bytesPerRow:width*4,space:space,bitmapInfo:bitmap)!
ctx.draw(input,in:CGRect(x:0,y:0,width:width,height:height))
let pixels=ctx.data!.bindMemory(to:UInt8.self,capacity:width*height*4)
func foreground(_ x:Int,_ y:Int)->Bool {
 if x<0 || y<0 || x>=width || y>=height{return false}
 let i=(y*width+x)*4,r=Int(pixels[i]),g=Int(pixels[i+1]),b=Int(pixels[i+2])
 return !(r>150 && b>150 && g<130 && r-g>80 && b-g>80)
}
let hex=["171c35","303750","526078","3e7775","83a89a","a88b70","d3b78d","f2d7a1","fff0cf","874c3b","c45c4b","ef9347","e5a995","f1b5bf","bfa8cf"]
let palette=hex.map{value->[Int] in let n=Int(value,radix:16)!;return [(n>>16)&255,(n>>8)&255,n&255]}
var boxes:[[Int]]=[]
for frame in 0..<4 {
 var left=cell,right=0,top=height,bottom=0
 for y in 0..<height {for x in 0..<cell where foreground(frame*cell+x,y) {
  left=min(left,x);right=max(right,x);top=min(top,y);bottom=max(bottom,y)
 }}
 precondition(left<right && top<bottom,"Missing source frame")
 boxes.append([left,top,right,bottom])
}
let maxW=boxes.map{$0[2]-$0[0]+1}.max()!,maxH=boxes.map{$0[3]-$0[1]+1}.max()!
let scale=min(42.0/Double(maxW),42.0/Double(maxH))
var sheet=[UInt8](repeating:0,count:192*48*4)
var masks=[[Bool]]()
for frame in 0..<4 {
 let box=boxes[frame],center=Double(box[0]+box[2])/2
 var mask=[Bool](repeating:false,count:48*48)
 for y in 0..<48 {for x in 0..<48 {
  let out=(y*192+frame*48+x)*4
  sheet[out]=255;sheet[out+1]=0;sheet[out+2]=255;sheet[out+3]=255
  let sx=Int((Double(x)-23.5)/scale+center),sy=Int((Double(y)-45)/scale+Double(box[3]))
  if sx<0 || sx>=cell || !foreground(frame*cell+sx,sy){continue}
  let i=(sy*width+frame*cell+sx)*4
  let rgb=[Int(pixels[i]),Int(pixels[i+1]),Int(pixels[i+2])]
  let color=palette.min{a,b in zip(a,rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)} < zip(b,rgb).reduce(0){$0+($1.0-$1.1)*($1.0-$1.1)}}!
  for k in 0..<3 {sheet[out+k]=UInt8(color[k])};mask[y*48+x]=true
 }}
 masks.append(mask)
}
// Restore a consistent one-logical-pixel navy silhouette outline after sampling.
for frame in 0..<4 {let mask=masks[frame]
 for y in 1..<47 {for x in 1..<47 where mask[y*48+x] {
  if !mask[y*48+x-1] || !mask[y*48+x+1] || !mask[(y-1)*48+x] || !mask[(y+1)*48+x] {
   let i=(y*192+frame*48+x)*4;sheet[i]=23;sheet[i+1]=28;sheet[i+2]=53
  }
 }}
}
func image(_ pixels:[UInt8],_ w:Int,_ h:Int)->CGImage {
 let data=Data(pixels) as CFData
 return CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:space,bitmapInfo:CGBitmapInfo(rawValue:bitmap),provider:CGDataProvider(data:data)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!
}
let native=image(sheet,192,48)
let png=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-bill-v1.png") as CFURL,UTType.png.identifier as CFString,1,nil)!
CGImageDestinationAddImage(png,native,nil);precondition(CGImageDestinationFinalize(png))
let gif=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-bill-preview-v1.gif") as CFURL,UTType.gif.identifier as CFString,4,nil)!
CGImageDestinationSetProperties(gif,[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFLoopCount:0]] as CFDictionary)
for frame in 0..<4 {
 var preview=[UInt8](repeating:255,count:192*192*4)
 for y in 0..<192 {for x in 0..<192 {
  let sx=x/4,sy=y/4,i=(sy*192+frame*48+sx)*4,o=(y*192+x)*4
  let bg=sheet[i]==255 && sheet[i+1]==0 && sheet[i+2]==255
  for k in 0..<3 {preview[o+k]=bg ? [48,55,80][k] : sheet[i+k]}
 }}
 CGImageDestinationAddImage(gif,image(preview,192,192),[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFDelayTime:0.18]] as CFDictionary)
}
precondition(CGImageDestinationFinalize(gif))
let counts=masks.map{$0.filter{$0}.count}
precondition(counts.allSatisfy{$0>200},"Sparse or empty native frame")
for frame in 0..<4 {
 precondition((0..<48).allSatisfy{!masks[frame][$0] && !masks[frame][47*48+$0]},"Top/bottom padding missing")
 precondition((0..<48).allSatisfy{!masks[frame][$0*48] && !masks[frame][$0*48+47]},"Side padding missing")
}
print("Exported 192x48 sheet: four 48x48 frames, shared scale, baseline y45, opaque magenta, palette limited. Foreground pixels: \(counts)")
