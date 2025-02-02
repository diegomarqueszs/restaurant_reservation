<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { Restaurant } from '$lib/types/restaurant';
	import { onMount } from 'svelte';


	export let restaurant: Restaurant;
	let imageLoaded = false;

	let randomIndex = 0;

	function handleImageLoad() {
		imageLoaded = true;
	}

	$: formattedValue = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(Number(restaurant.value));

	onMount(() => {
		if (restaurant.images.length > 0) {
			randomIndex = Math.floor(Math.random() * Math.min(restaurant.images.length, restaurant.images.length));
		}
	});
</script>

<Card.Root class="flex h-[500px] flex-col">
	<Card.Header>
		{#if restaurant.name}
			<Card.Title>{restaurant.name}</Card.Title>
			<Card.Description>{restaurant.location}</Card.Description>
		{:else}
			<Skeleton class="h-8 w-3/4" />
			<Skeleton class="mt-2 h-4 w-1/2" />
		{/if}
	</Card.Header>

	<Card.Content class="relative flex-1">
		{#if restaurant.images}
			<div class="relative h-48 w-full">
				{#if !imageLoaded}
					<Skeleton class="absolute h-48 w-full rounded-t-lg" />
				{/if}
				<img
					src={restaurant.images[randomIndex]}
					alt={restaurant.name}
					class="h-48 w-full rounded-t-lg object-cover"
					on:load={handleImageLoad}
					style={!imageLoaded ? 'display: none;' : ''}
				/>
			</div>
		{:else}
			<div class="flex h-48 w-full items-center justify-center rounded-t-lg bg-[#3e7b31]">
				<span class="text-white">Sem imagem</span>
			</div>
		{/if}
		<div class="mt-4 space-y-2 overflow-auto">
			{#if restaurant.description}
				<p class="line-clamp-3 text-gray-600">{restaurant.description}</p>
			{:else}
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-5/6" />
			{/if}
			<div class="flex justify-between text-sm text-gray-500">
				{#if restaurant.tables !== undefined}
					<span class="font-bold text-[#3E7B31]">Mesas disponíveis: {restaurant.tables}</span>
				{:else}
					<Skeleton class="h-4 w-32" />
				{/if}
			</div>
		</div>
	</Card.Content>

	<Card.Footer class="mt-auto flex items-center justify-between">
		{#if restaurant.value}
			<span class="text-2xl font-semibold text-[#3e7b31]">
				{formattedValue}
			</span>
			<Button
				variant="outline"
				class="group border-[#3e7b31] text-[#3e7b31] transition-colors hover:bg-[#3e7b31] hover:text-white"
				on:click={() =>
					(window.location.href = `${window.location.origin}/reservar/${restaurant.id}`)}
			>
				Reservar
			</Button>
		{:else}
			<Skeleton class="h-8 w-24" />
			<Skeleton class="h-10 w-28" />
		{/if}
	</Card.Footer>
</Card.Root>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
