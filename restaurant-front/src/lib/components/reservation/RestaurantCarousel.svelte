<script lang="ts">
    import * as Carousel from '$lib/components/ui/carousel/index.js';
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { onMount } from 'svelte';

    export let images: string[] = [];

    let imageLoaded: boolean[] = [];
    let loading = true;

    $: imageLoaded = new Array(images.length).fill(false);

    onMount(() => {
        loading = false;
    });

    function handleImageLoad(index: number) {
        imageLoaded[index] = true;
    }
</script>

{#if loading}
    <div class="relative max-w-[800px] flex-1">
        <Skeleton class="h-[550px] w-full rounded-lg" />
    </div>
{:else if images && images.length > 0}
    <div class="relative max-w-[800px] flex-1">
        {#if images.length === 1}
            <div class="h-[550px] w-full rounded-lg">
                <div class="relative h-full">
                    {#if !imageLoaded[0]}
                        <Skeleton class="absolute inset-0 h-full w-full rounded-lg" />
                    {/if}
                    <img 
                        src={images[0]} 
                        alt="Restaurant" 
                        class="h-full w-full rounded-lg object-cover transition-opacity duration-300" 
                        on:load={() => handleImageLoad(0)}
                        style={`opacity: ${imageLoaded[0] ? '1' : '0'};`}
                    />
                </div>
            </div>
        {:else}
            <Carousel.Root class="relative h-[550px]">
                <Carousel.Content>
                    {#each images as img, i}
                        <Carousel.Item>
                            <div class="h-[550px] w-full rounded-lg">
                                <div class="relative h-full">
                                    {#if !imageLoaded[i]}
                                        <Skeleton class="absolute inset-0 h-full w-full rounded-lg" />
                                    {/if}
                                    <img 
                                        src={img} 
                                        alt="Restaurant" 
                                        class="h-full w-full rounded-lg object-cover transition-opacity duration-300" 
                                        on:load={() => handleImageLoad(i)}
                                        style={`opacity: ${imageLoaded[i] ? '1' : '0'};`}
                                    />
                                </div>
                            </div>
                        </Carousel.Item>
                    {/each}
                </Carousel.Content>
                
                <Carousel.Previous
                    class="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/50 p-2 transition-colors hover:bg-white/80"
                />
                <Carousel.Next
                    class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/50 p-2 transition-colors hover:bg-white/80"
                />
            </Carousel.Root>
        {/if}
    </div>
{:else}
    <div class="h-[550px] max-w-[800px] flex-1 rounded-lg bg-[#3e7b31] flex items-center justify-center">
        <span class="text-white text-lg">Sem imagem</span>
    </div>
{/if}
