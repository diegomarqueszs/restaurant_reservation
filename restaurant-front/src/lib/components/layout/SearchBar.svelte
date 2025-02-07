<script lang="ts">
  import { Search } from 'lucide-svelte';
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import { createEventDispatcher } from 'svelte';
  import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
  import { cn } from '$lib/utils.js';

  const dispatch = createEventDispatcher();

  export let service = '';
  export let location = '';
  let value: DateValue | undefined = undefined;
  
  const df = new DateFormatter('pt-BR', { dateStyle: 'medium' });

  function handleSearch(event?: SubmitEvent) {
      event?.preventDefault();
      
      const params = new URLSearchParams();
      
      if (service) params.append('restaurante', service);
      if (location) params.append('local', location);
      if (value) {
          const formattedDate = value.toDate(getLocalTimeZone()).toISOString();
          params.append('data', formattedDate);
      }

      const searchUrl = `${window.location.origin}/search?${params.toString()}`;
      window.location.href = searchUrl;

      dispatch('search', { service, location, date: value ? value.toDate(getLocalTimeZone()).toISOString() : '' });
  }

  function handleKeyPress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
          handleSearch();
      }
  }

  const inputClasses = `h-10 bg-transparent placeholder:text-gray-600 border-0 outline-none ring-0 focus:ring-0 
      focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-transparent 
      focus:border-b-2 transition-[border-color] duration-200 ease-in-out`;
</script>

<form on:submit={handleSearch} class="flex items-center justify-center">
  <div class="flex w-5/6 items-center gap-2 rounded-full border bg-white p-2 shadow-sm">
      <div class="flex-1">
          <Input 
              type="text" 
              placeholder="Restaurante" 
              bind:value={service} 
              class={inputClasses}
              on:keypress={handleKeyPress}
          />
      </div>

      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <div class="h-6 w-px bg-gray-200" />

      <div class="flex-1">
          <Input 
              type="text" 
              placeholder="Onde" 
              bind:value={location} 
              class={inputClasses}
              on:keypress={handleKeyPress}
          />
      </div>

      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <div class="h-6 w-px bg-gray-200" />

      <Popover.Root>
          <Popover.Trigger asChild let:builder>
              <Button 
                  variant="ghost" 
                  class={cn(
                      'h-10 flex-1 justify-start px-2 font-normal hover:bg-transparent',
                      !value && 'text-gray-600'
                  )}
                  builders={[builder]}
              >
                  <div class="flex w-full items-center">
                      <div class="flex-grow text-left">
                          {value ? df.format(value.toDate(getLocalTimeZone())) : 'Quando'}
                      </div>
                      <CalendarIcon class="h-4 w-4 text-gray-500" />
                  </div>
              </Button>
          </Popover.Trigger>
          <Popover.Content class="w-auto p-0">
              <Calendar bind:value initialFocus />
          </Popover.Content>
      </Popover.Root>

      <Button 
          type="submit"
          size="icon" 
          class="ml-2 rounded-full bg-green-700 hover:bg-green-800"
      >
          <Search class="h-5 w-5" />
      </Button>
  </div>
</form>

<style>
  :global(input) {
      outline: none !important;
      box-shadow: none !important;
  }
  :global(input:focus) {
      outline: none !important;
      box-shadow: none !important;
  }
  :global(input:focus-visible) {
      outline: none !important;
      box-shadow: none !important;
  }
</style>