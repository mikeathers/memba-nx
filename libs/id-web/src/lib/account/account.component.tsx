'use client'
import {FormEvent} from 'react'

import {Button, Text} from '@memba-labs/design-system'
import {
  AccountContent,
  Env,
  readFromEnv,
  updateTenantAccount,
  updateUsersAccount,
  useMembaDetails,
} from '@memba-nx/shared'

import Camera from './camera-24.svg'
import {WithAuth} from '../hoc'
import {AvatarContainer, Container, UploadButton} from './account.styles'
import {useFileChange} from './use-file-change'
import {uploadToS3} from './upload-file'
import {object, string} from 'yup'

interface AccountProps {
  content: AccountContent
}

const CameraIcon = Camera as any
const Account = (props: AccountProps) => {
  const {content} = props
  const {updateUser, user} = useMembaDetails()

  const {fileError, fileName, fileContents, fileType, fileDispatch, handleFileChange} =
    useFileChange()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (fileType && fileContents) {
        const filePath = await uploadToS3({fileType, fileContents})
        const s3Url = `${readFromEnv(Env.imageUploadBucketName)}${filePath}`
        fileDispatch({type: 'RESET_FILE_STATE'})

        if (user) {
          const updatedUser = {...user, avatar: s3Url}
          updateUser(updatedUser)

          if (user.isTenantAdmin) {
            await updateTenantAccount(updatedUser)
          } else {
            await updateUsersAccount(updatedUser)
          }
        }
      }
    } catch (err) {
      console.log('error is', err)
    }
  }

  const formSchema = object({
    emailAddress: string()
      .required(content.form.validation.emailAddress)
      .email(content.form.validation.emailAddressFormat),
    firstName: string().required(content.form.validation.firstName),
    lastName: string().required(content.form.validation.lastName),
  })

  const handleImageInput = () => {
    document.getElementById('image-input')?.click()
  }

  const size = 32
  return (
    <Container>
      <Text type={'h3'}>{content.heading}</Text>
      <form onSubmit={handleSubmit}>
        <AvatarContainer>
          <UploadButton onClick={handleImageInput}>
            <CameraIcon
              height={size}
              width={size}
              style={{
                display: 'inline-flex',
                width: size,
                height: size,
              }}
            />
            <img src={user?.avatar} />
            <input
              type="file"
              accept="image/png, image/jpeg"
              id="image-input"
              name="image-input"
              onChange={handleFileChange}
              style={{display: 'none'}}
            />
          </UploadButton>
        </AvatarContainer>

        <Button type={'submit'} $variant={'primary'}>
          Upload
        </Button>

        {fileError && <h1>{fileError}</h1>}
      </form>
    </Container>
  )
}
export default WithAuth(Account)
