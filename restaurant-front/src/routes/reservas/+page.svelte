<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { format } from 'date-fns';
  import { ptBR } from 'date-fns/locale/pt-BR';

  // Tipos
  type SortOrder = 'asc' | 'desc';

  interface Reservation {
    id: string;
    restaurant: string; // Adiciona o ID do restaurante para buscar os dados
    reservationDate: string;
    numberOfTables: number;
  }

  interface Restaurant {
    id: string;
    name: string;
    location: string;
    images: string[];
    description: string;
  }

  let sortOrder: SortOrder = 'asc';
  let reservations: Reservation[] = [];
  let restaurants: Record<string, Restaurant> = {}; // Objeto de restaurantes mapeados por ID
  let errorMessage: string = '';

  // Função para buscar os restaurantes
  async function fetchRestaurants() {
    try {
      const response = await fetch('http://localhost:3000/restaurants', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: Restaurant[] = await response.json();

      // Cria um objeto onde a chave é o ID do restaurante
      restaurants = data.reduce((acc, restaurant) => {
        acc[restaurant.id] = restaurant;
        return acc;
      }, {} as Record<string, Restaurant>);

    } catch (err) {
      errorMessage = 'Erro ao carregar restaurantes';
      console.error('Erro ao buscar restaurantes:', err);
    }
  }

  // Função para buscar as reservas do usuário
  async function fetchReservations(userId: string) {
    try {
      const response = await fetch(`http://localhost:3000/reservations?userId=${userId}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Erro ao buscar reservas');

      reservations = await response.json();
    } catch (error) {
      errorMessage = 'Erro ao carregar as reservas.';
      console.error(error);
    }
  }

  // Função executada quando a página é carregada
  onMount(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) {
        goto('/login');
        return;
      }

      await fetchRestaurants(); // Busca os restaurantes antes
      await fetchReservations(user.id); // Depois busca as reservas
    } catch (error) {
      errorMessage = 'Erro ao carregar a página';
      console.error(error);
    }
  });

  function isExpired(date: string): boolean {
    // Converter a data da reserva para o fuso horário local corretamente
    const reservationDate = new Date(date + 'T00:00:00'); // Adiciona a hora para evitar problemas com UTC
    const formattedReservationDate = reservationDate.toLocaleDateString('pt-BR').split('/').reverse().join('-');

    // Pegar a data de hoje e Formatar a data de hoje para 'yyyy-mm-dd'
    const today = new Date();
    const formattedToday = today.toLocaleDateString('pt-BR').split('/').reverse().join('-');

    console.log("Hoje:", formattedToday);
    console.log("Data da Reserva:", formattedReservationDate);

    // Comparar as duas datas
    return formattedReservationDate < formattedToday;
  }

  function formatDate(date: string): string {
    // Trata a data como sendo do tipo 'yyyy-MM-dd' (sem hora) e Força a data para o horário de São Paulo
    const reservationDate = new Date(date + 'T00:00:00-03:00'); // Adiciona a hora e o fuso horário de São Paulo

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Sao_Paulo',
    };

    // Converte para o formato local com o fuso correto
    return reservationDate.toLocaleString('pt-BR', options);
  }

  function sortReservations(order: SortOrder) {
    sortOrder = order;
    reservations = [...reservations].sort((a, b) => {
      const dateA = new Date(a.reservationDate).getTime();
      const dateB = new Date(b.reservationDate).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  function navigateToDetails(id: string) {
    goto(`/reservas/${id}`);
  }

  function handleSortChange(value: unknown) {
    const selectedValue = (value as { value: string }).value;
    if (selectedValue === 'asc' || selectedValue === 'desc') {
      sortReservations(selectedValue);
    }
  }
</script>


<div class="bg-background min-h-screen">
  <Navbar isSearchCentered={true} />

  <main class="container mx-auto p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-4xl font-bold text-center py-8">Minhas reservas</h1>
      <Select.Root onSelectedChange={handleSortChange}>
        <Select.Trigger class="w-44">
          <Select.Value placeholder="Ordenar por data">
            {sortOrder === 'asc' ? 'Mais antigas primeiro' : 'Mais recentes primeiro'}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="asc">Mais antigas primeiro</Select.Item>
          <Select.Item value="desc">Mais recentes primeiro</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each reservations as reservation}
        {#if restaurants[reservation.restaurant]}
          <Card.Root
            class="hover:bg-accent/5 flex cursor-pointer items-center gap-4 p-4 transition-colors {isExpired(
              reservation.reservationDate
            )
              ? 'opacity-60'
              : ''}"
            on:click={() => !isExpired(reservation.reservationDate) && navigateToDetails(reservation.id)}
            role="button"
            tabindex={0}
          >
            <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm">
              <img
                src={restaurants[reservation.restaurant]?.images[0] || '/placeholder.jpg'}
                alt={restaurants[reservation.restaurant]?.name || 'Restaurante'}
                class="h-full w-full object-cover"
              />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="truncate text-sm font-medium">{restaurants[reservation.restaurant]?.name}</h2>
              <p class="text-muted-foreground mt-0.5 truncate text-xs">{restaurants[reservation.restaurant]?.location}</p>
              <div class="text-muted-foreground mt-2 text-xs">
                <p>{formatDate(reservation.reservationDate)}</p>
                <p>Mesas: {reservation.numberOfTables}</p>
              </div>
            </div>
          </Card.Root>
        {/if}
      {/each}
    </div>
  </main>
</div>
