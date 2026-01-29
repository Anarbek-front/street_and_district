import type { FC } from 'react'
import styles from './table.module.css'

export type TableRow = {
    id: string
    street: string
    district: string
}

type TableProps = {
    data: TableRow[]
}

export const Table: FC<TableProps> = ({ data }) => {
    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Улица</th>
                        <th>Район</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.street}</td>
                            <td>{item.district}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
