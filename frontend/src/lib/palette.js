// Background color extraction in the browser with node-vibrant's own building blocks
// (@vibrant/*), replacing the node-vibrant 3 bundle (same approach as digidash).
// Unsplash images are served with CORS headers, so the canvas can read them.
import { BasicPipeline, Vibrant } from '@vibrant/core';
import { DefaultGenerator } from '@vibrant/generator-default';
import { BrowserImage } from '@vibrant/image-browser';
import { MMCQ } from '@vibrant/quantizer-mmcq';

// Same pipeline/options as node-vibrant/browser.
const pipeline = new BasicPipeline().filter
  .register('default', (r, g, b, a) => a >= 125 && !(r > 250 && g > 250 && b > 250))
  .quantizer.register('mmcq', MMCQ)
  .generator.register('default', DefaultGenerator);

Vibrant.use(pipeline);
Object.assign(Vibrant.DefaultOpts, {
  ImageClass: BrowserImage,
  quantizer: 'mmcq',
  generators: ['default'],
  filters: ['default'],
});

const toRgb = (swatch) => (swatch ? swatch.rgb.map(Math.trunc).join(', ') : null);

// Resolves to the image's vibrant color as an "r, g, b" string (what trips.trip_bg_color
// stores), falling back to the other swatches, or null if none could be found.
export async function getVibrantColor(imageUrl) {
  const palette = await Vibrant.from(imageUrl).getPalette();
  return (
    toRgb(palette.Vibrant) ??
    toRgb(palette.DarkVibrant) ??
    toRgb(palette.Muted) ??
    toRgb(palette.LightVibrant)
  );
}
