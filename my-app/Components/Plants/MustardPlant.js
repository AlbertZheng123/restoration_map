// c:\Users\korra\Downloads\restoration_map\my-app\Components\Plants\MustardPlant.js

import React from 'react';
import Plant from './Plant';

function MustardPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/mustardplant.jpg')} // Update with the actual path to the garlic mustard plant image
      name="Garlic Mustard Plant"
      terrain="Shaded, moist soil"
      terrainExample="Common in: Forest understories"
      growthDuration="Biennial, completes life cycle in two years"
      growthExample="Life Cycle"
      description="Garlic Mustard is an invasive herb that can displace native plants and disrupt ecosystems."
      descriptionExample="Characteristics"
      usageCount={4} // Example usage count
      usageExample="Times removed from areas"
    />
  );
}

export default MustardPlant;
