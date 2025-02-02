<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<div class="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto w-[350px]">
			<Tabs.Root value="login" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="login" class="data-[state=active]:text-[#3E7B31]">Login</Tabs.Trigger
					>
					<Tabs.Trigger value="register" class="data-[state=active]:text-[#3E7B31]"
						>Cadastro</Tabs.Trigger
					>
				</Tabs.List>

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
								<Input id="login-email" type="email" placeholder="meu-email@exemplo.com" required />
							</div>
							<div class="grid gap-2">
								<div class="flex items-center">
									<Label for="login-password">Senha</Label>
									<a href="##" class="ml-auto inline-block text-sm underline">
										Esqueceu sua senha?
									</a>
								</div>
								<Input id="login-password" type="password" required />
							</div>
							<Button type="submit" class="w-full bg-[#0E2E13] text-white hover:bg-[#0B2410]">
								Entrar
							</Button>
						</div>
					</div>
				</Tabs.Content>

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
									<Input id="first-name" placeholder="João" required />
								</div>
								<div class="grid gap-2">
									<Label for="last-name">Sobrenome</Label>
									<Input id="last-name" placeholder="Silva" required />
								</div>
							</div>
							<div class="grid gap-2">
								<Label for="register-email">Email</Label>
								<Input
									id="register-email"
									type="email"
									placeholder="meu-email@exemplo.com"
									required
								/>
							</div>
							<div class="grid gap-2">
								<Label for="register-password">Senha</Label>
								<Input id="register-password" type="password" required />
							</div>
							<Button type="submit" class="w-full bg-[#0E2E13] text-white hover:bg-[#0B2410]">
								Criar conta
							</Button>
						</div>
					</div>
				</Tabs.Content>
			</Tabs.Root>
			<div class="flex items-center justify-center p-4">
				<a
				  href="/"
				  class="text-[#0E2E13] underline underline-offset-4 transition-colors font-bold hover:text-[#3E7B31]"
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
