// Illustrations des Kitsune de départ (ceux créés avec le formulaire n'en ont pas)
const IMAGES: Record<string, string> = {
  'Tamamo-no-Mae': 'kitsunes/tamamo-no-mae.png',
  Kuzunoha: 'kitsunes/kuzunoha.png',
  Tenko: 'kitsunes/tenko.png',
  Nogitsune: 'kitsunes/nogitsune.png',
  Byakko: 'kitsunes/byakko.png',
};

export function imageDe(nom: string): string | undefined {
  return IMAGES[nom];
}
