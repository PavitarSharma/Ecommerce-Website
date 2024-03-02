import React from 'react'
import { IProduct } from '../../types'

interface IGridViewProps {
    products: IProduct[]
}

const GridView: React.FC<IGridViewProps> = () => {
  return (
    <div>GridView</div>
  )
}

export default GridView