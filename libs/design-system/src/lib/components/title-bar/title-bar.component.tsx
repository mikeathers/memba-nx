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
  AvatarCircle,
  AvatarCircleSmall,
  Circle,
  Container,
  LeftContent,
  Menu,
  MenuTitleContainer,
  Name,
  NameContainer,
  RightContent,
} from './title-bar.styles'
import {Button} from '../button'

export interface TitleBarProps {
  signUserOut: () => void
  user: MembaUser | null
  isLoading: boolean
  appName?: string
}
export const TitleBar = (props: TitleBarProps) => {
  const {signUserOut, user, isLoading, appName} = props

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
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Container>
      <LeftContent>
        <Circle />
        <Text type={'h3'}>{appName || 'Memba'}</Text>
      </LeftContent>
      <RightContent>
        {initials.firstInitial && initials.lastInitial ? (
          <AvatarCircle
            onClick={() => {
              handleSetIsComponentVisible(!localVisible)
            }}
          >
            <Text type={'h4'}>{initials.firstInitial}</Text>
            <Text type={'h4'}>{initials.lastInitial}</Text>
          </AvatarCircle>
        ) : (
          <LoadingSpinner />
        )}
        {localVisible && (
          <Menu ref={ref}>
            <MenuTitleContainer>
              <Text type={'body-bold'} $marginBottom={'space2x'}>
                Account
              </Text>
              <NameContainer>
                <AvatarCircleSmall>
                  <Text type={'body'}>{initials.firstInitial}</Text>
                  <Text type={'body'}>{initials.lastInitial}</Text>
                </AvatarCircleSmall>
                <Name>
                  <Text type={'body'}>{`${sentenceCase(user?.firstName)} ${sentenceCase(
                    user?.lastName,
                  )}`}</Text>
                  <Text type={'body'} $faded>
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

              <Link href={`${readFromEnv(Env.startApp)}/account`}>
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
