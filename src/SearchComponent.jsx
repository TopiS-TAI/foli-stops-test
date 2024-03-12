import { useRef, useState } from "react";
import {
    FlatList,
    StyleSheet,
    TextInput,
    View,
    Text,
    Dimensions,
    Pressable,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard, 
    Platform } from "react-native"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

import * as Location from 'expo-location';

function SearchComponent({stop, onInputChange, stopNames, onSelect, filterLoad, onFilterStart}) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [inputWidth, setInputWidth] = useState(null)
    const [debouncer, setDebouncer] = useState(null)
    const [location, setLocation] = useState(null)
    const [locationPermission, setLocationPermission] = useState(false)
    const [locationLoad, setLocationLoad] = useState(false)
    const [locationRect, setLocationRect] = useState(null)

    const inputRef = useRef()

    const styles = StyleSheet.create({
        header: {
          backgroundColor: 'rgb(240, 179, 35)',
          display: 'flex',
          flexDirection: 'row',
          padding: 10,
          zIndex: 5
        },
        input: {
            height: 40,
            backgroundColor: '#FFF',
            flex: 1,
            paddingLeft: 8, 
            fontSize: 18
        },
        list: {
            position: 'absolute',
            left: 10,
            top: Platform.OS === 'ios' ? 60 : 50,
            zIndex: 10,
            width: inputWidth + 36 + 40,
            display: open ? 'flex' : 'none',
            maxHeight: Dimensions.get('screen').height - 100,
            overflow: 'hidden'
        },
        itemContainer: {
            backgroundColor: '#FED',
            borderBottomWidth: 1,
            borderBottomColor: '#CCC',
        },
        emptyContainer: {
            backgroundColor: '#FED',
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectedRow: {
            backgroundColor: '#EDA'
        },
        item: {
            paddingVertical: 10,
            paddingHorizontal: 8,
            fontSize: 16,
        },
        emptyItem: {
            paddingVertical: 10,
            fontSize: 18,
            fontWeight: '600',
            opacity: 0.3,
        },
        indicator: {
            color: 'rgb(240, 179, 35)',
            paddingHorizontal: 8,
            backgroundColor: "#FFF",
            height: 40,
        },
        button: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        clearButton: {
            width: 40,
            backgroundColor: "#FFF",
            minWidth: 40,
            flexBasis: 40,
        },
        locationButton: {
            marginLeft: 10,
            width: 40,
            backgroundColor: "#EEE",
            minWidth: 40,
            flexBasis: 40,
            borderRadius: 8,
        },
        locationDenied: {
            backgroundColor: 'red'
        },
        locationLoading: {
            backgroundColor: "blue"
        }
      });

    function handleMenuPress(item) {
        setOpen(false)
        setInputValue(item.title)
        onSelect(item.id)
    }

    function handleInputChange(text) {
        onFilterStart()
        setInputValue(text)
        !open && setOpen(true)
        if (debouncer) {
            clearTimeout(debouncer)
            setDebouncer(null)
        }
        setDebouncer(setTimeout(() => {
            onInputChange(text)
        }, 500))
    }

    function clearInput() {
        setInputValue('')
        inputRef.current.focus()
    }

    async function getLocation() {
        setLocationLoad(true)
      
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            setLocationPermission(false)
            setLocationLoad(false)
            return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        console.log('location', location)
        setLocation(location);
        setLocationPermission(true)
        setLocationLoad(false)
          
    }

    return (
        <>
        <View style={styles.header}>
            <TextInput
                style={styles.input}
                placeholder="Pysäkki"
                value={inputValue}
                keyboardType='default'
                ref={inputRef}
                onChangeText={value => handleInputChange(value)}
                onSubmitEditing={Keyboard.dismiss}
                onLayout={(event) => setInputWidth(event.nativeEvent.layout.width)}
            />
            <ActivityIndicator style={styles.indicator} color="rgb(240, 179, 35)" animating={filterLoad}/>
            <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={clearInput}
                >
                    <FontAwesomeIcon size={20} color='#CCC' icon={faCircleXmark} />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.locationButton, locationPermission ? null : styles.locationDenied, locationLoad ? styles.locationLoading : null]}
                onPress={getLocation}
                >
                    <FontAwesomeIcon size={20} color='#CCC' icon={faLocationCrosshairs} />
            </TouchableOpacity>
        </View>
        <FlatList
            data={stopNames}
            style={styles.list}
            renderItem={({item}) => (
                <Pressable style={({pressed}) => pressed ? styles.selectedRow : styles.itemContainer } onPress={() => handleMenuPress(item)}>
                    <Text style={styles.item}>{item.title}</Text>
                </Pressable>
            )}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyItem}>Ei pysäkkejä</Text>
                </View>
            )}
            />
        </>
    )
}

export default SearchComponent