import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polygon } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

// Constants for Haversine-based polygon area calculation
const RADIUS_EARTH_METERS = 6371000; // Radius of Earth in meters

// Helper function to compare polygons by coordinates
const arePolygonsEqual = (polygon1, polygon2) => {
  if (polygon1.length !== polygon2.length) return false;
  for (let i = 0; i < polygon1.length; i++) {
    if (
      polygon1[i].latitude !== polygon2[i].latitude ||
      polygon1[i].longitude !== polygon2[i].longitude
    ) {
      return false;
    }
  }
  return true;
};

// Function to calculate the area of a polygon using the Haversine formula
const calculatePolygonArea = (coordinates) => {
  if (coordinates.length < 3) return 0; // A polygon must have at least 3 points

  let totalArea = 0;
  const numPoints = coordinates.length;

  for (let i = 0; i < numPoints; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % numPoints]; // Next point (wrapping around to the first)

    const lat1 = (p1.latitude * Math.PI) / 180;
    const lat2 = (p2.latitude * Math.PI) / 180;
    const dLong = ((p2.longitude - p1.longitude) * Math.PI) / 180;

    // Calculate the area segment using the spherical excess formula
    const segmentArea = dLong * (2 + Math.sin(lat1) + Math.sin(lat2));
    totalArea += segmentArea;
  }

  totalArea = Math.abs((totalArea * RADIUS_EARTH_METERS * RADIUS_EARTH_METERS) / 2);
  return totalArea;
};

// Function to calculate the general location (center of the polygon)
const calculateCenterLocation = (polygon) => {
  const latitudes = polygon.map(point => point.latitude);
  const longitudes = polygon.map(point => point.longitude);

  const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

  return { latitude: avgLatitude, longitude: avgLongitude };
};

const InnerPolygonsSection = () => {
  const [innerPolygonsData, setInnerPolygonsData] = useState([]); // Initialize as an empty array
  const navigation = useNavigation();
  const mapRefs = useRef([]); // Store map references for fitting polygons

  // Load saved inner polygons and merge them with the latest versions from AsyncStorage
  useEffect(() => {
    const loadInnerPolygons = async () => {
      try {
        const storedInnerPolygons = await AsyncStorage.getItem('savedPolygonData');
        const savedVersions = await AsyncStorage.getItem('innerPolygonVersions');

        let parsedInnerPolygons = storedInnerPolygons ? JSON.parse(storedInnerPolygons) : [];
        let parsedVersions = savedVersions ? JSON.parse(savedVersions) : [];

        // Merge each polygon with its latest version from innerPolygonVersions
        const updatedPolygonsData = parsedInnerPolygons.map((polygonData) => {
          // Find the latest version for this mainPolygon using arePolygonsEqual
          const relatedVersions = parsedVersions
            .filter(version => arePolygonsEqual(version.innerPolygons[0].coords, polygonData.innerPolygons[0].coords)) // Compare by coordinates
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          // If a version exists, replace innerPolygons with the latest one and add coverage percentage
          if (relatedVersions.length > 0) {
            return {
              ...polygonData,
              innerPolygons: relatedVersions[0].innerPolygons, // Take the latest innerPolygons
              coveragePercentage: relatedVersions[0].coveragePercentage || 0, // Add the saved coverage percentage
            };
          }
          return polygonData; // Return original if no version exists
        });

        setInnerPolygonsData(updatedPolygonsData);
      } catch (error) {
        console.error('Failed to load inner polygons:', error);
        setInnerPolygonsData([]); // Fallback in case of error
      }
    };

    loadInnerPolygons();
  }, []);

  // Function to calculate the total number of plants and group by type
  const calculatePlantsByType = (innerPolygons) => {
    let totalPlants = 0;
    const plantTypeCount = {};

    // Ensure `innerPolygons` is an array before iterating
    (innerPolygons || []).forEach((polygon) => {
      totalPlants += polygon.plants || 0;
      const plantType = polygon.plantType || 'Unknown';
      plantTypeCount[plantType] = (plantTypeCount[plantType] || 0) + (polygon.plants || 0);
    });

    return { totalPlants, plantTypeCount };
  };

  // Function to navigate to the detailed view of the selected inner polygon
  const goToInnerPolygonDetails = (mainPolygon, innerPolygons) => {
    navigation.navigate('InnerPolygonDetails', {
      mainPolygon,      // Pass the main polygon
      innerPolygons,    // Pass the inner polygons
    });
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-3xl font-bold mb-8 text-center`}>Inner Polygons Section</Text>

        {/* Render Inner Polygons Cards */}
        <FlatList
          data={innerPolygonsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const { totalPlants, plantTypeCount } = calculatePlantsByType(item.innerPolygons);

            // Calculate Biodiversity and Recovery based on coveragePercentage
            const coverage = item.coveragePercentage || 0;
            const biodiversity = (coverage * 0.7).toFixed(2);
            const recovery = (coverage * 0.82).toFixed(2);

            // Calculate polygon area and center location for main polygon
            const mainPolygonArea = calculatePolygonArea(item.mainPolygon).toFixed(2);
            const mainPolygonCenter = calculateCenterLocation(item.mainPolygon);
            const mainLocationText = `Lat: ${mainPolygonCenter.latitude.toFixed(2)}, Lon: ${mainPolygonCenter.longitude.toFixed(2)}`;

            return (
              <TouchableOpacity 
                key={index} 
                style={tw`bg-white shadow-lg rounded-lg mb-8 w-full h-128`} 
                onPress={() => goToInnerPolygonDetails(item.mainPolygon, item.innerPolygons)}
              >
                <Text style={tw`text-xl font-bold text-center mb-6`}>
                  Restoration Area {index + 1}
                </Text>

                {/* Display the map directly with the main polygon and inner polygons */}
                <View style={{ height: 300 }}>
                  <MapView
                    ref={(el) => (mapRefs.current[index] = el)} // Assign unique ref to each map
                    style={{ flex: 1 }}
                    onLayout={() => {
                      // Fit the map to coordinates when layout is ready
                      mapRefs.current[index]?.fitToCoordinates(item.mainPolygon, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                      });
                    }}
                    initialRegion={{
                      latitude: item.mainPolygon[0].latitude,
                      longitude: item.mainPolygon[0].longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    {/* Main polygon */}
                    <Polygon
                      coordinates={item.mainPolygon || []}
                      fillColor="rgba(0, 0, 255, 0.3)"
                      strokeColor="rgba(0, 0, 255, 0.5)"
                    />
                    {/* Inner polygons */}
                    {item.innerPolygons.map((polygon, innerIndex) => (
                      <Polygon
                        key={innerIndex}
                        coordinates={polygon.coords}
                        fillColor="rgba(0, 255, 0, 0.3)"
                        strokeColor="rgba(0, 255, 0, 0.5)"
                      />
                    ))}
                  </MapView>
                </View>

                {/* Plant Breakdown and Percentages */}
                <View style={tw`p-4`}>
                  <View style={tw`flex-row justify-between mb-4`}>
                    <View style={tw`items-center`}>
                      <View style={tw`w-16 h-16 bg-green-500 rounded-full flex items-center justify-center`}>
                        <Text style={tw`text-white font-bold`}>{biodiversity}%</Text>
                      </View>
                      <Text style={tw`mt-2`}>Biodiversity</Text>
                    </View>
                    <View style={tw`items-center`}>
                      <View style={tw`w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center`}>
                        {/* Ensure the coverage percentage is safely rendered */}
                        <Text style={tw`text-white font-bold`}>{coverage ? `${coverage}%` : '0%'}</Text>
                      </View>
                      <Text style={tw`mt-2`}>Coverage</Text>
                    </View>
                    <View style={tw`items-center`}>
                      <View style={tw`w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center`}>
                        <Text style={tw`text-white font-bold`}>{recovery}%</Text>
                      </View>
                      <Text style={tw`mt-2`}>Recovery</Text>
                    </View>
                  </View>

                  {/* Area and Location for Main Polygon */}
                  <View style={tw`flex-row justify-between items-center`}>
                    <View style={[tw`p-2 bg-green-500 rounded-md`]}>
                      <Text style={tw`text-white text-sm`}>Main Area: {mainPolygonArea} m²</Text>
                    </View>
                    <View style={[tw`p-2 bg-green-500 rounded-md`]}>
                      <Text style={tw`text-white text-sm`}>{mainLocationText}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No inner polygons have been saved yet.</Text>}
        />
      </View>
    </View>
  );
};

export default InnerPolygonsSection;
