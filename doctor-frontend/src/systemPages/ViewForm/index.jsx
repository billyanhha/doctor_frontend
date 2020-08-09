import React, { useState, useEffect, useRef } from 'react';
import "./style.css"
import { Select, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getForm } from '../../redux/form';
import JoditEditor from "jodit-react";
import { Spin } from 'antd';
import Navbar from '../../components/Navbar';
import _ from 'lodash';

const config = {
    readonly: true, // all options from https://xdsoft.net/jodit/doc/,
    toolbar: false
}


const Form = () => {

    const editor = useRef(null)

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const { currentForm } = useSelector(state => state.form)

    const [content, setContent] = useState(currentForm?.content ?? '');
    const [currentFormIndex, setcurrentForm] = useState('package_result_form');

    useEffect(() => {

        dispatch(getForm(currentFormIndex));
        

    }, []);

    useEffect(() => {

        setContent(currentForm?.content ?? '')

    }, [currentForm]);

    const handleChange = (e) => {
        setcurrentForm(e.target.value)
        dispatch(getForm(e.target.value))
    }

    return (
        <div>
            <div className="default-form-div">
                <Navbar />
                <Spin size="large" spinning={isLoad}  >

                    <div className="form-div-content">
                        <div className="filter-form-div">
                    <Select
                        native
                        value={currentFormIndex}
                        onChange={handleChange}
                    >
                        <option value={'package_result_form'}>Văn bản kết quả gói</option>
                        <option value={'appointment_result_form'}>Văn bản kết quả dịch vụ</option>
                    </Select>
                    </div>
                    <div className="edit-form">
                        <JoditEditor
                           required
                           ref={editor}
                           value={content}
           
                           config={config}
                           zIndex={1}
                           tabIndex={1} // tabIndex of textarea
                           onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                       // onChange={newContent => console.log(newContent)}
                        />
                        <br />

                    </div>
                    </div>
                </Spin>
            </div>

        </div>
    );
};

export default Form;