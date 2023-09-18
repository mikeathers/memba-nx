import {
  DataGrid as MUIDataGrid,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import {useEffect, useState} from 'react'

interface DataGridComponentProps {
  columns: GridColDef[]
  rows: GridRowsProp
  rowSelectionHandler: <R>(item: R | undefined) => void
}

export const DataGrid = (props: DataGridComponentProps) => {
  const {columns, rows, rowSelectionHandler} = props
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>()

  const rowSelectedHandler = (ids: GridRowSelectionModel) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id))
    rowSelectionHandler(selectedRowsData)
  }
  return (
    <MUIDataGrid
      columns={columns}
      rows={rows}
      onRowSelectionModelChange={rowSelectedHandler}
      rowSelectionModel={rowSelectionModel}
    />
  )
}
