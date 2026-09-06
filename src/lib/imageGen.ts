// Pollinations.ai dynamic prompt URL generator

export function getPollinationsImageUrl(
  prompt: string,
  category: 'Physical' | 'Conceptual' = 'Conceptual',
  seed: number = 42
): string {
  const styleEnhancement =
    category === 'Physical'
      ? '2D flat vector minimalist instructional manual, clean bone white background, crisp black outlines, diagrammatic movement steps, retro aesthetic'
      : 'technical blueprint schematic, chalkboard aesthetic, minimalist vector lines, high contrast digital retro diagram, educational manual';

  const fullPrompt = `${prompt}, ${styleEnhancement}`;
  const encoded = encodeURIComponent(fullPrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${seed}`;
}
