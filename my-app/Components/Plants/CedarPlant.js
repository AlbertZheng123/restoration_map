import React from 'react';
import Plant from './Plant';

function CedarPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/cedarplant.png')} // Update with the actual path to the cedar plant image
      name="Cedar Plant"
      terrain="Well-drained, sandy soil"
      terrainExample="Common in: Mountainous regions"
      growthDuration="30-40 years to maturity"
      growthExample="Time to maturity"
      description="Cedar trees are aromatic evergreens valued for their durable wood and fragrance."
      descriptionExample="Characteristics"
      usageCount={15} // Example usage count
      usageExample="Times used for furniture"
    />
  );
}

export default CedarPlant;
