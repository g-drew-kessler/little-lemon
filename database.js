
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');


// import * as SQLite from 'expo-sqlite';

// const db = await SQLite.openDatabaseAsync('little_lemon');


export async function createTable() {
    return await db.execAsync('create table if not exists menuitems (name text primary key not null, description text, price text, image text, category text);');
}

export async function getMenuItems() {
    return await db.getAllAsync('select * from menuitems');
}

export async function saveMenuItems(menuItems) {
    // Save all menu data in a table called menuitems.
    const valuesSqlArray = menuItems.reduce(
      (valueStrArray, item) => ([...valueStrArray, ' (?, ?, ?, ?, ?)']),
      []);
    const initialArray = [];
    const valuesData = menuItems.reduce(
      (data, item) => ([...data, item.name, item.description, item.price, item.image, item.category]),
      initialArray,
    );
    return await db.runAsync('insert into menuitems (name, description, price, image, category) values'
                  + valuesSqlArray.toString(), valuesData);
}


/**
 * Filter the menu by 2 criteria: a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */

export async function filterByQueryAndCategories(query, activeCategories) {
  let queryStr = 'select * from menuitems';
  if (query || (activeCategories.length > 0)) {
    queryStr += ' where';
    if (query) {
      queryStr += " name like '%" + query + "%'";
      if (activeCategories.length > 0) {
        queryStr += ' AND';
      }
    }
    if (activeCategories.length > 0) {
      queryStr += ' (';
      for (let i=0; i < activeCategories.length; i++) {
        if (i > 0) {
          queryStr += ' OR';
        }
        queryStr += " category = '" + activeCategories[i].toLowerCase() + "'";
      }
      queryStr += ' )';
    }
  }
  console.log('Filtering using query: ', query, ' queryStr: ', queryStr);
  return await db.getAllAsync(queryStr);
}
