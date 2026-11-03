// Offline native export. Run with the coworker asset folder as the only argument.
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct Coworker: Decodable {
    let id: String
    let idleMs: Double
    let reactionMs: Double
}
let directory = URL(fileURLWithPath: CommandLine.arguments[1])
let cast = try JSONDecoder().decode([Coworker].self, from: Data(contentsOf: directory.appendingPathComponent("cast-v1.json")))
let palette = "171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f".split(separator: " ").map { hex -> [UInt8] in
    let n = Int(hex, radix: 16)!
    return [UInt8(n >> 16), UInt8((n >> 8) & 255), UInt8(n & 255)]
}
let colorSpace = CGColorSpaceCreateDeviceRGB()
let flags = CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.premultipliedLast.rawValue
let width = 48, height = 56, columns = 4
let magenta: [UInt8] = [255, 0, 255]
let backdrop: [UInt8] = [211, 183, 141]

func bitmap(_ colors: [Int], width: Int, height: Int, scale: Int, background: [UInt8]) -> CGImage {
    let w = width*scale, h = height*scale
    var bytes = [UInt8](repeating: 255, count: w*h*4)
    for y in 0..<h {
        for x in 0..<w {
            let color = colors[(y/scale)*width+x/scale]
            let rgb = color < 0 ? background : palette[color]
            for c in 0..<3 { bytes[(y*w+x)*4+c] = rgb[c] }
        }
    }
    return CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w*4,
        space: colorSpace, bitmapInfo: CGBitmapInfo(rawValue: flags), provider: CGDataProvider(data: Data(bytes) as CFData)!,
        decode: nil, shouldInterpolate: false, intent: .defaultIntent)!
}

func closest(_ r: Int, _ g: Int, _ b: Int) -> Int {
    func distance(_ i: Int) -> Int {
        let p = palette[i], x = r-Int(p[0]), y = g-Int(p[1]), z = b-Int(p[2])
        return x*x+y*y+z*z
    }
    return palette.indices.min { distance($0) < distance($1) }!
}

// Alternate work clothes while leaving faces and held props alone.
let fabric: [String: [Int: Int]] = [
    "mute": [3:2,4:14,2:14], "salad": [5:3,6:4,10:3,11:4],
    "dozer": [5:14,14:4,2:3,13:4], "intern": [9:3,10:3,11:4,15:2],
    "retiring": [1:3,2:3,3:4,4:14,5:14], "email": [1:3,2:4,3:4]
]
for coworker in cast {
    let id = coworker.id
    let url = directory.appendingPathComponent("coworker-\(id)-study-v1.png")
    let source = CGImageSourceCreateWithURL(url as CFURL, nil)!
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)!
    let w = image.width, h = image.height, cw = w/4, ch = h/2
    let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: colorSpace, bitmapInfo: flags)!
    ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))
    let bytes = ctx.data!.assumingMemoryBound(to: UInt8.self)
    func ink(_ x: Int, _ y: Int) -> Bool {
        let i = (y*w+x)*4, r = Int(bytes[i]), g = Int(bytes[i+1]), b = Int(bytes[i+2])
        return !(r>135 && b>115 && r-g>70 && b-g>55)
    }
    var frames = [[Int]]()
    for n in 0..<8 {
        let x0 = n%4*cw, y0 = n/4*ch
        var left = cw, right = 0, top = ch, bottom = 0
        for y in 0..<ch {
            for x in 0..<cw where ink(x+x0,y+y0) {
                left = min(left,x)
                right = max(right,x)
                top = min(top,y)
                bottom = max(bottom,y)
            }
        }
        precondition(right>left && bottom>top, "Empty pose \(id) \(n)")
        let sw = right-left+1, sh = bottom-top+1
        // The seated head, torso and hands all fit in the existing 34px crop.
        let scale = min(37.0/Double(sw), 32.0/Double(sh))
        let dw = Int((Double(sw)*scale).rounded()), dh = Int((Double(sh)*scale).rounded())
        let ox = (width-dw)/2, oy = 34-dh
        var frame = [Int](repeating: -1, count: width*height)
        for y in 0..<dh {
            for x in 0..<dw {
                let sx = x0+left+min(sw-1,Int((Double(x)+0.5)/scale))
                let sy = y0+top+min(sh-1,Int((Double(y)+0.5)/scale))
                guard ink(sx,sy) else { continue }
                let i = (sy*w+sx)*4
                frame[(oy+y)*width+ox+x] = closest(Int(bytes[i]),Int(bytes[i+1]),Int(bytes[i+2]))
            }
        }
        let raw = frame
        for y in 1..<height-1 {
            for x in 1..<width-1 {
                let i = y*width+x
                if raw[i]>=0 && [raw[i-1],raw[i+1],raw[i-width],raw[i+width]].contains(-1) { frame[i] = 0 }
            }
        }
        frames.append(frame)
    }
    for original in frames.prefix(8) {
        var variant = original
        for y in 20..<34 {
            for x in 0..<width {
                let i = y*width+x
                if let color = fabric[id]?[original[i]] { variant[i] = color }
            }
        }
        frames.append(variant)
    }
    let aw = width*columns, ah = height*4
    var atlas = [Int](repeating: -1, count: aw*ah)
    for (n, frame) in frames.enumerated() {
        for y in 0..<height {
            let start = (n/columns*height+y)*aw+n%columns*width
            atlas.replaceSubrange(start..<start+width, with: frame[y*width..<(y+1)*width])
        }
    }
    let png = CGImageDestinationCreateWithURL(directory.appendingPathComponent("coworker-\(id)-v1.png") as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(png, bitmap(atlas,width:aw,height:ah,scale:1,background:magenta),nil)
    precondition(CGImageDestinationFinalize(png))
    let gif = CGImageDestinationCreateWithURL(directory.appendingPathComponent("coworker-\(id)-preview-v1.gif") as CFURL, UTType.gif.identifier as CFString, 8, nil)!
    CGImageDestinationSetProperties(gif,[kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFLoopCount:0]] as CFDictionary)
    for n in 0..<8 {
        let delay = (n<4 ? coworker.idleMs : coworker.reactionMs)/1000
        CGImageDestinationAddImage(gif,bitmap(frames[n],width:width,height:36,scale:3,background:backdrop),
            [kCGImagePropertyGIFDictionary:[kCGImagePropertyGIFDelayTime:delay]] as CFDictionary)
    }
    precondition(CGImageDestinationFinalize(gif))
    print("\(id): \(aw)x\(ah), 16 poses across two colorways")
}
