<script lang="ts">
  import { fade } from 'svelte/transition';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import CardList from '$lib/components/layout/CardList.svelte';
  import FilterBar from '$lib/components/layout/FilterBar.svelte';
  import SearchBar from '$lib/components/layout/SearchBar.svelte';
  
  let isSearchCentered = false;
  let searchQuery = '';
  let selectedFilter = '';
  
  function handleFilterChange(event: CustomEvent) {
      selectedFilter = event.detail.filterId;
      console.log('Selected filter:', selectedFilter);
  }
  
  function handleSearch(event: CustomEvent) {
      searchQuery = event.detail;
      console.log('Search data:', searchQuery);
  }
  
  function handleScroll() {
      isSearchCentered = window.scrollY > 120;
  }
  
  import { onMount } from 'svelte';
  onMount(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  });
</script>

<div class="flex min-h-screen w-full flex-col">
  <Navbar {isSearchCentered}>
  </Navbar>

  <main class="flex-1 bg-gray-50">
      <div class="max-w-7xl mx-auto p-4">
          <div class="mb-8">
              <h1 class="text-4xl font-bold text-center py-8">Encontre os melhores restaurantes!</h1>
              <div class="transition-all h-[58px]">
                  {#if !isSearchCentered}
                      <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
                          <SearchBar 
                              on:search={handleSearch}
                          />
                      </div>
                  {/if}
              </div>
          </div>
          <FilterBar on:filterChange={handleFilterChange} />
          <CardList {searchQuery} {selectedFilter} />
      </div>
  </main>
</div>