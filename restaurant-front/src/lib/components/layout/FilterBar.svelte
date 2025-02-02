<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		ChefHat,
		Pizza,
		ForkKnife,
		Coffee,
		Wine,
		Salad,
		Sandwich,
		Beer,
		IceCream,
		Soup,
		CupSoda,
		Croissant,
		Fish,
		ChevronRight,
		ChevronLeft
	} from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';

	const dispatch = createEventDispatcher();

	const filters = [
		{ id: 'vegetarian', icon: Salad, label: 'Vegetariano' },
		{ id: 'pizza', icon: Pizza, label: 'Pizza' },
		{ id: 'bbq', icon: ForkKnife, label: 'Churrasco' },
		{ id: 'coffee', icon: Coffee, label: 'Café' },
		{ id: 'wine', icon: Wine, label: 'Vinho' },
		{ id: 'fast-food', icon: Sandwich, label: 'Fast Food' },
		{ id: 'beer', icon: Beer, label: 'Cerveja' },
		{ id: 'dessert', icon: IceCream, label: 'Sobremesa' },
		{ id: 'soup', icon: Soup, label: 'Sopa' },
		{ id: 'juice', icon: CupSoda, label: 'Suco' },
		{ id: 'bread', icon: Croissant, label: 'Pão' },
		{ id: 'seafood', icon: Fish, label: 'Frutos do mar' },
		{ id: 'beer', icon: Beer, label: 'Cerveja' },
		{ id: 'dessert', icon: IceCream, label: 'Sobremesa' },
		{ id: 'soup', icon: Soup, label: 'Sopa' },
		{ id: 'juice', icon: CupSoda, label: 'Suco' },
		{ id: 'bread', icon: Croissant, label: 'Pão' },
		{ id: 'seafood', icon: Fish, label: 'Frutos do mar' }
	];

	let selectedFilter: string | null = null;
	let scrollContainer: HTMLElement;
	let showLeftButton = false;
	let showRightButton = true;

	function handleFilterClick(filterId: string) {
		selectedFilter = selectedFilter === filterId ? null : filterId;
		dispatch('filterChange', { filterId: selectedFilter });
	}

	function scroll(direction: 'left' | 'right') {
		if (!scrollContainer) return;

		const itemWidth = 72;
		const scrollAmount = itemWidth * 4; 

		const targetScroll =
			scrollContainer.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
		scrollContainer.scrollTo({
			left: targetScroll,
			behavior: 'smooth'
		});
	}

	function handleScroll() {
		if (!scrollContainer) return;

		showLeftButton = scrollContainer.scrollLeft > 0;
		showRightButton =
			scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 1;
	}

	import { onMount } from 'svelte';
	onMount(() => {
		handleScroll();
		const observer = new ResizeObserver(handleScroll);
		observer.observe(scrollContainer);
		return () => observer.disconnect();
	});
</script>

<div class="relative w-full px-10">
	<div class="absolute left-0 top-1/2 z-10 -translate-y-1/2">
		{#if showLeftButton}
			<Button
				variant="secondary"
				size="icon"
				class="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
				on:click={() => scroll('left')}
			>
				<ChevronLeft class="h-4 w-4" />
			</Button>
		{/if}
	</div>

	<div
		bind:this={scrollContainer}
		on:scroll={handleScroll}
		class="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth py-2"
	>
		{#each filters as filter}
			<button
				class="group flex min-w-[80px] flex-col items-center justify-center rounded-lg p-2
                 transition-all hover:bg-[#3e7b31] focus:outline-none
                 {selectedFilter === filter.id ? 'bg-[#3e7b31]' : ''}"
				on:click={() => handleFilterClick(filter.id)}
			>
				<svelte:component
					this={filter.icon}
					class="mb-1 h-5 w-5 fill-none stroke-[1.5px] transition-all
                   {selectedFilter === filter.id
						? 'stroke-white'
						: 'stroke-[#3e7b31] group-hover:stroke-white'}"
				/>
				<span
					class="whitespace-nowrap text-center text-xs transition-colors
                       {selectedFilter === filter.id
						? 'font-medium text-white'
						: 'text-gray-600 group-hover:text-white'}"
				>
					{filter.label}
				</span>
			</button>
		{/each}
	</div>

	<div class="absolute right-0 top-1/2 z-10 -translate-y-1/2">
		{#if showRightButton}
			<Button
				variant="secondary"
				size="icon"
				class="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
				on:click={() => scroll('right')}
			>
				<ChevronRight class="h-4 w-4" />
			</Button>
		{/if}
	</div>
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
