import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Avatar, Select } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { getService } from '../../../redux/service';


const itemsPage = 5

const columns = [
    {
        title: 'Tên', field: 'name'
    },
    {
        title: 'Trạng thái', field: 'active',

        render: rowData => (
            <div className={rowData.active ? 'staff-active' : 'staff-deactive'}>
                {rowData.active ? 'Hoạt động' : 'Ngưng hoạt động'}
            </div>
        )
    },

    {
        title: 'Chú thích', field: 'description'
    },
    {
        title: 'Hạng mục dịch vụ', field: 'category_name', render: rowData => (
            <div className="service-category-field">
                <Avatar style={{ width: '80px', height: '80px' }} alt={rowData.category_name} src={rowData.category_image} />
                <h4>
                    {rowData.category_name}
                </h4>
            </div>
        )
    },
]


const ServiceList = (props) => {


    const [active, setactive] = useState('');
    const [page, setpage] = useState(1);
    const [query, setquery] = useState('');
    const { control, handleSubmit, reset } = useForm();
    const dispatch = useDispatch()
    const { currentServicePage, services } = useSelector(state => state.service)

    const getServiceData = (page, query, active) => {
        const data = { itemsPage: itemsPage, page: page, query: query, active: active }
        dispatch(getService(data))
    }


    useEffect(() => {

        getServiceData(1, '', '')

    }, []);

    if (currentServicePage !== '1') {
        return null
    }

    const handleChangePage = (event, newPage) => {
        setpage(newPage)
        getServiceData(newPage, query, active)
    }

    const onSubmit = data => { // search
        setquery(data.query)
        setpage(1)
        getServiceData(1, data.query, active)
    };


    const handleActiveChange = (e) => {
        setactive(e.target.value)
        setpage(1)
        getServiceData(1, query, e.target.value)
    }


    const count = parseInt((Number(services?.[0]?.full_count) / itemsPage), 10) + (Number(services?.[0]?.full_count) % itemsPage === 0 ? 0 : 1)

    return (
        <div>

            <div className="service-search">
                <div className='form-submit-div'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            as={TextField}
                            variant="outlined"
                            className="packge-search-input"
                            label="Tìm kiếm"
                            name="query"
                            control={control}
                            defaultValue=''
                        />
                    </form>
                </div>
                <Select
                    native
                    value={active}
                    onChange={handleActiveChange}
                >
                    <option value={''}>Tất cả</option>
                    <option value={true}>Hoạt động</option>
                    <option value={false}>Dừng hoạt động</option>
                </Select>
            </div>
            <br />
            <br /><br />
            <MaterialTable
                title="Danh sách dịch vụ"
                options={{
                    search: false
                }}
                columns={columns}
                data={services}

                components={{
                    Pagination: props => (
                        <div>
                            <Pagination
                                defaultPage={page}
                                onChange={handleChangePage}
                                count={count}
                                className="paging-div-content"
                                rowsPerPage={itemsPage}
                                color="primary" />
                            <br />
                        </div>
                    )
                }}
            />
        </div>
    );
};

export default ServiceList;