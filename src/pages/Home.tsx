import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
    axiosSearch,
    getDistricts,
    getDistrictsAndStreets,
} from '../store/search/search.slice'
import { Input } from '../components/UI/input'
import { Button } from '../components/UI/button'
import { Select } from '../components/UI/select/Select'
import styles from './home.module.css'
import { Table } from '../components/UI/table'

export type SearchFormValue = {
    name: string
    district: string
}


export const Home = () => {
    const dispatch = useAppDispatch()
    const { searchData, districts, districtsAndStreets, loading, error } = useAppSelector(
        (state) => state.search,
    )

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchFormValue>({
        defaultValues: {
            name: '',
            district: '',
        },
    })

    const onSubmit = (data: SearchFormValue) => {
        const { name, district } = data
        if (!name.trim()) return
        dispatch(axiosSearch(data))
        console.log(district)
    }

    useEffect(() => {
        dispatch(getDistricts())
        dispatch(getDistrictsAndStreets())
    }, [dispatch])

    return (
        <div className={styles.home}>
            <div className={styles.form_container}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        placeholder="Поиск..."
                        fullWidth
                        error={errors.name?.message}
                        {...register('name', {
                            required: 'Введите улицу или район',
                            minLength: {
                                value: 2,
                                message: 'Минимум 2 символа',
                            },
                        })}
                    />
                    <Select
                        placeholder="Выберите"
                        options={districts}
                        error={errors.district?.message}
                        {...register('district', {
                            required: 'Выберите',
                            minLength: {
                                value: 2,
                                message: 'Вы не выбрали',
                            },
                        })}
                    />
                    <Button
                        type="submit"
                        className=""
                        isLoading={isSubmitting}
                        disabled={loading}
                    >
                        {loading ? 'Поиск...' : 'Найти'}
                    </Button>
                    {error && <p className={styles.error_text}>{error}</p>}
                </form>
            </div>
            <div className="list_of_streets">
                <Table data={!error ? {searchData.length === 0 ? districtsAndStreets: searchData} : []} />
            </div>
        </div>
    )
}
