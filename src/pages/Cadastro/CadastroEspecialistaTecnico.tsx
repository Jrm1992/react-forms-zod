import { useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  ButtonContainer,
  Divisor,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
} from "../../components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const esquemaCadastroEspecialista = z.object({
  crm: z.string().min(1, "O CRM é obrigatório"),
  especialidades: z.array(z.object({
    especialidade: z.string().min(1, "A especialidade é obrigatória"),
    anoConclusao: z.number().min(1, "O ano de conclusão é obrigatório"),
    instituicao: z.string().min(1, "A instituição é obrigatória"),
  }))
})

type FormEspecialista = z.infer<typeof esquemaCadastroEspecialista>

const CadastroEspecialistaTecnico = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<FormEspecialista>({
    resolver: zodResolver(esquemaCadastroEspecialista),
    mode: "all",
    defaultValues: {
      crm: "",
    }
  })

  const aoSubmeter = (dados: FormEspecialista) => {
    console.log(dados)
  }

  const { fields, append } = useFieldArray({
    control,
    name: "especialidades",
  })

  const adicionarEspecialidade = () => {
    append({
      especialidade: "",
      anoConclusao: 0,
      instituicao: "",
    })
  }

  return (
    <>
      <Titulo className="titulo">Agora, seus dados técnicos:</Titulo>
      <Form onSubmit={handleSubmit(aoSubmeter)}>
        <Fieldset>
          <Label>CRM</Label>
          <Input
            id="campo-crm"
            type="text"
            placeholder="Insira seu número de registro"
            $error={!!errors.crm}
            {...register("crm")}
          />
          {errors.crm && <ErrorMessage>{errors.crm.message}</ErrorMessage>}
        </Fieldset>
        <Divisor />
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <Fieldset>
                <Label>Especialidade</Label>
                <Input
                  id="campo-especialidade"
                  type="text"
                  placeholder="Qual sua especialidade?"
                  {...register(`especialidades.${index}.especialidade`)}
                />
              </Fieldset>

              <FormContainer>
                <Fieldset>
                  <Label>Ano de conclusão</Label>
                  <Input id="campo-ano-conclusao" type="text" placeholder="2005" {...register(`especialidades.${index}.anoConclusao`)} />
                </Fieldset>
                <Fieldset>
                  <Label>Instituição de ensino</Label>
                  <Input
                    id="campo-instituicao-ensino"
                    type="text"
                    placeholder="USP"
                    {...register(`especialidades.${index}.instituicao`)}
                  />
                </Fieldset>
              </FormContainer>
              <Divisor />
            </div>
          )
        })}
        <ButtonContainer>
          <Button type="button" onClick={adicionarEspecialidade} $variante="secundario">
            Adicionar Especialidade
          </Button>
        </ButtonContainer>
        <Button type="submit">Avançar</Button>
      </Form>
    </>
  );
};

export default CadastroEspecialistaTecnico;
