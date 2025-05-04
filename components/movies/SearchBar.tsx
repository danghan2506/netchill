import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { Search } from 'lucide-react-native'
import { Icon } from "../ui/icon";
import { Ionicons } from '@expo/vector-icons';
interface Props{
    onPress: () => void,
    placeholder: string,
    value: string,
    onChangeText?: (text:string) => void,
}
const SearchBar = ({onPress, placeholder, value, onChangeText}: Props) => {
  return (
     <View className='flex-row items-center bg-[#3C3C43] rounded-full px-4 py-2 mx-4 mt-4'>
        <Ionicons name='search-outline' color='white' size={20} className='ml-5'/>
        <TextInput onPress={onPress} 
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#a8b5db"
            className='flex-1 ml-2 text-white'/>
    </View>
   
   
    
  )
}

export default SearchBar