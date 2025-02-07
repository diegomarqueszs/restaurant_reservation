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
    name: string;
    location: string;
    date: string;
    tables: string;
    value: string;
    images: string[];
    description: string;
  }

  let sortOrder: SortOrder = 'asc';
  let reservations = [];

  // Função para fazer a requisição ao backend
  onMount(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) {
        window.location.href = "/login";
        return;
      }
      
      // Realiza a requisição para o backend para pegar as reservas
      const response = await fetch(`http://localhost:3000/reservations?userId=${user.id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar as reservas');
      }

      // Exibe as reservas obtidas
      const data = await response.json();
      reservations = data;
    } 
	catch (error) {
      alert("Erro ao carregar as reservas.");
      console.error(error);
    }
  });


  function isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  function formatDate(date: string): string {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  function sortReservations(order: SortOrder) {
    sortOrder = order;

    reservations = [...reservations].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      const comparison = dateA - dateB;
      const result = order === 'asc' ? comparison : -comparison;
      return result;
    });
  }

  function navigateToDetails(id: string) {
    goto(`/reservas/${id}`);
  }

  function handleKeyDown(event: KeyboardEvent | CustomEvent<any>, reservation: Reservation) {
    if ('key' in event && event.key === 'Enter' && !isExpired(reservation.date)) {
      navigateToDetails(reservation.id);
    }
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
        <Card.Root
          class="hover:bg-accent/5 flex cursor-pointer items-center gap-4 p-4 transition-colors {isExpired(
            reservation.reservationDate
          )
            ? 'opacity-60'
            : ''}"
          on:click={() => !isExpired(reservation.reservationDate) && navigateToDetails(reservation.id)}
          on:keydown={(e) => handleKeyDown(e, reservation)}
          role="button"
          tabindex={0}
        >
          <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm">
            <img
              src={reservation.images[0]}
              alt={reservation.name}
              class="h-full w-full object-cover"
            />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-sm font-medium">{reservation.name}</h2>
            <p class="text-muted-foreground mt-0.5 truncate text-xs">{reservation.location}</p>
            <div class="text-muted-foreground mt-2 text-xs">
              <p>{formatDate(reservation.reservationDate)}</p>
              <p>Mesas: {reservation.numberOfTables}</p>
            </div>
          </div>
        </Card.Root>
      {/each}
    </div>
  </main>
</div>
