import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',

      validate: {        
        lessThan10MB: (files : FileList) => { if (files[0]?.size > (1024 * 1024 * 10)) {return 'O arquivo deve ser menor que 10MB'} else {return true}},
        acceptedFormats: (files : FileList) => {
          if ( (/image\/(gif|jpe?g|png)$/i).test(files[0]?.type) ) { return true} else {return 'Somente são aceitos arquivos PNG, JPEG e GIF'}
        }                
      } 
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: 'Título obrigatório',
      minLength:{
         value: 2,
         message: 'Mínimo de 2 caracteres'
      },
      maxLength:{
        value: 20,
        message: 'Máximo de 20 caracteres'
     }
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: 'Descrição obrigatória',
      maxLength:{
         value: 65,
         message: 'Máximo de 65 caracteres'
      }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation( async ( dados : Record<string, unknown> ) => {
    // TODO MUTATION API POST REQUEST,
    const response = await api.post('/api/images', dados)
  },{
    // TODO ONSUCCESS MUTATION
    onSuccess: () => {
      queryClient.invalidateQueries('images')
    }
  })
  

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {      
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      console.log(imageUrl)

      if (!imageUrl || imageUrl === ''){
        toast({
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }

      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync({title : data.title, description : data.description, url: imageUrl})

      // TODO SHOW SUCCESS TOAST
      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          error={errors?.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register("image", formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          error={errors?.title}
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register("title", formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          error={errors?.description}
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register("description", formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
