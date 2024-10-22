// c:\Users\korra\Downloads\restoration_map\my-app\Components\Plants\KnotweedPlant.js

import React from 'react';
import Plant from './Plant';

function KnotweedPlant() {
  return (
    <Plant
      imageSrc={require('../../assets/knotweed.png')} // Update with the actual path to the knotweed plant image
      name="Japanese Knotweed"
      terrain="Moist, fertile soil"
      terrainExample="Common in: Riparian zones"
      growthDuration="Rapid, can grow several inches per day"
      growthExample="Growth Rate"
      description="Japanese Knotweed is an invasive plant known for its aggressive growth and ability to damage infrastructure."
      descriptionExample="Characteristics"
      usageCount={3} // Example usage count
      usageExample="Times managed in areas"
    />
  );
}

export default KnotweedPlant;