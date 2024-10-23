import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

// Function to map plant type to marker color
const getMarkerColor = (plant) => {
  switch (plant) {
    case 'red':
      return 'red';
    case 'yellow':
      return 'yellow';
    case 'green':
      return 'green';
    case 'orange':
      return 'orange';
    case 'blue':
      return 'blue';
    default:
      return 'red';
  }
};

const ImpactDetails = ({ route }) => {
  const { polygon, markers, biodiversityPercent, coveragePercent } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [overlayImageURL, setOverlayImageURL] = useState(null);

  // Function to make the API call to fetch heatmap for a specific time
  const fetchHeatmap = async (time) => {
    setLoading(true);  // Set loading state to true
    const markerLocations = markers.map(marker => ({
      latitude: marker.latitude,
      longitude: marker.longitude,
    }));
    
    try {
      // API call to get the overlay image URL
      const response = await axios.post('http://192.168.0.152:8000/api/predict_plant_growth/', {
        boundaries: polygon,
        plants: markerLocations,
        save: true,
        time: time, // Pass the time value to the API
      });

      // Set the overlay image URL
      setOverlayImageURL(response.data.overlayImageURL);
    } catch (error) {
      console.error('Error fetching overlay:', error);
    } finally {
      setLoading(false);  // Set loading state to false
    }
  };

  // Handle navigating to the overlay page
  const handleViewOverlay = () => {
    if (overlayImageURL) {
      navigation.navigate('BiomassOverlayPage', { 
        polygon, 
        overlayImageURL 
      });
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1`}>
        <MapView
          style={tw`w-full h-2/3`}
          initialRegion={{
            latitude: polygon[0].latitude,
            longitude: polygon[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polygon coordinates={polygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
          
          {/* Display markers */}
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              pinColor={getMarkerColor(marker.plant)}
              title={marker.plant || 'Plant'}
            />
          ))}
        </MapView>
      </View>

      {/* Statistics Section */}
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-center mb-4`}>Impact Statistics</Text>
        <Text style={tw`text-lg mb-2`}>Biodiversity Revived: {biodiversityPercent}%</Text>
        <Text style={tw`text-lg mb-4`}>Coverage Restored: {coveragePercent}%</Text>

        {/* Three Buttons for different time predictions */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Predict Heatmap for 10 Days" onPress={() => fetchHeatmap(10)} />
            <Button title="Predict Heatmap for 30 Days" onPress={() => fetchHeatmap(30)} />
            <Button title="Predict Heatmap for 50 Days" onPress={() => fetchHeatmap(50)} />
          </>
        )}

        {/* Button to view overlayed heatmap */}
        {overlayImageURL && (
          <Button title="View Overlayed Heatmap" onPress={handleViewOverlay} />
        )}
      </View>
    </View>
  );
};

export default ImpactDetails;
