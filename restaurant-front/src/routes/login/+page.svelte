<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Toaster } from '$lib/components/ui/sonner';

	let loginEmail = '';
	let loginPassword = '';
	let registerFirstName = '';
	let registerLastName = '';
	let registerEmail = '';
	let registerPassword = '';

	const signIn = async () => {
		if (!loginEmail || !loginPassword) {
			toast.error('Por favor, preencha os campos de e-mail e senha.');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/auth/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: loginEmail, password: loginPassword })
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message || 'Erro ao fazer login');
			}

			localStorage.setItem('token', responseData.access_token);
			localStorage.setItem('user', JSON.stringify(responseData.user));

			toast.success('Login realizado com sucesso!', {
				description: 'Redirecionando...'
			});

			setTimeout(() => {
				window.location.href = `${window.location.origin}`;
			}, 1500);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
			console.error('Erro ao logar:', errorMessage);
			toast.error(`Erro ao fazer login: ${errorMessage}`);
		}
	};

	const signUp = async () => {
		if (!registerFirstName || !registerLastName || !registerEmail || !registerPassword) {
			toast.error('Por favor, preencha todos os campos.');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: registerFirstName,
					lastName: registerLastName,
					email: registerEmail,
					password: registerPassword
				})
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message || 'Erro ao fazer cadastro');
			}

			toast.success('Cadastro realizado com sucesso!', {
				description: 'Redirecionando para o login...'
			});

			setTimeout(() => {
				window.location.href = `${window.location.origin}/login`;
			}, 1500);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
			console.error('Erro ao cadastrar:', errorMessage);
			toast.error(errorMessage);
		}
	};
</script>

<div class="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto w-[350px]">
			<Toaster />

			<Tabs.Root value="login" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="login" class="data-[state=active]:text-[#3E7B31]">Login</Tabs.Trigger
					>
					<Tabs.Trigger value="register" class="data-[state=active]:text-[#3E7B31]"
						>Cadastro</Tabs.Trigger
					>
				</Tabs.List>

				<!-- Login -->
				<Tabs.Content value="login" class="mt-6">
					<div class="grid gap-6">
						<div class="grid gap-2 text-center">
							<h1 class="text-3xl font-bold">Login</h1>
							<p class="text-muted-foreground text-balance">
								Entre com seu email abaixo para acessar sua conta
							</p>
						</div>
						<div class="grid gap-4">
							<div class="grid gap-2">
								<Label for="login-email">Email</Label>
								<Input
									id="login-email"
									type="email"
									placeholder="meu-email@exemplo.com"
									bind:value={loginEmail}
									required
								/>
							</div>
							<div class="grid gap-2">
								<div class="flex items-center">
									<Label for="login-password">Senha</Label>
									<a href="##" class="ml-auto inline-block text-sm underline">Esqueceu sua senha?</a
									>
								</div>
								<Input id="login-password" type="password" bind:value={loginPassword} required />
							</div>
							<Button
								variant="outline"
								class="w-full bg-[#0E2E13] text-white hover:bg-[#0B2410] hover:text-white"
								on:click={signIn}
							>
								Entrar
							</Button>
						</div>
					</div>
				</Tabs.Content>

				<!-- Cadastro -->
				<Tabs.Content value="register" class="mt-6">
					<div class="grid gap-6">
						<div class="grid gap-2 text-center">
							<h1 class="text-3xl font-bold">Cadastro</h1>
							<p class="text-muted-foreground text-balance">
								Preencha suas informações para criar uma conta
							</p>
						</div>
						<div class="grid gap-4">
							<div class="grid grid-cols-2 gap-4">
								<div class="grid gap-2">
									<Label for="first-name">Nome</Label>
									<Input
										id="first-name"
										placeholder="João"
										bind:value={registerFirstName}
										required
									/>
								</div>
								<div class="grid gap-2">
									<Label for="last-name">Sobrenome</Label>
									<Input
										id="last-name"
										placeholder="Silva"
										bind:value={registerLastName}
										required
									/>
								</div>
							</div>
							<div class="grid gap-2">
								<Label for="register-email">Email</Label>
								<Input
									id="register-email"
									type="email"
									placeholder="meu-email@exemplo.com"
									bind:value={registerEmail}
									required
								/>
							</div>
							<div class="grid gap-2">
								<Label for="register-password">Senha</Label>
								<Input
									id="register-password"
									type="password"
									bind:value={registerPassword}
									required
								/>
							</div>
							<Button
								type="button"
								class="w-full bg-[#0E2E13] text-white hover:bg-[#0B2410]"
								on:click={signUp}
							>
								Criar conta
							</Button>
							<script lang="ts">
								import { toast } from 'svelte-sonner';
								import { Button } from '$lib/components/ui/button/index.js';
							</script>
						</div>
					</div>
				</Tabs.Content>
			</Tabs.Root>

			<div class="flex items-center justify-center p-4">
				<a
					href="/"
					class="font-bold text-[#0E2E13] underline underline-offset-4 transition-colors hover:text-[#3E7B31]"
				>
					Acessar como Visitante
				</a>
			</div>
		</div>
	</div>

	<div class="hidden h-screen w-full items-center justify-center bg-[#3E7B31] lg:flex">
		<img
			src="/logo-bppt.png"
			alt="placeholder"
			class="max-w-xs dark:brightness-[0.8] dark:grayscale"
		/>
	</div>
</div>
