import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Alert,
    FlatList
} from 'react-native';
import {Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';

import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from '../database';

import Filters from './Filters';
import { useUpdateEffect } from '../utils';

const menuItemsUrl = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts', 'Drinks'];
const imageUrlBase = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';
const imageUrlOption = '?raw=true';

const Item = ({ name, description, price, image }) => (
    <View style={styles.item}>
        <View style={styles.itemText}>
            <Text style={styles.itemName}>{name}</Text>
            <Text style={styles.itemDescription}>{description}</Text>
            <Text style={styles.itemPrice}>${price}</Text>
        </View>
        <Image
            style={styles.itemImage}
            source={{ uri: imageUrlBase + image + imageUrlOption }}
        />
    </View>
);

export default function MenuItems() {
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );

    const fetchMenuItems = async() => {
        let menuItems = [];

        try {
            const response = await fetch(menuItemsUrl);
            const json = await response.json();
            menuItems = json.menu.map(
                (item) => ({name: item.name,
                            price: item.price,
                            description: item.description,
                            image: item.image,
                            category: item.category,
                })
            )
        } catch (error) {
            Alert.alert('Failed to retrieve menu items from '
                        + menuItemsUrl + ': ' + error.message);
        }
        return menuItems;
    }

    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
                console.log('Got menu items from SQL query: ', menuItems);
                
                if (!menuItems.length) {
                    menuItems = await fetchMenuItems();
                    console.log('Fetched menu items:', menuItems);
                    await saveMenuItems(menuItems);
                }
            
                setData(menuItems);
            } catch (error) {
                Alert.alert('Failed to retrieve menu items: '
                            + error.message);
            }
        })();
    }, []);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                // If all filters are deselected, all categories are
                // active
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                // Perform a query filtered by active categories
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                );
                setData(menuItems);
            } catch (error) {
                console.log('Error: ', error.message)
                Alert.alert('Failed to select menu items: ' + error.message);
            }
        })();
    }, [filterSelections, query]);

    // Use a debounce function to avoid performing a query unnecessarily
    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    }

    const handleFilterChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !arrayCopy[index];
        setFilterSelections(arrayCopy);
    }

    return (
        <View style={styles.container}>
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="gray"
                    value={searchBarText}
                    onChangeText={handleSearchChange}
                    style={styles.searchBar}
                />
            <View style={styles.menuItemsContainer}>
                <Filters
                    style={styles.filters}
                    selections={filterSelections}
                    sections={sections}
                    onChange={handleFilterChange}
                />
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Item name={item.name}
                          description={item.description}
                          price={item.price}
                          image={item.image}
                    />
                )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchBar: {
        margin: 20,
    },
    filters: {
        margin: 20,
    },
    menuItemsContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-between',
    },
    itemText: {
        width: '70%',
    },
    itemName: {
        fontSize: 20,
    },
    itemDescription: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 20,
    },
});
