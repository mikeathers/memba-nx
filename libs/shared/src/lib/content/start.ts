import {
  AccountContent,
  AppsContent,
  GymManagementContent,
  MembershipsContent,
} from '../types'

export const appsContent: AppsContent = {
  heading: 'Your apps',
  gymManagementTitle: 'Gym Management',
  noAppsMessage: "It looks like you don't have any apps...",
  addAppMessage: 'Lets create one',
}

export const membershipsContent: MembershipsContent = {
  heading: 'Your memberships',
}

export const accountContent: AccountContent = {
  heading: 'Account details',
}
export const gymManagementContent: GymManagementContent = {
  heading: 'Gym Management',
  goBack: 'Go back',
  gymDetails: 'Gym Details',
  gymNameLabel: 'Enter the name of your gym',
  gymNamePlaceholder: "e.g. Joe's Gym",
  gymNameExample: 'example.memba.co.uk',
  gymUrlSuffix: '.memba.co.uk',
  gymUrlLabel: 'Url for your website:',
  gymMembershipsTitle: 'Set up your gym memberships',
  gymMembershipName: 'Membership name',
  gymMembershipNamePlaceholder: 'e.g. Basic',
  gymMembershipPricePlaceholder: 'e.g. 20',
  gymMembershipPrice: 'Price per month (£)',
  yourMemberships: 'Your memberships',
  noMemberships: 'Add a membership to get started',
  addMembership: 'Add membership',
  createCta: 'Create gym management app',
  noMembershipsError: 'At least one membership is need.',
  noGymNameError: 'A gym name is required.',
  freeTierTitleText: 'Free',
  freeTierTitleNumber: '#1',
  freeTierPricePerMonth: '£0.00/pm',
  freeTierNumberOfCustomer: 'Up to 5 customers',
  basicTierTitleText: 'Basic',
  basicTierTitleNumber: '#2',
  basicTierPricePerMonth: '£30.00/pm',
  basicTierNumberOfCustomer: 'Up to 200 customers',
  premiumTierTitleText: 'Premium',
  premiumTierTitleNumber: '#3',
  premiumTierPricePerMonth: '£50.00/pm',
  premiumTierNumberOfCustomer: 'Unlimited customers',
  transactionalCosts: 'We will charge you 1% per transaction you make within the app',
  select: 'Select',
  selectedText: 'Selected',
  findOutMore: 'Find out more',
}
