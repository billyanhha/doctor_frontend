import React, { useState, useEffect } from 'react';
import './style.css'
import { Select, Avatar } from '@material-ui/core';
import ServiceCategory from './components/ServiceCategory';
import ServiceList from './components/ServiceList';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentServicePage } from '../../redux/service';
import { Spin } from 'antd';
import Navbar from '../../components/Navbar';


const Service = () => {

    const { isLoad } = useSelector(state => state.ui);
    const { currentServicePage } = useSelector(state => state.service)
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(setCurrentServicePage(e.target.value))
    }

    return (
        <div>
            <div className="default-form-div">
                <Navbar />
                <Spin size="large" spinning={isLoad}  >
                    <div className="service-div-content" >
                        <div className="filter-form-div">
                            <Select
                                native
                                value={currentServicePage}
                                onChange={handleChange}
                            >
                                <option value={1}>Dịch vụ</option>
                                <option value={2}>Hạng mục dịch vụ</option>
                            </Select>
                        </div>
                        <div className="service-content">
                            <React.Fragment>
                                <ServiceList />
                                <ServiceCategory />
                            </React.Fragment>
                        </div>
                    </div>
                </Spin>
            </div>
        </div>
    );
};

export default Service;