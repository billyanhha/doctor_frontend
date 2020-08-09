import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Avatar, Select } from '@material-ui/core';
import {Pagination} from '@material-ui/lab';
import { getServiceCategory } from '../../../redux/service';

const itemsPage = 5

const columns = [
    {
        title: 'Loại dịch vụ', field: 'category_name', render: rowData => (
            <div className="service-category-field">
                <Avatar style={{ width: '80px', height: '80px' }} alt={rowData.name} src={rowData.image} />
                <h4>
                    {rowData.name}
                </h4>
            </div>
        )
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
]



const ServiceCategory = (props) => {
    const { currentServicePage, categorires } = useSelector(state => state.service)
    const { control, handleSubmit } = useForm();
    const [page, setpage] = useState(1);
    const [active, setactive] = useState('');
    const [query, setquery] = useState('');
    const dispatch = useDispatch()



    const getServiceCategoryData = (page, query, active) => {
        const data = { itemsPage: itemsPage, page: page, query: query, active: active }
        dispatch(getServiceCategory(data))
    }


    useEffect(() => {

        getServiceCategoryData(1, '', '')


    }, []);

    if (currentServicePage !== '2') {
        return null
    }


    const handleChangePage = (event, newPage) => {
        setpage(newPage)
        getServiceCategoryData(newPage, query, active)
    }

    const onSubmit = data => { // search
        setquery(data.query)
        setpage(1)
        getServiceCategoryData(1, data.query, active)
    };

    const handleActiveChange = (e) => {
        setactive(e.target.value)
        setpage(1)
        getServiceCategoryData(1, query, e.target.value)
    }


    const count = parseInt((Number(categorires?.[0]?.full_count) / itemsPage), 10) + (Number(categorires?.[0]?.full_count) % itemsPage === 0 ? 0 : 1)


    return (
        <div>
            <div>
                
                <div className="service-search">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            as={TextField}
                            variant="outlined"
                            className="packge-search-input"
                            label="Tìm kiếm"
                            placeholder="Tên loại dịch vụ ..."
                            name="query"
                            autoFocus
                            control={control}
                            defaultValue=''
                        />
                    </form>
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
                    title="Danh sách các hạng mục dịch vụ"
                    options={{
                        search: false
                    }}
                    columns={columns}
                    data={categorires}
                    components={{
                        Pagination: props => (
                            <div>
                                <Pagination
                                    defaultPage={page}
                                    onChange={handleChangePage}
                                    count={count}
                                    rowsPerPage={itemsPage}
                                    color="primary" />
                                <br />
                            </div>
                        )
                    }}

                />
            </div>
        </div>
    );
};

export default ServiceCategory;