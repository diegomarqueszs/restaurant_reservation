<script lang="ts">
    import type { Restaurant } from '$lib/types/restaurant';
    import { CalendarDays, MapPin, Utensils, Clock } from 'lucide-svelte';
	import { Separator } from '../ui/separator';

    export let restaurantData: Restaurant | undefined;
</script>

<div class="mx-auto max-w-4xl p-6 space-y-6">
    {#if restaurantData}
        <div>
            <h1 class="text-3xl font-bold text-gray-800">{restaurantData.name}</h1>
            <p class="flex items-center space-x-2 text-gray-600">
                <MapPin class="w-5 h-5 text-gray-500" />
                <span>{restaurantData.location}</span>
            </p>
        </div>

        <Separator class="my-4 bg-gray-300" />

        <div class="space-y-6">
            <div class="flex items-center space-x-2">
                <CalendarDays class="w-5 h-5 text-gray-500" />
                <span class="text-gray-600">
                    Data disponível: {new Date(restaurantData.date).toLocaleDateString('pt-BR')}
                </span>
            </div>
            <div>
                <h2 class="text-xl font-semibold text-gray-800">Descrição</h2>
                <p class="mt-2 text-gray-600 leading-relaxed">{restaurantData.description}</p>
            </div>

            <Separator class="my-4 bg-gray-300" />

            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <Utensils class="w-6 h-6 text-green-600" />
                    <p class="text-gray-700">Deliciosas opções gastronômicas com pratos especiais.</p>
                </div>
                <div class="flex items-center space-x-3">
                    <Clock class="w-6 h-6 text-green-600" />
                    <p class="text-gray-700">Horários flexíveis para atender ao seu planejamento.</p>
                </div>
                <div class="flex items-center space-x-3">
                    <MapPin class="w-6 h-6 text-green-600" />
                    <p class="text-gray-700">Localização privilegiada, fácil acesso e estacionamento.</p>
                </div>
            </div>
        </div>
    {/if}
</div>
