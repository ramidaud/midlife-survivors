import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let root=CommandLine.arguments[1]
let names=["01-swarm-v1","02-midlife-panorama-v1","03-eight-fifty-nine-lobby-v1"]
for name in names {
  let url=URL(fileURLWithPath:root+"/"+name+".png")
  let source=CGImageSourceCreateWithURL(url as CFURL,nil)!
  let original=CGImageSourceCreateImageAtIndex(source,0,nil)!
  let context=CGContext(data:nil,width:1920,height:1080,bitsPerComponent:8,bytesPerRow:1920*4,space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
  context.setShouldAntialias(false);context.interpolationQuality = .none
  context.draw(original,in:CGRect(x:0,y:0,width:1920,height:1080))
  let image=context.makeImage()!
  let output=CGImageDestinationCreateWithURL(url as CFURL,UTType.png.identifier as CFString,1,nil)!
  CGImageDestinationAddImage(output,image,nil)
  guard CGImageDestinationFinalize(output) else {fatalError("PNG export failed")}
  if name=="03-eight-fifty-nine-lobby-v1" {
    let crop=image.cropping(to:CGRect(x:510,y:0,width:900,height:1080))!
    let preview=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/03-lobby-center-crop-preview.png") as CFURL,UTType.png.identifier as CFString,1,nil)!
    CGImageDestinationAddImage(preview,crop,nil)
    guard CGImageDestinationFinalize(preview) else {fatalError("Crop export failed")}
  }
  print("Exported \(name): 1920x1080, nearest-neighbor")
}
