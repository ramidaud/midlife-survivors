// Offline native export for Batch 1. No gameplay or build dependencies.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

struct Spec:Decodable {let id:String;let size:Int;let frames:Int;let delay:Double;let anchor:String}
let root=CommandLine.arguments[1]
let specs=try JSONDecoder().decode([Spec].self,from:Data(contentsOf:URL(fileURLWithPath:root+"/batch-1.json")))
let colors=["171c35","303750","526078","3e7775","83a89a","a88b70","d3b78d","f2d7a1","fff0cf","874c3b","c45c4b","ef9347","e5a995","f1b5bf","bfa8cf"]
let palette=colors.map{v->[Int] in let n=Int(v,radix:16)!;return[(n>>16)&255,(n>>8)&255,n&255]}
let space=CGColorSpaceCreateDeviceRGB()
let bitmap=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
func makeImage(_ bytes:[UInt8],_ w:Int,_ h:Int)->CGImage {
 return CGImage(width:w,height:h,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:w*4,space:space,bitmapInfo:CGBitmapInfo(rawValue:bitmap),provider:CGDataProvider(data:Data(bytes) as CFData)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!
}
for spec in specs where spec.id != "bill" {
 let inputURL=URL(fileURLWithPath:root+"/enemy-"+spec.id+"-source-v1.png")
 if !FileManager.default.fileExists(atPath:inputURL.path){print("Pending source: \(spec.id)");continue}
 let source=CGImageSourceCreateWithURL(inputURL as CFURL,nil)!,image=CGImageSourceCreateImageAtIndex(source,0,nil)!
 let sw=image.width,sh=image.height,cw=sw/spec.frames,n=spec.size,total=n*spec.frames
 precondition(sw%spec.frames==0,"Uneven source cells: \(spec.id)")
 let context=CGContext(data:nil,width:sw,height:sh,bitsPerComponent:8,bytesPerRow:sw*4,space:space,bitmapInfo:bitmap)!
 context.draw(image,in:CGRect(x:0,y:0,width:sw,height:sh))
 let pixels=context.data!.bindMemory(to:UInt8.self,capacity:sw*sh*4)
 func fg(_ x:Int,_ y:Int)->Bool {
  if x<0 || y<0 || x>=sw || y>=sh{return false}
  let i=(y*sw+x)*4,r=Int(pixels[i]),g=Int(pixels[i+1]),b=Int(pixels[i+2])
  return !(r>150 && b>150 && g<130 && r-g>80 && b-g>80)
 }
 var boxes:[[Int]]=[]
 for f in 0..<spec.frames {
  var l=cw,r=0,t=sh,b=0
  for y in 0..<sh{for x in 0..<cw where fg(f*cw+x,y){l=min(l,x);r=max(r,x);t=min(t,y);b=max(b,y)}}
  precondition(l<r && t<b,"Empty source cell: \(spec.id) \(f)");boxes.append([l,t,r,b])
 }
 let l=boxes.map{$0[0]}.min()!,r=boxes.map{$0[2]}.max()!,t=boxes.map{$0[1]}.min()!,b=boxes.map{$0[3]}.max()!
 let maxW=spec.anchor=="feet" ? boxes.map{$0[2]-$0[0]+1}.max()! : r-l+1
 let maxH=spec.anchor=="feet" ? boxes.map{$0[3]-$0[1]+1}.max()! : b-t+1
 let padding=n==16 ? 2 : 3,usable=n-2*padding
 let scale=min(Double(usable)/Double(maxW),Double(usable)/Double(maxH))
 var sheet=[UInt8](repeating:0,count:total*n*4),masks:[[Bool]]=[]
 for f in 0..<spec.frames {
  var mask=[Bool](repeating:false,count:n*n)
  let centerX=spec.anchor=="feet" ? Double(boxes[f][0]+boxes[f][2])/2 : Double(l+r)/2
  for y in 0..<n{for x in 0..<n {
   let o=(y*total+f*n+x)*4;sheet[o]=255;sheet[o+2]=255;sheet[o+3]=255
   let sx=Int((Double(x)-Double(n-1)/2)/scale+centerX)
   let sy=spec.anchor=="feet" ? Int((Double(y)-Double(n-padding))/scale+Double(boxes[f][3])) : Int((Double(y)-Double(n-1)/2)/scale+Double(t+b)/2)
   if sx<0 || sx>=cw || !fg(f*cw+sx,sy){continue}
   let i=(sy*sw+f*cw+sx)*4,rgb=[Int(pixels[i]),Int(pixels[i+1]),Int(pixels[i+2])]
   var best=0,distance=Int.max
   for (j,c) in palette.enumerated(){
    if spec.id=="3am-thought" && [3,4,5,6,11,12].contains(j){continue}
    let d=(c[0]-rgb[0])*(c[0]-rgb[0])+(c[1]-rgb[1])*(c[1]-rgb[1])+(c[2]-rgb[2])*(c[2]-rgb[2]);if d<distance{best=j;distance=d}}
   for k in 0..<3{sheet[o+k]=UInt8(palette[best][k])};mask[y*n+x]=true
  }}
  // Sampling a narrow boot tip can lose its final row. Align feet after
  // sampling, then give the donut's airborne phases a two-pixel lift.
  if spec.anchor=="feet" {
   let bottom=(0..<n).filter{y in (0..<n).contains{x in mask[y*n+x]}}.max()!
   let target=n-padding-((spec.id=="late-night-donut" && f%2==1) ? 2 : 0)
   let shift=target-bottom
   if shift != 0 {
    var moved=[Bool](repeating:false,count:n*n)
    let prior=sheet
    for y in 0..<n{for x in 0..<n {
     let o=(y*total+f*n+x)*4,old=y-shift
     sheet[o]=255;sheet[o+1]=0;sheet[o+2]=255
     if old>=0 && old<n && mask[old*n+x] {
      let i=(old*total+f*n+x)*4
      for k in 0..<3{sheet[o+k]=prior[i+k]};moved[y*n+x]=true
     }
    }}
    mask=moved
   }
  }
  masks.append(mask)
 }
 for f in 0..<spec.frames {
  // Faded ghost cells retain their source dithering; outlining every omitted
  // checker pixel would turn the fade into a dark solid mesh.
  if spec.id=="3am-thought" && (f==1 || f==2){continue}
  let mask=masks[f]
  for y in 1..<n-1{for x in 1..<n-1 where mask[y*n+x] {
   if !mask[y*n+x-1] || !mask[y*n+x+1] || !mask[(y-1)*n+x] || !mask[(y+1)*n+x] {
    let i=(y*total+f*n+x)*4;sheet[i]=23;sheet[i+1]=28;sheet[i+2]=53
   }
  }}
 }
 let output=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-"+spec.id+"-v1.png") as CFURL,UTType.png.identifier as CFString,1,nil)!
 CGImageDestinationAddImage(output,makeImage(sheet,total,n),nil);precondition(CGImageDestinationFinalize(output))
 let gif=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/enemy-"+spec.id+"-preview-v1.gif") as CFURL,UTType.gif.identifier as CFString,spec.frames,nil)!
 CGImageDestinationSetProperties(gif,[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFLoopCount:0]] as CFDictionary)
 for f in 0..<spec.frames {
  let display=n*4;var frame=[UInt8](repeating:255,count:display*display*4)
  for y in 0..<display{for x in 0..<display {
   let i=((y/4)*total+f*n+x/4)*4,o=(y*display+x)*4,bg=sheet[i]==255 && sheet[i+1]==0 && sheet[i+2]==255
   for k in 0..<3{frame[o+k]=bg ? [48,55,80][k] : sheet[i+k]}
  }}
  CGImageDestinationAddImage(gif,makeImage(frame,display,display),[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFDelayTime:spec.delay]] as CFDictionary)
 }
 precondition(CGImageDestinationFinalize(gif))
 let counts=masks.map{$0.filter{$0}.count}
 precondition(counts.allSatisfy{$0>12},"Sparse native frames: \(spec.id)")
 for mask in masks {
  precondition((0..<n).allSatisfy{!mask[$0] && !mask[(n-1)*n+$0] && !mask[$0*n] && !mask[$0*n+n-1]},"Clipped native frame: \(spec.id)")
 }
 print("\(spec.id): \(total)x\(n), \(spec.frames) frames, counts \(counts)")
}
