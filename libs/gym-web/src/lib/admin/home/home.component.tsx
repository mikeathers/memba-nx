'use client'
import React from 'react'

import {
  AdminHomeContent,
  interpolateContent,
  sentenceCase,
  useMembaDetails,
} from '@memba-nx/shared'
import {Text, DataGrid} from '@memba-labs/design-system'

import {Container, ListContainer} from './home.styles'
import {GridColDef, GridRowsProp} from '@mui/x-data-grid'
import {WithAdmin} from '../../hoc'

interface HomeProps {
  content: AdminHomeContent
}

const Home: React.FC<HomeProps> = (props) => {
  const {content} = props
  const {user} = useMembaDetails()

  const app = user?.tenant.apps.find((app) => app.type === 'gym-management')
  const users = app?.users

  const rows: GridRowsProp =
    users?.map((user) => ({
      id: user.id,
      col1: sentenceCase(user.firstName),
      col2: sentenceCase(user.lastName),
      col3: user.emailAddress,
      col4: 'Basic',
    })) ?? []

  const columns: GridColDef[] = [
    {field: 'col1', headerName: 'First name', width: 150},
    {field: 'col2', headerName: 'Last name', width: 150},
    {field: 'col3', headerName: 'Email address', width: 250},
    {field: 'col4', headerName: 'Membership', width: 150},
  ]

  const handleRowClick = <R,>(item: R) => {
    console.log({item})
  }
  return (
    <Container>
      <Text type={'h1'} $marginBottom={'space10x'}>
        {interpolateContent(content.heading, undefined, {
          firstName: () => <span key={0}>{sentenceCase(user?.firstName)}</span>,
        })}
      </Text>
      <Text type={'h3'} $marginBottom={'space2x'}>
        {content.users}
      </Text>
      <ListContainer>
        <DataGrid columns={columns} rows={rows} rowSelectionHandler={handleRowClick} />
      </ListContainer>
    </Container>
  )
}

export default WithAdmin(Home)
