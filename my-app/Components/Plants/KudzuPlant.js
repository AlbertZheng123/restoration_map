// c:\Users\korra\Downloads\restoration_map\my-app\Components\Plants\KudzuPlant.js

import React from 'react';
import Plant from './Plant';

function KudzuPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/kudzuplant.jpg')} // Update with the actual path to the kudzu plant image
      name="Kudzu Plant"
      terrain="Well-drained, fertile soil"
      terrainExample="Common in: Southeastern United States"
      growthDuration="Rapid, can grow up to a foot per day"
      growthExample="Growth Rate"
      description="Kudzu is an invasive vine known for its rapid growth and ability to cover large areas."
      descriptionExample="Characteristics"
      usageCount={5} // Example usage count
      usageExample="Times controlled in areas"
    />
  );
}

export default KudzuPlant;
