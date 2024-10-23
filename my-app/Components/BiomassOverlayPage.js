import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import tw from 'twrnc';

const BiomassOverlayPage = ({ route }) => {
  const { polygon, overlayImageURL } = route.params;
  const [mapRegion, setMapRegion] = useState(null);
  const [imageBounds, setImageBounds] = useState(null);
    
  // Calculate the minimum bounding box of the polygon
  const calculateBoundingBox = (polygon) => {
    const minLat = Math.min(...polygon.map(point => point.latitude));
    const maxLat = Math.max(...polygon.map(point => point.latitude));
    const minLng = Math.min(...polygon.map(point => point.longitude));
    const maxLng = Math.max(...polygon.map(point => point.longitude));

    console.log(`BoundingBox - minLat: ${minLat}, maxLat: ${maxLat}, minLng: ${minLng}, maxLng: ${maxLng}`);
    return { minLat, maxLat, minLng, maxLng };
  };

  // Calculate map region and bounding box when polygon data is available
  useEffect(() => {
    if (polygon && polygon.length > 0) {
      const { minLat, maxLat, minLng, maxLng } = calculateBoundingBox(polygon);
      const latitudeDelta = maxLat - minLat;
      const longitudeDelta = maxLng - minLng;

      console.log(`LatitudeDelta: ${latitudeDelta}, LongitudeDelta: ${longitudeDelta}`);

      // Set the region to center around the polygon
      setMapRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: latitudeDelta * 1.2, // Add padding
        longitudeDelta: longitudeDelta * 1.2,
      });

      // Calculate the bounds of the image to fit within the polygon's bounding box
      setImageBounds({ minLat, maxLat, minLng, maxLng });
    }
  }, [polygon]);

  // Get screen dimensions to correctly scale the image
  const { width, height } = Dimensions.get('window');

  // Calculate the vertical offset needed to align the **bottom edge** of the heatmap with the minimum latitude of the polygon
  const calculateVerticalOffset = () => {
    if (!mapRegion || !imageBounds) return 0;

    // Polygon’s bottom-most latitude (minLat)
    const polygonBottomLat = imageBounds.minLat;

    // Map's bottom-most latitude (considering the latitudeDelta)
    const mapBottomLat = mapRegion.latitude - mapRegion.latitudeDelta / 2;

    // Calculate the vertical distance between the polygon's bottom and the map's bottom
    const verticalDistance = polygonBottomLat - mapBottomLat;

    // Convert the latitude difference to pixels (screen height proportionate to the latitude delta)
    let pixelOffset = (verticalDistance / mapRegion.latitudeDelta) * height;

    console.log(`Vertical Distance: ${verticalDistance}, Pixel Offset: ${pixelOffset}`);

    // Return the pixel offset to align the **bottom** of the heatmap
    return -pixelOffset;  // Move the image upwards by this amount
  };

  // Scaling correction for aspect ratio differences
  const calculateAspectRatioCorrection = () => {
    if (!imageBounds || !mapRegion) return 1;
    
    const latRatio = (imageBounds.maxLat - imageBounds.minLat) / mapRegion.latitudeDelta;
    const lngRatio = (imageBounds.maxLng - imageBounds.minLng) / mapRegion.longitudeDelta;
    const aspectRatioCorrection = latRatio / lngRatio;

    console.log(`AspectRatioCorrection: ${aspectRatioCorrection}`);
    return aspectRatioCorrection;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Display the map and polygon */}
      {mapRegion && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={mapRegion}
        >
          <Polygon
            coordinates={polygon}
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        </MapView>
      )}

      {/* Overlay the heatmap image */}
      {overlayImageURL && imageBounds && (
        <ImageBackground
          source={{ uri: `http://192.168.0.152:8000${overlayImageURL}` }}
          style={{
            position: 'absolute',
            width: width,
            height: height,
            top: calculateVerticalOffset(),  // Align the **bottom edge** of the heatmap
            left: 0,
            opacity: 0.6,
            transform: [
              {
                scaleX: (imageBounds.maxLng - imageBounds.minLng) / mapRegion.longitudeDelta,
              },
              {
                scaleY: (imageBounds.maxLat - imageBounds.minLat) / mapRegion.latitudeDelta,
              },
            ],
          }}
          resizeMode="contain"  // Prevent cropping
        />
      )}
    </View>
  );
};

export default BiomassOverlayPage;
