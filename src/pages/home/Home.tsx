import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
    streetSearch,
    getDistricts,
    getDistrictsAndStreets,
} from '../../store/search/search.slice'
import { Input } from '../../components/UI/input'
import { Button } from '../../components/UI/button'
import { Select } from '../../components/UI/select'
import { Table } from '../../components/UI/table'
import type { SearchFormValue } from '../../types/searchForm'
import styles from './home.module.css'

export const Home = () => {
    const dispatch = useAppDispatch()
    const { searchData, districts, districtsAndStreets, loading, error } =
        useAppSelector((state) => state.search)

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
        const { name } = data
        if (!name.trim()) return
        dispatch(streetSearch(data))
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
                            required: 'Введите название улицы',
                            minLength: {
                                value: 2,
                                message: 'Минимум 2 символа',
                            },
                        })}
                    />
                    <Select
                        placeholder="Выберите район"
                        options={districts}
                        error={errors.district?.message}
                        {...register('district', {
                            required: 'Не выбрали район',
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
                <Table
                    data={
                        searchData.length === 0
                            ? districtsAndStreets
                            : searchData
                    }
                />
            </div>
        </div>
    )
}
