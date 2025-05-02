import { Box, FileUpload, Float, Icon, useFileUploadContext } from "@chakra-ui/react"
import { LuUpload, LuX } from "react-icons/lu"

const PhotoDropzone = ({personId} : {personId: string}) => {
  const fileUpload = useFileUploadContext()
  const files = fileUpload.acceptedFiles
  if (files.length === 0) return null

  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" accept="image/*">
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
      <FileUpload.ItemGroup>
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            boxSize="20"
            p="2"
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage />
            <Float placement="top-end">
              <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
    </FileUpload.Root>
  )
}

export default PhotoDropzone