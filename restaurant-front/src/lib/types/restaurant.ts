export type Restaurant = {
    id: string;
    name: string;
    location: string;
    date: string;
    tables: string;
    value: string;
    images: string[];
    description: string;
};

export type RestaurantData = {
    restaurantData: Restaurant | undefined;
};