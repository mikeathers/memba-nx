import {Meta, StoryObj} from '@storybook/react'
import {DataGrid} from './data-grid.component'
import {GridColDef, GridRowsProp} from '@mui/x-data-grid'

const Story: Meta<typeof DataGrid> = {
  title: 'Components/Data Grid',
  component: DataGrid,
}
export default Story

const rows: GridRowsProp = [
  {id: 1, col1: 'Hello', col2: 'World'},
  {id: 2, col1: 'DataGridPro', col2: 'is Awesome'},
  {id: 3, col1: 'MUI', col2: 'is Amazing'},
]

const columns: GridColDef[] = [
  {field: 'col1', headerName: 'Column 1', width: 150},
  {field: 'col2', headerName: 'Column 2', width: 150},
]

const handler = <T,>(items: T) => {
  console.log({items})
}

export const Primary: StoryObj<typeof DataGrid> = {
  render: () => <DataGrid columns={columns} rows={rows} rowSelectionHandler={handler} />,
}
