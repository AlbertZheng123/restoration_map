import React from 'react';
import Plant from './Plant';

function BirchPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/birchplant.png')} // Update with the actual path to the birch plant image
      name="Birch Plant"
      terrain="Moist, well-drained soil"
      terrainExample="Common in: Northern temperate regions"
      growthDuration="10-15 years to maturity"
      growthExample="Time to maturity"
      description="Birch trees are known for their distinctive white bark and delicate leaves."
      descriptionExample="Characteristics"
      usageCount={7} // Example usage count
      usageExample="Times used for paper production"
    />
  );
}

export default BirchPlant;