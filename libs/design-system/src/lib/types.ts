import React from 'react'

export interface ClassNamesApiProps<T> {
  classNames?: T
}

export interface ClassNameProps {
  className?: string
  children?: React.ReactNode | undefined
}
