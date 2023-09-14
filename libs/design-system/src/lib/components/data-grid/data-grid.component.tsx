import {DataGrid, GridColDef, GridRowsProp} from '@mui/x-data-grid'

interface DataGridComponentProps {
  columns: GridColDef[]
  rows: GridRowsProp
}

export const DataGridComponent = (props: DataGridComponentProps) => {
  const {columns, rows} = props
  return <DataGrid columns={columns} rows={rows} />
}
