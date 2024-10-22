// c:\Users\korra\Downloads\restoration_map\my-app\Components\Plants\Hyacinth.js

import React from 'react';
import Plant from './Plant';

function HyacinthPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/hyacinthplant.png')} // Update with the actual path to the water hyacinth image
      name="Water Hyacinth"
      terrain="Freshwater bodies"
      terrainExample="Common in: Lakes and ponds"
      growthDuration="Rapid, can double population in two weeks"
      growthExample="Growth Rate"
      description="Water Hyacinth is an invasive aquatic plant known for its rapid spread, which can block waterways and harm aquatic ecosystems."
      descriptionExample="Characteristics"
      usageCount={8} // Example usage count
      usageExample="Times managed in water bodies"
    />
  );
}

export default HyacinthPlant;