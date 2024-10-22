import React from 'react';
import Plant from './Plant';

function OakPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/oakplant.png')} // Update with the actual path to the oak plant image
      name="Oak Plant"
      terrain="Loamy, well-drained soil"
      terrainExample="Common in: Deciduous forests"
      growthDuration="20-30 years to maturity"
      growthExample="Maturity Time"
      description="Oak trees are strong, long-lived, and known for their sturdy wood and acorns."
      descriptionExample="Characteristics"
      usageCount={10} // Example usage count
      usageExample="Times planted"
    />
  );
}

export default OakPlant;
