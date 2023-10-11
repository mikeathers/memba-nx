import axios from 'axios'
import {axiosUploadsInstance} from '@memba-nx/shared'

export async function uploadToS3({
  fileType,
  fileContents,
}: {
  fileType: string
  fileContents: File
}) {
  const presignedPostUrl = await getPresignedPostUrl(fileType)

  console.log({presignedPostUrl})

  const formData = new FormData()
  formData.append('Content-Type', fileType)
  Object.entries(presignedPostUrl.fields).forEach(([k, v]) => {
    formData.append(k, v)
  })
  formData.append('file', fileContents) // The file has be the last element

  await axios.post(presignedPostUrl.url, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  })

  return presignedPostUrl.filePath
}

type PresignedPostUrlResponse = {
  url: string
  fields: {
    key: string
    acl: string
    bucket: string
  }
  filePath: string
}

const GET_PRESIGNED_URL_API_PATH = 'get-presigned-url-s3'

async function getPresignedPostUrl(fileType: string) {
  const response = await axiosUploadsInstance.request<PresignedPostUrlResponse>({
    url: `/${GET_PRESIGNED_URL_API_PATH}?fileType=${fileType}`,
    method: 'GET',
  })
  console.log({response})

  return response.data
}
