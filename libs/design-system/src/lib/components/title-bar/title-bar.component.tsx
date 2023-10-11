'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'

import {
  useComponentVisible,
  sentenceCase,
  MembaUser,
  readFromEnv,
  Env,
} from '@memba-nx/shared'

import {Text} from '../text'
import {LoadingSpinner} from '../loading-spinner'

import {
  ActionsContainer,
  InitialsCircle,
  InitialsCircleSmall,
  Circle,
  Container,
  LeftContent,
  Menu,
  MenuTitleContainer,
  Name,
  NameContainer,
  RightContent,
  AvatarCircle,
  AvatarCircleSmall,
} from './title-bar.styles'
import {Button} from '../button'
import {router} from 'next/client'
import {useRouter} from 'next/navigation'

export interface TitleBarProps {
  signUserOut: () => void
  user: MembaUser | null
  isLoading: boolean
  appName?: string
}
export const TitleBar = (props: TitleBarProps) => {
  const {signUserOut, user, appName} = props
  const router = useRouter()

  const [initials, setInitials] = useState<{firstInitial: string; lastInitial: string}>({
    firstInitial: '',
    lastInitial: '',
  })

  const {ref, isComponentVisible, handleSetIsComponentVisible} =
    useComponentVisible(false)

  const [localVisible, setLocalVisible] = useState<boolean>()

  useEffect(() => {
    if (isComponentVisible) {
      setLocalVisible(true)
    } else setLocalVisible(false)
  }, [isComponentVisible])

  useEffect(() => {
    if (user) {
      const firstNameInitial = user?.firstName?.charAt(0).toUpperCase()
      const lastNameInitial = user?.lastName?.charAt(0).toUpperCase()

      setInitials({firstInitial: firstNameInitial, lastInitial: lastNameInitial})
    }
  }, [user?.firstName, user?.lastName])

  const handleLogout = async () => {
    signUserOut()
    router.replace(`${readFromEnv(Env.idApp)}/login`)
  }

  const handleAvatar = () => {
    if (!user) {
      return <LoadingSpinner />
    }
    if (user?.avatar) {
      return (
        <AvatarCircle
          onClick={() => {
            handleSetIsComponentVisible(!localVisible)
          }}
        >
          <img src={user?.avatar} />
        </AvatarCircle>
      )
    }

    if (!user?.avatar) {
      return (
        <InitialsCircle
          onClick={() => {
            handleSetIsComponentVisible(!localVisible)
          }}
        >
          <Text type={'h4'}>{initials.firstInitial}</Text>
          <Text type={'h4'}>{initials.lastInitial}</Text>
        </InitialsCircle>
      )
    }
  }

  return (
    <Container>
      <LeftContent>
        <Circle />
        <Text type={'h3'}>{appName || 'Memba'}</Text>
      </LeftContent>
      <RightContent>
        {handleAvatar()}
        {localVisible && (
          <Menu ref={ref}>
            <MenuTitleContainer>
              <Text type={'body-bold'} $marginBottom={'space2x'}>
                Account
              </Text>
              <NameContainer>
                <InitialsCircleSmall>
                  <Text type={'body'}>{initials.firstInitial}</Text>
                  <Text type={'body'}>{initials.lastInitial}</Text>
                </InitialsCircleSmall>
                <Name>
                  <Text type={'body'} $lineHeight={'small'}>{`${sentenceCase(
                    user?.firstName,
                  )} ${sentenceCase(user?.lastName)}`}</Text>
                  <Text type={'body'} $faded $lineHeight={'small'}>
                    {user?.emailAddress}
                  </Text>
                </Name>
              </NameContainer>
            </MenuTitleContainer>
            <ActionsContainer>
              {user?.isTenantAdmin ? (
                <Link href={`${readFromEnv(Env.startApp)}/apps`}>
                  <Button
                    $variant={'text'}
                    onClick={() => {
                      handleSetIsComponentVisible(!localVisible)
                    }}
                  >
                    Apps
                  </Button>
                </Link>
              ) : (
                <Link href={`${readFromEnv(Env.startApp)}/memberships`}>
                  <Button
                    $variant={'text'}
                    onClick={() => {
                      handleSetIsComponentVisible(!localVisible)
                    }}
                  >
                    Memberships
                  </Button>
                </Link>
              )}

              <Link href={`${readFromEnv(Env.idApp)}/account`}>
                <Button
                  $variant={'text'}
                  onClick={() => {
                    handleSetIsComponentVisible(!localVisible)
                  }}
                >
                  Account
                </Button>
              </Link>
              <Button $variant={'text'} onClick={handleLogout}>
                Log out
              </Button>
            </ActionsContainer>
          </Menu>
        )}
      </RightContent>
    </Container>
  )
}
