<script lang="ts">
    import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
    <h1 class="text-9xl font-bold text-[#3e7b31]">404</h1>
    <p class="mt-4 text-xl text-gray-600">Restaurante não encontrado</p>
    <Button 
        on:click={() => window.location.href = '/'}
        class="mt-8 bg-[#3e7b31] text-white hover:bg-[#0f500c]"
    >
        Voltar para Home
    </Button>
</div>