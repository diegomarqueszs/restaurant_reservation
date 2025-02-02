// src/routes/reservar/[restaurante]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const restaurant = params.restaurante;
        const response = await fetch(`http://localhost:3000/restaurants/${restaurant}`);
        
        if (!response.ok) {
            throw new Error('Restaurant not found');
        }

        const restaurantData = await response.json();

        // Verifica se os dados necessários estão presentes
        if (!restaurantData) {
            throw new Error('Invalid restaurant data');
        }

        return {
            restaurantData
        };
    } catch (error) {
        console.error('Error loading restaurant:', error);
        return {
            status: 404,
            error: new Error('Restaurant not found')
        };
    }
};