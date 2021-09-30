import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return(
    <>
     <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="md" bgColor="pGray.800"  maxW={900} maxH={635}>
          <ModalBody p={0}>            
            <Image    
              borderTopRadius="md"          
              width="100%"
              height="100%"
              maxW={900}
              maxH={600}
              src={imgUrl}
              objectFit='cover'
            />            
          </ModalBody>

          <ModalFooter pt={2} pb={2} pl={2} justifyContent="flex-start" fontSize="0.8em">
            <Link href={imgUrl} isExternal>Abrir original</Link>                        
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
