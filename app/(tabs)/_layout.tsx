import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import {Heart, HomeIcon, PersonStanding, Save, SaveAll, SaveIcon, Search, User} from "lucide-react-native"
// const TabIcon = ({focused, icon, title}: any) => {
//   if(focused){
//     return (
//       <ImageBackground source={images.highlight} className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden">
//         <Image source={icon} tintColor="#151312" className="size-5"></Image>
//         <Text className="text-secondary text-base font-semibold ml-2">{title}</Text>
//       </ImageBackground>
//     );
//   }
//   else{
//     return (
//       <View className="size-full justify-center items-center mt-4 rounded-full">
//         <Image source={icon} tintColor="#A8B5DB" className="size-5" />
//       </View>
//     );
//   }
// }
const _layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: true,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0D0425",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 57,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
    }}>
     
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, 
          title: "Home" ,
          tabBarIcon: () => <Icon as={HomeIcon}/>}}
      />
      <Tabs.Screen
        name="search"
        options={{ headerShown: false, title: "Search" ,
          tabBarIcon: () => <Icon as={Search}/>
        }}
        
      />
      <Tabs.Screen
        name="save"
        options={{ headerShown: false, title: "Saved" ,
          tabBarIcon: () => <Icon as={Heart}/>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ headerShown: false, title: "Profile" , 
          tabBarIcon: () => <Icon as={User}/>
        }} 
      />
    </Tabs>
  );
};

export default _layout;
