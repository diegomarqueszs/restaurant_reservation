<script lang="ts">
    import { onMount } from 'svelte';
    import FeatureCard from './FeatureCard.svelte';
	import type { Restaurant } from '$lib/types/restaurant';

    export let searchQuery = '';
    export let selectedFilter = '';


    let restaurants: Restaurant[] = [];
    let loading = false;
    let error: string | null = null;

    async function fetchRestaurants() {
        loading = true;
        error = null;
        
        try {
            const response = await fetch('http://localhost:3000/restaurants', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            restaurants = data;
            console.log(restaurants)
        } catch (err) {
            error = err instanceof Error ? err.message : 'Erro ao carregar restaurantes';
            console.error('Erro ao buscar restaurantes:', err);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        fetchRestaurants();
    });

    $: {
        if (searchQuery || selectedFilter) {
            fetchRestaurants();
        }
    }
</script>

<div class="container mx-auto">
    {#if error}
        <div class="p-4 text-red-500 text-center">
            {error}
        </div>
    {/if}

    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {#each restaurants as restaurant (restaurant.id)}
            <FeatureCard {restaurant} />
        {/each}
    </div>

    {#if loading}
        <div class="flex justify-center p-4">
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3e7b31]" />
        </div>
    {/if}
</div>