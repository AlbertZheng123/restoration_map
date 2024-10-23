// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import tw from 'twrnc';

// const Login = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleGoogleSignIn = () => {
//     // You can add an alert or other logic here
//     console.log("Google Sign-In triggered");
//   };

//   const handleEmailLogin = () => {
//     // You can add an alert or other logic here
//     console.log("Email Login triggered");
//   };

//   return (
//     <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: '#EDEADE' }]}>
//       <View style={tw`bg-green-200 p-8 rounded-lg shadow-md w-full max-w-sm`}>
//         <Text style={tw`text-2xl font-bold mb-6 text-black text-center`}>Login to Lorem Ipsum</Text>
        
//         {/* Error message placeholder */}
//         {error ? (
//           <Text style={tw`text-red-500 mb-4 text-center`}>
//             {error}
//           </Text>
//         ) : null}

//         {/* Google Sign-In */}
//         <TouchableOpacity
//           style={tw`bg-green-600 p-3 rounded-full mb-4`}
//           onPress={handleGoogleSignIn}
//         >
//           <Text style={tw`text-white text-center`}>Sign in with Google</Text>
//         </TouchableOpacity>

//         <Text style={tw`my-4 text-black text-center`}>or</Text>

//         {/* Email/Password Login */}
//         <View style={tw`flex flex-col`}>
//           <TextInput
//             style={tw`bg-white border border-gray-300 rounded text-sm p-3 mb-3`}
//             placeholder="Email"
//             placeholderTextColor="#aaa"
//             value={email}
//             onChangeText={setEmail}
//           />
//           <TextInput
//             style={tw`bg-white border border-gray-300 rounded text-sm p-3 mb-4`}
//             placeholder="Password"
//             placeholderTextColor="#aaa"
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity
//             style={tw`bg-green-600 p-3 rounded-full`}
//             onPress={handleEmailLogin}
//           >
//             <Text style={tw`text-white text-center`}>Login</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Navigate to sign-up page */}
//         <Text style={tw`mt-4 text-black text-center`}>
//           Don't have an account?{" "}
//           <Text onPress={() => navigation.navigate('Signup')} style={tw`text-green-600 underline`}>
//             Sign up
//           </Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In triggered");
  };

  const handleEmailLogin = () => {
    console.log("Email Login triggered");
  };

  return (
    <View style={tw`flex-1 pt-8 bg-[#EDEADE]`}>
      <ScrollView contentContainerStyle={tw`px-6 flex-grow justify-start`}>
        <Text style={tw`text-2xl font-bold mt-4 text-black`}>Log in to Restoramap</Text>

        {error ? <Text style={tw`text-red-500 mt-3`}>{error}</Text> : null}

        <Text style={tw`text-lg text-black mt-2`}>Email</Text>
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg mt-4 p-3`}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={tw`text-lg text-black mt-3`}>Password</Text>
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg mt-4 p-3`}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={tw`text-green-600 mb-6`}>Forgot Password?</Text>

        <TouchableOpacity style={tw`bg-green-600 py-3 rounded-lg mb-5`} onPress={handleEmailLogin}>
          <Text style={tw`text-white text-center text-lg`}>Login</Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center mb-5`}>
          <View style={tw`flex-1 h-px bg-gray-500`} />
          <Text style={tw`text-base text-black mx-3`}>OR</Text>
          <View style={tw`flex-1 h-px bg-gray-500`} />
        </View>

        <TouchableOpacity style={tw`flex-row bg-green-700 py-3 rounded-lg items-center justify-center`} onPress={handleGoogleSignIn}>
          <Icon name="google" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white text-lg`}>Continue with Google</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Bottom Text Section Above Navbar */}
      <View style={tw`items-center p-3 mt-auto mb-5`}>
        <Text style={tw`text-xs text-gray-600 text-center`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. {'\n'}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. {'\n'}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
        </Text>
      </View>
    </View>
  );
};

export default Login;
