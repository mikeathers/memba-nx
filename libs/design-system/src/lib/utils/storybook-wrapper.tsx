import {ReactNode} from 'react'

const styles = {
  paddingTop: '50px',
  margin: '0 auto',
}

interface StorybookWrapperProps {
  children: ReactNode
  width?: 'extra-small' | 'small' | 'medium' | 'large' | 'full-width' | number
}

const useWidth = (width: string | number) => {
  if (width === 'extra-small') return '27%'
  if (width === 'small') return '40%'
  if (width === 'medium') return '70%'
  if (width === 'large') return '80%'
  if (width === 'full-width') return '100%'
  return `${width}px`
}

export const StorybookWrapper: React.FC<StorybookWrapperProps> = ({
  children,
  width = 'large',
}) => {
  const styling = {
    ...styles,
    width: useWidth(width),
  }

  return <div style={styling}>{children}</div>
}
