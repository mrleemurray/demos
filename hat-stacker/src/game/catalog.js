export const HAT_CATALOG = Object.freeze([
  { id: 'artist-beret', label: 'Artist Beret' },
  { id: 'bamboo-hat', label: 'Bamboo Hat' },
  { id: 'baseball-cap', label: 'Baseball Cap' },
  { id: 'construction-hard-hat', label: 'Construction Hard Hat' },
  { id: 'cowboy-hat', label: 'Cowboy Hat' },
  { id: 'crown', label: 'Crown' },
  { id: 'dark-sailor-hat', label: 'Dark Sailor Hat' },
  { id: 'firefighter-helmet', label: 'Firefighter Helmet' },
  { id: 'full-size-spinner-hat', label: 'Spinner Hat' },
  { id: 'grand-top-hat-monocle', label: 'Grand Top Hat' },
  { id: 'leaning-party-hat', label: 'Party Hat' },
  { id: 'pink-party-hat', label: 'Pink Party Hat' },
  { id: 'propeller-hat', label: 'Propeller Hat' },
  { id: 'sailor-hat', label: 'Sailor Hat' },
  { id: 'straw-hat', label: 'Straw Hat' },
  { id: 'white-chef-hat', label: 'Chef Hat' },
  { id: 'wizard-hat', label: 'Wizard Hat' },
]);

export const HAT_BY_ID = new Map(HAT_CATALOG.map(hat => [hat.id, hat]));

export function getHatType(id) {
  const type = HAT_BY_ID.get(id);
  if (!type) {
    throw new Error(`Unknown hat type: ${id}`);
  }
  return type;
}
