<script lang="ts">
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

	let value = today(getLocalTimeZone());
	let isLoading = false;
	let tables = 0;

	$: pricePerTable = Number(restaurantData.value);
	$: maxTables = Number(restaurantData.tables);

	$: formattedPrice = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(Number(pricePerTable));

	function handleInputChange() {
		if (tables > maxTables) {
			tables = maxTables;
		}
	}

	function calculateSecurityFee(): number {
		return Number((tables * pricePerTable * 0.1).toFixed(2));
	}

	function calculateTotal(): number {
		return Number((tables * pricePerTable + calculateSecurityFee()).toFixed(2));
	}

	async function handleClick() {
		isLoading = true;
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const reservationData = {
				restaurantId: restaurantData.id,
				date: value,
				tables,
				total: calculateTotal(),
				securityFee: calculateSecurityFee()
			};
			console.log('Reservation data:', reservationData);
		} catch (error) {
			console.error('Error making reservation:', error);
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
	<Label for="price" class="w-full p-2 pt-0 text-left text-2xl font-semibold text-[#3e7b31]"
		>{formattedPrice} / Mesa</Label
	>

	<Calendar bind:value class="rounded-md border bg-white p-4 shadow-md" />

	<div class="mt-4 w-full">
		<div class="pb-2">
			<Label for="tables">Quantidade de mesas disponível: {maxTables - tables}</Label>
		</div>
		<Input
			id="tables"
			type="number"
			min="1"
			max={maxTables}
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
				<b>{formatCurrency(calculateSecurityFee())}</b>
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
			<p class="mt-2 font-semibold">Total: <b>{formatCurrency(calculateTotal())}</b></p>
		</div>
	</div>
</div>
