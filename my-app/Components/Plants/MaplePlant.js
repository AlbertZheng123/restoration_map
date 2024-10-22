import React from 'react';
import Plant from './Plant';

function MaplePlant() {
  return (
    <Plant
      imageSrc={require('../../assets/mapleplant.png')} // Update with the actual path to the maple plant image
      name="Maple Plant"
      terrain="Well-drained, slightly acidic soil"
      terrainExample="Common in: Temperate regions"
      growthDuration="10-15 years to maturity"
      growthExample="Maturity Time"
      description="Maple trees are known for their vibrant fall colors and sweet syrup."
      descriptionExample="Characteristics"
      usageCount={8} // Example usage count
      usageExample="Times tapped for syrup"
    />
  );
}

export default MaplePlant;
