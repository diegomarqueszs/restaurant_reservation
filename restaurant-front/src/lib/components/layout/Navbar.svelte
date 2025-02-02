<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Menu from 'lucide-svelte/icons/menu';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import SearchBar from '$lib/components/layout/SearchBar.svelte';
	import { fade } from 'svelte/transition';

	export let isSearchCentered: boolean = false;

    function handleSearch(event: CustomEvent) {
      const searchData = event.detail;
      console.log('Search data:', searchData);
    }
</script>

<header class="sticky top-0 flex h-24 items-center gap-4 px-4 md:px-6 z-50 relative bg-[#3e7b31] shadow-lg">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2">
        <img src="/logo-bppt.png" alt="Company Logo" class="h-8" />
    </a>

    <!-- SearchBar condicionalmente centralizado com padding -->
    {#if isSearchCentered}
        <div class="flex-1 flex justify-center" in:fade={{ duration: 125 }} out:fade={{ duration: 300 }}>
            <div class="w-full max-w-5xl">
                <SearchBar on:search={handleSearch} />
            </div>
        </div>
    {/if}

    <div class="ml-auto">
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost" size="icon" class="text-white">
                    <CircleUser class="h-8 w-8" />
                    <span class="sr-only">Open menu</span>
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="z-[60]">
                <DropdownMenu.Label>Minha Conta</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Minhas Reservas</DropdownMenu.Item>
                <DropdownMenu.Item>Logout</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
</header>
