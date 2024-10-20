import { View, Text, FlatList } from 'react-native';
import tw from 'twrnc';

const Impact = ({ savedPolygons = [] }) => {
  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`items-center p-8`}>
        <Text style={tw`text-3xl font-bold mb-8 text-center`}>Impact Dashboard</Text>

        <FlatList
          data={savedPolygons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: polygonCoordinates, index }) => (
            <View
              key={index}
              style={tw`bg-white shadow-lg rounded-lg p-6 mb-6 w-11/12`}
            >
              <Text style={tw`text-lg font-bold text-center mb-6`}>
                Restoration Area {index + 1}
              </Text>
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-center text-gray-700`}>
                  {polygonCoordinates.length} Points Mapped
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No polygons have been saved yet.</Text>}
        />
      </View>
    </View>
  );
};

export default Impact;