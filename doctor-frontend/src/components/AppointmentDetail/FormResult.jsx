import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import JoditEditor from "jodit-react";
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateAppointmentPackage } from '../../redux/package';
import _ from "lodash"

const config = {
    readonly: false // all options from https://xdsoft.net/jodit/doc/
}

const FormResult = (props) => {

    const { currentAppointment } = props;

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui)
    const { currentDoctor } = useSelector(state => state.doctor)
    const { appointmentResultForm } = useSelector(state => state.form);
    const { token } = useSelector(state => state.auth)
    const [disable, setdisable] = useState(false);
    const [content, setContent] = useState('');
    const editor = useRef(null)

    const id = props.match.params.id

    useEffect(() => {
        if (!currentAppointment?.result_content) {
            if (!_.isEmpty(appointmentResultForm?.content)) {
                setContent(
                    appointmentResultForm?.content
                )
            }
        } else {
            setContent(currentAppointment?.result_content)
        }
    }, [currentAppointment]);

    const submitForm = () => {
        setdisable(true);
        let data = {}
        data.token = token;
        data.result_content = content
        let doctorId = currentDoctor?.id
        let appointmentId = currentAppointment.id
        let packageId = props.match.params.id
        dispatch(updateAppointmentPackage(data, appointmentId, doctorId, packageId))
        props.close()
        setTimeout(() => {
            setdisable(false);
        }, 1000);
    }

    return (
        <div>
            <JoditEditor
                required
                ref={editor}
                value={content}
                config={config}
                zIndex={1}
                height='800px'
                tabIndex={1} // tabIndex of textarea
                onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            // onChange={newContent => console.log(newContent)}
            />
            <br />
            <Button
                loading={disable || isLoad}
                onClick={submitForm} type="primary"
            >Gửi</Button>
        </div>
    );
};

export default withRouter(FormResult);