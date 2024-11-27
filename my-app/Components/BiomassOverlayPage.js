import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import tw from 'twrnc';

const BiomassOverlayPage = ({ route }) => {
  const { overlayImageURL } = route.params;

  // Calculate the size for the largest square that fits within the screen
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const squareSize = Math.min(screenWidth, screenHeight); // Find the smaller dimension to make the largest square

  return (
    <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: '#000' }]}>
      {/* Display the image as the largest square that fits within the screen */}
      {overlayImageURL && (
        <Image
          source={{ uri: `http://192.168.0.152:8000${overlayImageURL}` }}
          style={{
            width: squareSize, // Square dimensions
            height: squareSize, // Square dimensions
            opacity: 1, // Full opacity
          }}
          resizeMode="cover" // Ensure the image covers the square area
        />
      )}
    </View>
  );
};

export default BiomassOverlayPage;
