"use client";
import { useEffect, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, Input, VStack, FormControl, FormLabel, FormErrorMessage, Heading } from "@chakra-ui/react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const auth = useContext(AuthContext);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect logged-in users to /dashboard
  useEffect(() => {
    if (auth?.isAuthenticated) {
      router.push("/dashboard");
    }
  }, [auth?.isAuthenticated, router]);

  if (!auth) return null;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await auth.login(data.usuario, data.senha);
      router.push("/dashboard"); // Redirect after login
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao fazer login");
      }
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="100px">
      <Heading mb="4">Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="4">
          <FormControl isInvalid={!!errors.usuario}>
            <FormLabel>Usuário</FormLabel>
            <Input {...register("usuario")} />
            <FormErrorMessage>{errors.usuario?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.senha}>
            <FormLabel>Senha</FormLabel>
            <Input type="password" {...register("senha")} />
            <FormErrorMessage>{errors.senha?.message}</FormErrorMessage>
          </FormControl>

          {errorMessage && <Box color="red.500">{errorMessage}</Box>}

          <Button type="submit" colorScheme="blue">Entrar</Button>
        </VStack>
      </form>
    </Box>
  );
}
