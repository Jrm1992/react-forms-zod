import { useForm } from "react-hook-form";
import {
  Button,
  Divisor,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
  UploadDescription,
  UploadIcon,
  UploadInput,
  UploadLabel,
  UploadTitulo,
} from "../../components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";

const esquemaCadastroEspecialistaEndereco = z.object({
  endereco: z.object({
    cep: z.string().min(8, "Informe um CEP valido"),
    rua: z.string().min(1, "A rua é obrigatória"),
    numero: z.coerce.number().min(1, "O número é obrigatório"),
    bairro: z.string().min(1, "O bairro é obrigatório"),
    localidade: z.string().min(1, "A localidade é obrigatória"),
  })
})

type formCadastroEspecialistaEndereco = z.infer<typeof esquemaCadastroEspecialistaEndereco>

type EnderecoProps = {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}

const CadastroEspecialistaEndereco = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<formCadastroEspecialistaEndereco>({
    resolver: zodResolver(esquemaCadastroEspecialistaEndereco),
    defaultValues: {
      endereco: {
        cep: "",
        rua: "",
        numero: 0,
        bairro: "",
        localidade: "",
      }
    }
  })

  const aoSubmeter = (dados: formCadastroEspecialistaEndereco) => {
    console.log(dados)
  }

  const handleSetDados = useCallback((dados: EnderecoProps) => {
    setValue("endereco.bairro", dados.bairro),
    setValue("endereco.localidade", dados.localidade + ", " + dados.uf),
    setValue("endereco.rua", dados.logradouro)
  }, [setValue])

  const buscarEndereco =  useCallback(async (cep: string) => {
    const result = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const dados = await result.json()

    handleSetDados(dados)
  }, [handleSetDados])

  const codigoCep = watch("endereco.cep")

  useEffect(() => {
    if(codigoCep.length !== 8) return;
    buscarEndereco(codigoCep)
  }, [buscarEndereco, codigoCep])

  return (
    <>
      <Titulo className="titulo">Para finalizar, só alguns detalhes!</Titulo>
      <Form onSubmit={handleSubmit(aoSubmeter)}>
        <>
          <UploadTitulo>Sua foto</UploadTitulo>
          <UploadLabel htmlFor="campo-upload">
            <UploadIcon />
            <UploadDescription>Clique para enviar</UploadDescription>
            <UploadInput accept="image/*" id="campo-upload" type="file" />
          </UploadLabel>
        </>

        <Divisor />
        <Fieldset>
          <Label htmlFor="campo-cep">CEP</Label>
          <Input id="campo-cep" placeholder="Insira seu CEP" type="text" {...register("endereco.cep")} $error={!!errors.endereco?.cep} />
          {errors.endereco?.cep && <ErrorMessage>{errors.endereco.cep.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input id="campo-rua" placeholder="Rua Agarikov" type="text" {...register("endereco.rua")} $error={!!errors.endereco?.rua}/>
          {errors.endereco?.rua && <ErrorMessage>{errors.endereco.rua.message}</ErrorMessage>}
        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input id="campo-numero-rua" placeholder="Ex: 1440" type="text" {...register("endereco.numero")} $error={!!errors.endereco?.numero} />
            {errors.endereco?.numero && <ErrorMessage>{errors.endereco.numero.message}</ErrorMessage>}
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input id="campo-bairro" placeholder="Vila Mariana" type="text" {...register("endereco.bairro")} $error={!!errors.endereco?.bairro}/>
            {errors.endereco?.bairro && <ErrorMessage>{errors.endereco.bairro.message}</ErrorMessage>}
          </Fieldset>
        </FormContainer>
        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            {...register("endereco.localidade")}
            $error={!!errors.endereco?.localidade}
          />
          {errors.endereco?.localidade && <ErrorMessage>{errors.endereco.localidade.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEspecialistaEndereco;
