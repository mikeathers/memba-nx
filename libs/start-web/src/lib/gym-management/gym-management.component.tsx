'use client'
import React, {useState} from 'react'
import {useRouter} from 'next/navigation'

import {PricingCard, Text, TextInput, Button, Loading} from '@memba-labs/design-system'
import {
  createGymApp,
  useSafeAsync,
  useMembaDetails,
  GymManagementContent,
  MembershipPricing,
  TIERS,
  Tenant,
  PAGE_ROUTES,
} from '@memba-nx/shared'

import {
  Container,
  CenterContent,
  GoBackLink,
  GymNameContainer,
  Content,
  TiersContainer,
  GymUrlContainer,
  GymMembershipsContainer,
  AddedMembershipContainer,
  GymDetailsForm,
  GymMembershipsInputs,
  CreateGymManagementButtonContainer,
} from './gym-management.styles'

interface GymManagementProps {
  content: GymManagementContent
}

export const GymManagement: React.FC<GymManagementProps> = (props) => {
  const {content} = props
  const {user} = useMembaDetails()
  const {run, isLoading} = useSafeAsync()
  const [gymName, setGymName] = useState<string>('')
  const [parsedGymName, setParsedGymName] = useState<string>('')
  const [selectedTier, setSelectedTier] = useState<string>(TIERS.FREE)
  const [membership, setMembership] = useState<MembershipPricing>({name: '', price: 0})
  const [memberships, setMemberships] = useState<MembershipPricing[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const [showAppCreationLoading, setShowAppCreationLoading] = useState<boolean>()

  // useEffect(() => {
  //   const gymApp = user?.tenant.apps.find((item) => item.type === 'gym-management')
  //   if (gymApp) {
  //     router.push(gymApp.url)
  //   }
  // }, [user])

  const handleSelectClick = (tier: string) => {
    setSelectedTier(tier)
  }

  const handleSetGymName = (gymName: string) => {
    const gymNameWithNoSpecialCharacters = gymName.replace(/[^a-zA-Z ]/g, '')
    const parsedGymNameForUrl = gymNameWithNoSpecialCharacters
      .replace(' ', '')
      .toLowerCase()
    setParsedGymName(parsedGymNameForUrl)
    setGymName(gymNameWithNoSpecialCharacters)
  }

  const handleAddMembership = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMemberships([...memberships, membership])
    setMembership({name: '', price: 0})
  }

  const handleSubmit = async () => {
    if (!gymName) {
      setFormError(content.noGymNameError)
      return
    }
    if (memberships.length < 1) {
      setFormError(content.noMembershipsError)
      return
    }

    const result = await run(
      createGymApp({
        gymName,
        tenantId: user?.tenantId || '',
        tier: selectedTier,
        memberships,
        tenantAdminEmailAddress: user?.emailAddress || '',
        user,
      }),
    )

    if (result) {
      setShowAppCreationLoading(true)
      const gymApp = (result as Tenant).apps.find((app) => app.name === gymName)
      setTimeout(() => router.push(gymApp?.url || ''), 5000)
    }
  }

  if (showAppCreationLoading)
    return <Loading message={content.appCreationLoadingMessage} />

  return (
    <Container>
      <GoBackLink href={PAGE_ROUTES.APPS}>
        <Text type={'body'}>{content.goBack}</Text>
      </GoBackLink>

      <CenterContent>
        <Content>
          <Text type={'h1'} $marginBottom={'space2x'}>
            {content.heading}
          </Text>
          <Text type={'body'}>Choose a tier to get started</Text>
          <TiersContainer>
            <PricingCard
              titleNumber={content.freeTierTitleNumber}
              titleText={content.freeTierTitleText}
              pricePerMonth={content.freeTierPricePerMonth}
              numberOfCustomers={content.freeTierNumberOfCustomer}
              transactionalCosts={content.transactionalCosts}
              selectClick={() => handleSelectClick(TIERS.FREE)}
              select={content.select}
              selectedText={content.selectedText}
              findOutMore={content.findOutMore}
              findOutMoreClick={() => null}
              selected={selectedTier === TIERS.FREE}
            />
            <PricingCard
              titleNumber={content.basicTierTitleNumber}
              titleText={content.basicTierTitleText}
              pricePerMonth={content.basicTierPricePerMonth}
              numberOfCustomers={content.basicTierNumberOfCustomer}
              transactionalCosts={content.transactionalCosts}
              selectClick={() => handleSelectClick(TIERS.BASIC)}
              select={content.select}
              selectedText={content.selectedText}
              findOutMore={content.findOutMore}
              findOutMoreClick={() => null}
              selected={selectedTier === TIERS.BASIC}
            />
            <PricingCard
              titleNumber={content.premiumTierTitleNumber}
              titleText={content.premiumTierTitleText}
              pricePerMonth={content.premiumTierPricePerMonth}
              numberOfCustomers={content.premiumTierNumberOfCustomer}
              transactionalCosts={content.transactionalCosts}
              selectClick={() => handleSelectClick(TIERS.PREMIUM)}
              select={content.select}
              selectedText={content.selectedText}
              findOutMore={content.findOutMore}
              findOutMoreClick={() => null}
              selected={selectedTier === TIERS.PREMIUM}
            />
          </TiersContainer>

          <GymDetailsForm>
            <Text type={'h3'}>{content.gymDetails}</Text>

            <GymNameContainer>
              <TextInput
                label={content.gymNameLabel}
                placeholder={content.gymNamePlaceholder}
                onChange={(e) => handleSetGymName(e.target.value)}
              />
              <GymUrlContainer>
                <Text type={'body-small'} $marginBottom={'spaceHalfx'}>
                  {content.gymUrlLabel}
                </Text>
                {gymName ? (
                  <Text
                    type={'body-bold'}
                  >{`${parsedGymName}${content.gymUrlSuffix}`}</Text>
                ) : (
                  <Text type={'body-small'}>{content.gymNameExample}</Text>
                )}
              </GymUrlContainer>
            </GymNameContainer>

            <Text type={'h3'} $marginBottom={'space2x'}>
              {content.gymMembershipsTitle}
            </Text>
            <GymMembershipsContainer>
              <GymMembershipsInputs>
                <TextInput
                  label={content.gymMembershipName}
                  placeholder={content.gymMembershipNamePlaceholder}
                  onChange={(e) => setMembership({...membership, name: e.target.value})}
                  value={membership.name}
                />
                <TextInput
                  label={content.gymMembershipPrice}
                  placeholder={content.gymMembershipPricePlaceholder}
                  type={'number'}
                  onChange={(e) =>
                    setMembership({...membership, price: Number(e.target.value)})
                  }
                  value={membership.price}
                />
              </GymMembershipsInputs>

              <Button $variant={'text'} onClick={handleAddMembership}>
                {content.addMembership}
              </Button>
            </GymMembershipsContainer>

            <Text type={'h3'} $marginBottom={'space3x'}>
              {content.yourMemberships}
            </Text>
            {memberships.length < 1 ? (
              <Text type={'body-small'}>{content.noMemberships}</Text>
            ) : (
              memberships.map((item) => (
                <AddedMembershipContainer key={item.name}>
                  <Text
                    type={'body-bold'}
                    $marginRight={'space2x'}
                    $marginBottom={'space1x'}
                  >
                    {item.name}
                  </Text>
                  <Text type={'body'}>£{item.price}/pm</Text>
                </AddedMembershipContainer>
              ))
            )}
          </GymDetailsForm>

          {formError && (
            <Text $marginTop={'space6x'} type={'body'} color={'reds500'}>
              {formError}
            </Text>
          )}

          <CreateGymManagementButtonContainer>
            <Button
              $variant={'primary'}
              onClick={handleSubmit}
              $isLoading={isLoading}
              $isDisabled={isLoading}
            >
              {content.createCta}
            </Button>
          </CreateGymManagementButtonContainer>
        </Content>
      </CenterContent>
    </Container>
  )
}
