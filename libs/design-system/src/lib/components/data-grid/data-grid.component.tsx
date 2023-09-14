import {DataGrid as MUIDataGrid, GridColDef, GridRowsProp} from '@mui/x-data-grid'

interface DataGridComponentProps {
  columns: GridColDef[]
  rows: GridRowsProp
}

export const DataGrid = (props: DataGridComponentProps) => {
  const {columns, rows} = props
  return <MUIDataGrid columns={columns} rows={rows} />
}
