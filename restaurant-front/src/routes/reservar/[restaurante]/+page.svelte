<script lang="ts">
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import RestaurantCarousel from '$lib/components/reservation/RestaurantCarousel.svelte';
    import BookingCalendar from '$lib/components/reservation/BookingCalendar.svelte';
    import RestaurantInfo from '$lib/components/reservation/RestaurantInfo.svelte';
    import type { RestaurantData } from '$lib/types/restaurant';
    import Error404 from '$lib/components/layout/Error404.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

    export let data: RestaurantData;
</script>

{#if data?.restaurantData}
    <div class="flex min-h-screen w-full flex-col bg-gray-50">
        <Navbar isSearchCentered={true} />

        <main class="mt-16 flex-1">
            <div class="mx-auto flex max-w-7xl flex-col gap-12 p-4 lg:flex-row lg:items-start">
                <div class="flex-1 space-y-8">
                    <RestaurantCarousel images={data.restaurantData.images} />
                    <RestaurantInfo restaurantData={data.restaurantData} />
                </div>

                <aside class="w-full max-w-sm lg:sticky lg:top-24 lg:h-fit">
                    <BookingCalendar restaurantData={data.restaurantData} />
                </aside>
            </div>
        </main>
    </div>
{:else}
    <Error404 />
{/if}
