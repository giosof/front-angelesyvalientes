import { Box, Input, Icon, Image, Button } from "@chakra-ui/react"
import { LuUpload, LuX } from "react-icons/lu"
import { useState } from "react"
import { updateProfilePictureUrl } from "../helpers/api"

const PhotoDropzone = ({personId} : {personId: string}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreview(null)
  }

  const handleUpdateProfilePicture = async () => {
    if (!selectedFile) {
      alert("Por favor selecciona una imagen primero")
      return
    }

    setIsLoading(true)
    try {
      const response = await updateProfilePictureUrl(personId, selectedFile)
      if (response) {
        alert("Foto de perfil actualizada correctamente")
      } else {
        throw new Error("Error al actualizar la foto")
      }
    } catch (error) {
      alert("No se pudo actualizar la foto de perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="xl">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        display="none"
        id="file-upload"
      />
      <Box
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="md"
        p={4}
        textAlign="center"
        cursor="pointer"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Icon as={LuUpload} boxSize={8} color="gray.500" />
        <Box mt={2}>Arrastra tu foto aquí</Box>
        <Box color="gray.500" fontSize="sm">.png, .jpg hasta 5MB</Box>
      </Box>
      
      {preview && (
        <Box mt={4} position="relative" display="inline-block">
          <Image
            src={preview}
            alt="Preview"
            boxSize="100px"
            objectFit="cover"
            borderRadius="md"
          />
          <Button
            position="absolute"
            top={-2}
            right={-2}
            size="sm"
            colorScheme="red"
            onClick={handleRemoveFile}
          >
                <LuX />
          </Button>
          <Button
            mt={2}
            colorScheme="blue"
            disabled={isLoading}
            onClick={handleUpdateProfilePicture}
            width="100%"
          >
            {isLoading ? "Actualizando..." : "Actualizar Foto"}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PhotoDropzone