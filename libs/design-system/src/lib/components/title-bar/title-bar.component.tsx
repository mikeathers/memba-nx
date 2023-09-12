'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'

import {useComponentVisible, sentenceCase, MembaApp, MembaUser} from '@memba-nx/shared'

import {Text} from '../text'
import {LoadingSpinner} from '../loading-spinner'
import {spacingTokens} from '../../styles'

import {
  ActionButton,
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

export interface TitleBarProps {
  routes: {
    accountSettings: string
    memberships: string
  }
  signUserOut: () => void
  user: MembaUser | null
  isLoading: boolean
}
export const TitleBar = (props: TitleBarProps) => {
  const {routes, signUserOut, user, isLoading} = props

  const [initials, setInitials] = useState<{firstInitial: string; lastInitial: string}>({
    firstInitial: '',
    lastInitial: '',
  })

  const [appName, setAppName] = useState<string>('')
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

  useEffect(() => {
    const tenant = user?.tenant?.apps.find(
      (item: MembaApp) => item.type === 'gym-management',
    )
    const appName = tenant?.name || 'Memba'
    setAppName(appName)
  }, [user?.tenant])

  const handleLogout = async () => {
    // router.push(CONFIG.PAGE_ROUTES.LOGIN)
    signUserOut()
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Container>
      <LeftContent>
        <Circle />
        <Text type={'h2'}>{appName}</Text>
      </LeftContent>
      <RightContent>
        <AvatarCircle
          onClick={() => {
            handleSetIsComponentVisible(!localVisible)
          }}
        >
          <Text type={'h4'}>{initials.firstInitial}</Text>
          <Text type={'h4'}>{initials.lastInitial}</Text>
        </AvatarCircle>
        {localVisible && (
          <Menu ref={ref}>
            <MenuTitleContainer>
              <Text type={'body-bold'} $marginBottomX={spacingTokens.space2x}>
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
              <Link href={routes.memberships}>
                <ActionButton variant={'text'}>Memberships</ActionButton>
              </Link>
              <Link href={routes.accountSettings}>
                <ActionButton variant={'text'}>Account settings</ActionButton>
              </Link>
              <ActionButton variant={'text'} onClick={handleLogout}>
                Log out
              </ActionButton>
            </ActionsContainer>
          </Menu>
        )}
      </RightContent>
    </Container>
  )
}
