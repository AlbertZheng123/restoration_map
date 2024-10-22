// c:\Users\korra\Downloads\restoration_map\my-app\Components\Plants\PinePlant.js

import React from 'react';
import Plant from './Plant';

function PinePlant() {
  return (
    <Plant
      imageSrc={require('../../assets/pineplant.png')} // Update with the actual path to the pine plant image
      name="Pine Plant"
      terrain="Sandy, acidic soil"
      terrainExample="Common in: Boreal forests"
      growthDuration="15-25 years to maturity"
      growthExample="Time to maturity"
      description="Pine trees are evergreen conifers known for their needles and cones."
      descriptionExample="Characteristics"
      usageCount={12} // Example usage count
      usageExample="Times harvested for wood"
    />
  );
}

export default PinePlant;
