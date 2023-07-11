import userStore from "./user";
import collectionsStore from "./collections";
import searchStore from "./search";

const store = {
  user: userStore,
  collections: collectionsStore,
  search: searchStore,
};

export { store as default };
