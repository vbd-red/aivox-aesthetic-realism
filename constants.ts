export const HYPER_REALISTIC_STYLE_PROMPT = "High-end professional lifestyle photography. Pristine and immaculate environment. Elegant modern interior design with perfectly maintained surfaces, polished floors, and clean walls. Soft diffused natural light, warm and inviting home atmosphere. Everything is new, beautiful, and impeccably clean. High-fidelity textures and soft, professional lighting.";

export const NIKON_Z9_STYLE_PROMPT = "Commercial digital photography shot on Nikon Z 9, Nikkor Z 85mm f/1.2 S. Ultra-clean 45.7-megapixel resolution. Zero digital noise, corner-to-corner sharpness. Perfect skin tones, radiant appearance, and professional studio lighting. 14-bit RAW quality, crystal clear details.";

export const COLORS = {
  primary: '#E11D48',
  secondary: '#FFFFFF',
  accent: '#F59E0B',
  background: 'linear-gradient(135deg, #E11D48, #F59E0B)',
  border: '#E5E7EB',
  text: '#1F2937',
};

export const WHISK_LAYERS = {
  STYLE: "Masterpiece quality, award-winning aesthetics, ultra-sharp focus, professional high-end advertising photography",
  COLORS: "Perfect color balance, natural skin tones, vibrant but realistic palette, sophisticated color grading",
  TECH: "Arricam ST, Zeiss Master Prime lenses, 35mm film grain, 8k resolution, cinematic lighting"
};

export const AI_MODELS = [
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro (Ultimate)', type: 'pro' },
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash (Speed)', type: 'fast' },
  { id: 'gemini-nano-banana', name: 'Nano Banana', type: 'fast' },
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4', type: 'realistic' },
  { id: 'flux-1-schnell', name: 'FLUX.1 (Бесплатная)', type: 'fast' }
] as const;

export const CINEMATIC_STYLES = [
  { id: 'family_warmth', name: 'Family Warmth', desc: 'Soft golden hour lighting, cozy domestic scenes, warm color grading, clean and loving atmosphere.' },
  { id: 'modern_luxury', name: 'Modern Luxury', desc: 'High-end architectural photography, minimalist clean lines, premium materials, bright airy spaces.' },
  { id: 'mediterranean', name: 'Mediterranean Breeze', desc: 'Bright white walls, blue accents, sunny coastal light, clean linen, aesthetic summer vibes.' },
  { id: 'hollywood_glam', name: 'Hollywood Glam', desc: 'Vibrant crisp colors, high-fidelity digital look, epic and clean lighting, sophisticated composition.' },
  { id: 'scandinavian_hygge', name: 'Scandinavian Hygge', desc: 'Bright white spaces, natural light wood, cozy blankets, extremely clean and organized environment.' },
  { id: 'minimalist_zen', name: 'Minimalist Zen', desc: 'Simple elegant spaces, neutral tones, perfect symmetry, peaceful and immaculate atmosphere.' }
] as const;

export const GENDERS = ['male', 'female'];
export const AGES = ['child', 'teenager', 'young_adult', 'adult', 'middle_aged', 'elderly'];
export const ETHNICITIES = ['caucasian', 'african', 'asian', 'latino', 'middle_eastern', 'indian', 'native_american'];
export const EYE_COLORS = ['blue', 'green', 'brown', 'hazel', 'grey', 'amber', 'heterochromia'];
export const HAIR_COLORS = ['blonde', 'brunette', 'black', 'red', 'white', 'grey', 'dyed_pink', 'dyed_blue'];

export const HAIR_STYLES_MALE = ['short_clean', 'buzz_cut', 'fade', 'long_styled', 'bald', 'curly'];
export const HAIR_STYLES_FEMALE = ['long_straight', 'long_wavy', 'bob_cut', 'pixie', 'ponytail', 'braids', 'messy_bun'];

export const CLOTHING_MALE = ['business_suit', 'tshirt_jeans', 'hoodie_pants', 'casual_shirt', 'sportswear', 'winter_coat', 'beachwear'];
export const CLOTHING_FEMALE = ['evening_dress', 'summer_dress', 'blouse_skirt', 'tshirt_jeans', 'business_suit', 'sportswear', 'swimsuit'];

export const EMOTIONS = ['neutral', 'happy_smiling', 'serious', 'surprised', 'romantic', 'confident'];
export const SHOT_TYPES = ['close_up', 'medium_shot', 'full_body', 'waist_up', 'extreme_close_up'];
export const POSES = ['facing_camera', 'looking_away', 'profile_view', 'walking', 'sitting', 'arms_crossed', 'action_pose'];
export const LOCATIONS = ['luxury_apartment', 'modern_garden', 'nature_forest', 'beach_sunset', 'modern_office', 'cozy_cafe', 'luxury_living_room', 'bright_kitchen'];
