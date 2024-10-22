// c:\Users\korra\Downloads\restoration_map\my-app\Components\Plants\PurplePlant.js

import React from 'react';
import Plant from './Plant';

function PurplePlant() {
  return (
    <Plant
      imageSrc={require('../../assets/purpleplant.png')} // Update with the actual path to the purple loosestrife image
      name="Purple Loosestrife"
      terrain="Wetlands, marshes"
      terrainExample="Common in: Wetland areas"
      growthDuration="Perennial, blooms in summer"
      growthExample="Blooming Season"
      description="Purple Loosestrife is an invasive wetland plant that can dominate natural ecosystems and displace native vegetation."
      descriptionExample="Characteristics"
      usageCount={6} // Example usage count
      usageExample="Times managed in wetlands"
    />
  );
}

export default PurplePlant;
