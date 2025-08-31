// A MenuItems component that loads menu item info from a remote API
// and displays them in a FlatList. Menu items include a title, description,
// price, and image (show as a thumbnail to the right). Menu item info is
// stored in a SQLite database for faster retrieval, until the user logs out.
//
// Provide a search bar for filtering menu items by parts of titles, and
// a set of category toggle buttons for selecting categories that should be
// included.

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

const menuItemsUrl = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json';

const Item = ({ title, description, price, imageUrl }) => (
    <View style={styles.item}>
        <View style={styles.itemText}>
            <Text style={styles.itemName}>{title}</Text>
            <Text style={styles.itemDescription}>{description}</Text>
            <Text style={styles.itemPrice}>${price}</Text>
        </View>
        <Image
            style={styles.itemImage}
            source={{ uri: imageUrl }}
        />
    </View>
);

export default function MenuItems() {
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [filterCategories, setFilterCategories] = useState([]);

    const fetchMenuItems = async() => {
        let menuItems = [];

        try {
            const response = await fetch(menuItemsUrl);
            const json = await response.json();
            menuItems = json.menu.map(
                (item) => ({id: item.id,
                            title: item.title,
                            description: item.description,
                            price: item.price,
                            imageUrl: item.image,
                            category: item.category,
                })
            );
            console.log('Fetched menu items:', menuItems);
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

                const categories = menuItems.map(item => item.category);
                const uniqueCategories = [... new Set(categories)].sort();
                console.log('Fetched categories:', uniqueCategories);

                setData(menuItems);
                setCategories(uniqueCategories);
            } catch (error) {
                Alert.alert('Failed to retrieve menu items: '
                            + error.message);
            }
        })();
    }, []);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = categories.filter((s, i) => {
                // If all filters are deselected, all categories are
                // active
                if (filterCategories.every((item) => item === false)) {
                    return true;
                }
                return filterCategories[i];
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
    }, [categories, filterCategories, query]);

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
        const arrayCopy = [...filterCategories];
        arrayCopy[index] = !arrayCopy[index];
        setFilterCategories(arrayCopy);
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
                    selections={filterCategories}
                    sections={categories}
                    onChange={handleFilterChange}
                />
                <FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Item title={item.title}
                          description={item.description}
                          price={item.price}
                          imageUrl={item.imageUrl}
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
