<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tabs from '$lib/components/ui/tabs';

	import { onMount } from "svelte";

	let loginEmail: string = "";
	let loginPassword: string = "";
	let registerFirstName: string = "";
	let registerLastName: string = "";
	let registerEmail: string = "";
	let registerPassword: string = "";

	const signIn = async () => {
		if (!loginEmail || !loginPassword) {
			alert("Por favor, preencha os campos de e-mail e senha.");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: loginEmail,
					password: loginPassword,
				}),
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage || "Erro ao fazer login");
			}

			const data = await response.json();

			// Se houver um token, armazena e redireciona
			if (data.access_token) {
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.user)); // Salva os dados do usuário
				window.location.href = `${window.location.origin}`;
			} else {
				alert("Login falhou. Verifique suas credenciais.");
			}
		} catch (error) {
			console.error("Erro ao logar:", error);
			alert("Erro ao fazer login: " + error.message);
		}
	};


	const signUp = async () => {
		if (!registerFirstName || !registerLastName || !registerEmail || !registerPassword) {
			alert("Por favor, preencha todos os campos.");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: registerFirstName,
					lastName: registerLastName,
					email: registerEmail,
					password: registerPassword,
				}),
			});

			// Se a resposta não for OK, pega a mensagem do backend
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Erro ao fazer cadastro");
			}

			alert("Cadastro realizado com sucesso!");

			// Redireciona para a página de login
			window.location.href = `${window.location.origin}/login`;
		} catch (error) {
			console.error("Erro ao cadastrar:", error);
			alert(error.message);
		}
	};
</script>

<div class="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto w-[350px]">
      <Tabs.Root value="login" class="w-full">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="login" class="data-[state=active]:text-[#3E7B31]">Login</Tabs.Trigger>
          <Tabs.Trigger value="register" class="data-[state=active]:text-[#3E7B31]">Cadastro</Tabs.Trigger>
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
                  <a href="##" class="ml-auto inline-block text-sm underline">Esqueceu sua senha?</a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  bind:value={loginPassword}
                  required
                />
              </div>
              <Button
                variant="outline"
                class="w-full bg-[#0E2E13] text-white hover:bg-[#0B2410]"
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
