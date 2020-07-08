import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import JoditEditor from "jodit-react";
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updatePackage } from '../../../redux/package';
import _ from "lodash"

const config = {
    readonly: false // all options from https://xdsoft.net/jodit/doc/
}

const EditForm = (props) => {

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui)
    const { currentDoctor } = useSelector(state => state.doctor)
    const { packageResultForm } = useSelector(state => state.form);
    const [disable, setdisable] = useState(false);
    const [content, setContent] = useState(props?.content ?? '');
    const editor = useRef(null)

    const id = props.match.params.id

    useEffect(() => {
        console.log(                    packageResultForm
            );
        
        if (props?.editfor === 'result_content' && !props?.content) {
            if (!_.isEmpty(packageResultForm?.content)) {
                setContent(
                    packageResultForm?.content
                )
            }
        }
    }, []);

    const submitForm = () => {
        setdisable(true);
        let data = {}
        data.doctor_id = currentDoctor?.id
        data.package_id = id;
        data.content = content;
        if (props?.editfor === 'result_content') {
            data.editfor = 'result_content'
        }
        if (props?.editfor === 'plan_overview') {
            data.editfor = 'plan_overview'
        }
        dispatch(updatePackage(data))
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

export default withRouter(EditForm);