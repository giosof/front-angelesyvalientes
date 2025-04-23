import { Box, FileUpload, Icon } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"

const PhotoDropzone = ({personId} : {personId: string}) => {
  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Arrastra tu foto aquí</Box>
          <Box color="fg.muted">.png, .jpg hasta 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

export default PhotoDropzone