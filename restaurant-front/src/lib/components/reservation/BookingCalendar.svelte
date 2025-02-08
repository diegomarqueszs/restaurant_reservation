<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { HelpCircle } from 'lucide-svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import type { Restaurant } from '$lib/types/restaurant';

	export let restaurantData!: Restaurant;

	let value = today(getLocalTimeZone()); // Data selecionada
	let isLoading = false;
	let tables = 0;
	let availableTables = Number(restaurantData.tables); // Começa com o total de mesas

	$: pricePerTable = Number(restaurantData.value);
	$: maxTables = Number(restaurantData.tables);

	$: formattedPrice = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(Number(pricePerTable));

	// Função para buscar mesas reservadas no backend
	async function fetchReservedTables(restaurantId: string, date: string) {
		try {
			const response = await fetch(
				`http://localhost:3000/reservations/reserved-tables?restaurantId=${restaurantId}&date=${date}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				}
			);

			if (!response.ok) throw new Error(`Erro ao buscar reservas: ${response.status}`);

			const data = await response.json();
			return data.reserved;
		} catch (err) {
			console.error('Erro ao buscar mesas reservadas:', err);
			return 0;
		}
	}

	// Função para buscar mesas disponíveis (chama o backend sempre que a data mudar)
	async function fetchAvailableTables() {
		const selectedDate = new Date(value.year, value.month - 1, value.day).toISOString().split('T')[0];
		const reservedTables = await fetchReservedTables(restaurantData.id, selectedDate);
		availableTables = maxTables - reservedTables;
		availableTables = (availableTables > 0) ? availableTables : 0;

		console.log(`Buscando disponibilidade para: ${selectedDate}`);
		console.log(`Mesas Reservadas: ${reservedTables}`);
		console.log(`Mesas disponíveis: ${availableTables}`);
	}

	// Sempre que a data mudar, busca as mesas disponíveis (usa afterUpdate)
	afterUpdate(fetchAvailableTables);

	function handleInputChange() {
		if (tables > availableTables) {
			tables = availableTables;
		}
	}

	async function handleClick() {
		isLoading = true;
		try {
			const user = JSON.parse(localStorage.getItem('user') || '{}');
			if (!user?.id) {
				alert('Você precisa estar logado para fazer uma reserva!');
				return;
			}

			const reservationDateISO = new Date(value.year, value.month - 1, value.day).toISOString();

			const response = await fetch('http://localhost:3000/reservations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: user.id,
					restaurant: restaurantData.id,
					reservationDate: reservationDateISO,
					numberOfTables: tables
				})
			});

			if (!response.ok) {
				const errorMessage = await response.json();
				throw new Error(errorMessage.message || 'Erro ao fazer reserva');
			} else {
				alert('Reserva realizada com sucesso!');
				await fetchAvailableTables(); // Atualiza as mesas disponíveis após a reserva
			}
		} catch (error) {
			console.error('Erro ao fazer reserva:', error);
			alert(error.message);
		} finally {
			isLoading = false;
		}
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}
</script>

<div class="flex w-[300px] flex-col items-center">
	<Label for="price" class="w-full p-2 pt-0 text-left text-2xl font-semibold text-[#3e7b31]">
		{formattedPrice} / Mesa
	</Label>

	<Calendar bind:value class="rounded-md border bg-white p-4 shadow-md" />

	<div class="mt-4 w-full">
		<div class="pb-2">
			<Label for="tables">Quantidade de mesas disponível: {availableTables - tables}</Label>
		</div>
		<Input
			id="tables"
			type="number"
			min="1"
			max={availableTables}
			bind:value={tables}
			placeholder="Insira o número de mesas"
			on:input={handleInputChange}
		/>
	</div>

	<Button
		on:click={handleClick}
		class="mt-4 w-full bg-[#3e7b31] px-4 py-2 text-white hover:bg-[#0f500c] focus:outline-none focus:ring-2 focus:ring-[0] active:bg-[#0f500c]"
		disabled={isLoading || tables === 0}
	>
		{#if isLoading}
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Carregando...
		{:else}
			Confirmar Data
		{/if}
	</Button>

	<div class="flex w-full flex-col items-start gap-4">
		<div class="mt-4 text-gray-800">
			<p class="text-sm">
				{formattedPrice} x {tables} mesas: <b>{formatCurrency(tables * pricePerTable)}</b>
			</p>
			<p class="flex items-center gap-2 text-sm">
				Taxa de Segurança:
				<b>{formatCurrency(tables * pricePerTable * 0.1)}</b>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<HelpCircle class="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-800" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p class="text-sm text-gray-700">
							Esta taxa é reembolsada caso o usuário confirme o check-in (10% do valor).
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</p>
			<p class="mt-2 font-semibold">Total: <b>{formatCurrency(tables * pricePerTable * 1.1)}</b></p>
		</div>
	</div>
</div>