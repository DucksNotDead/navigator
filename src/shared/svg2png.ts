import sharp from "sharp";

export async function svg2Png(svgPath: string): Promise<string> {
	const pngPath = svgPath.replace('.svg', '.png')

	await sharp(svgPath)
		.resize(400, 400, {
			fit: "contain",
			background: { r: 255, g: 255, b: 255, alpha: 0 }
		})
		.png()
		.toFile(pngPath);

	return pngPath;
}
