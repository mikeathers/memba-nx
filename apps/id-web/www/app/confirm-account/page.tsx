import {ConfirmAccount} from '@memba-nx/id-web'
import {confirmAccount} from '@memba-nx/shared'

const ConfirmAccountPage = () => {
  const content = confirmAccount

  return <ConfirmAccount content={content} />
}

export default ConfirmAccountPage
