import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { Search } from 'lucide-react-native'
import { Icon } from "../ui/icon";
interface Props{
    onPress: () => void,
    placeholder: string,
    value: string,
    onChangeText: (text:string) => void,
}
const SearchBar = ({onPress, placeholder, value, onChangeText}: Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
        <Icon as={Search} ></Icon>
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